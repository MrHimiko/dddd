<?php
    
    return new Class()
    {
        private string $html = '';

        public function init(Addon $addon, mixed $blocks = []): string
        {
            if(!is_array($blocks))
            {
                return '';
            }

            $this->html = '';

            foreach($blocks as $block)
            {
                if(!is_object($block))
                {
                    continue;
                }

                if(!property_exists($block, 'type'))
                {
                    $this->html .= '<p>Invalid format of a block.</p>'; 
                    continue;
                }

                if(method_exists($this, $block->type))
                {
                    $this->html .= $this->{$block->type}($block);
                }
                else
                {
                    $this->html .= '<p>Invalid or unsupported block type: "'.sanitize($block->type).'".</p>'; 
                }
            }

            return $this->html;
        }

        /* Header */
        private function header(object $block, array $css = [])
        {
           /* Validate */
            if(
                !isset($block->data)        || !is_object($block->data) ||
                !isset($block->data->text)  || !is_string($block->data->text) || 
                !isset($block->data->level) || !is_integer($block->data->level)
            )
            {
                return;
            }

            /* Tunes */
            if(isset($block->tunes) && is_object($block->tunes))
            {
                $tunes = &$block->tunes;

                /* Align Tune */
                if(isset($tunes->alignTune) && is_object($tunes->alignTune))
                {
                    /* Alignment */
                    if(isset($tunes->alignTune->alignment) && is_string($tunes->alignTune->alignment) && $tunes->alignTune->alignment)
                    {
                        $css[] = 'text-align: ' . $block->tunes->alignTune->alignment;
                    }
                }
            }

            $level = $block->data->level;
            $css = count($css) ? ' style="' . implode(';', $css) . '"' : '';
                
            $this->html .= "<h$level$css>" . $block->data->text . "</h$level>";
        }

        // Parahraph
        private function paragraph(object $block, array $css = [], array $classes = []): void
        {
            /* Validate */
            if(
                !isset($block->data)       || !is_object($block->data) ||
                !isset($block->data->text) || !is_string($block->data->text)
            )
            {
                return;
            }

            /* Tunes */
            if(isset($block->tunes) && is_object($block->tunes))
            {
                $tunes = &$block->tunes;

                /* Align Tune */
                if(isset($tunes->alignTune) && is_object($tunes->alignTune))
                {
                    /* Alignment */
                    if(isset($tunes->alignTune->alignment) && is_string($tunes->alignTune->alignment) && $tunes->alignTune->alignment)
                    {
                        $css[] = 'text-align: ' . $block->tunes->alignTune->alignment;
                    }
                }

                /* Alert Variant */
                if(isset($tunes->alertVariant) && is_string($tunes->alertVariant) && $tunes->alertVariant)
                {
                    $classes[] = 'dh-rich-text-' . $tunes->alertVariant;
                }
            }

            $css = count($css) ? ' style="' . implode(';', $css) . '"' : '';
            $classes = count($classes) ? ' class="' . implode(' ', $classes) . '"' : '';

            $this->html .= "<p$css$classes>" . $block->data->text . '</p>';
        }

        // Quote
        private function quote(object $block): void
        {
            /* Validate */
            if(
                !isset($block->data)          || !is_object($block->data) ||
                !isset($block->data->text)    || !is_string($block->data->text) ||
                !isset($block->data->caption) || !is_string($block->data->caption)
            )
            {
                return;
            }

            if(strlen($block->data->caption))
            {
                $caption = '<cite>' . $block->data->caption . '</cite>';
            }

            $this->html .= '<blockquote>' . $block->data->text . (isset($caption) ? $caption : '') . '</blockquote>';
        }

        // Raw
        private function raw(object $block): void
        {
            /* Validate */
            if(
                !isset($block->data)       || !is_object($block->data) ||
                !isset($block->data->html) || !is_string($block->data->html)
            )
            {
                return;
            }

            $this->html .= $block->data->html;
        }

        // Code
        private function code(object $block): void
        {
            /* Validate */
            if(
                !isset($block->data)       || !is_object($block->data) ||
                !isset($block->data->code) || !is_string($block->data->code)
            )
            {
                return;
            }

            $this->html .= '<pre><code>' . $block->data->code . '</code></pre>';
        }

        // Delimiter
        private function delimiter(object $block): void
        {
            $this->html .= '<hr />';
        }

        // Image
        private function image(object $block, array $figure = [], array $image = []): void
        {
            /* Validate */
            if(
                !isset($block->data)            || !is_object($block->data) ||
                !isset($block->data->file)      || !is_object($block->data->file) ||
                !isset($block->data->file->url) || !is_string($block->data->file->url) || 
                !isset($block->data->caption)   || !is_string($block->data->caption) 
            )
            {
                return;
            }

            $figure[] = 'dh-rich-text-image';

            if(isset($block->data->withBackground) && $block->data->withBackground)
            {
                $figure[] = 'background';
                $image[] = 'background';
            }

            if(isset($block->data->withBorder) && $block->data->withBorder)
            {
                $figure[] = 'border';
            }

            if(isset($block->data->stretched) && $block->data->stretched)
            {
                $image[] = 'stretched';
            }

            $caption = '';
            $alt = '';

            if(strlen($block->data->caption))
            {
                $caption = '<figcaption>' . $block->data->caption . '</figcaption>';
                $alt = ' alt="' . $block->data->caption . '"';
            }

            $figure = count($figure) ? ' class="' . implode(' ', $figure) . '"' : '';
            $image = count($image) ? ' class="' . implode(' ', $image) . '"' : '';

            $this->html .= "<figure$figure>";
            $this->html .= "<img$image$alt src=\"" . sanitize($block->data->file->url) . "\">";
            $this->html .= $caption;
            $this->html .= "</figure>";
        }

        /* List */
        private function list(object $block): void
        {
            /* Validate */
            if(
                !isset($block->data)        || !is_object($block->data) ||
                !isset($block->data->items) || !is_array($block->data->items) ||
                !isset($block->data->style) || !is_string($block->data->style) 
            )
            {
                return;
            }

            $type = $block->data->style === 'ordered' ? 'ol' : 'ul';

            $this->html .= "<$type>" . $this->listRender($block->data->items, $type) . "</$type>";
        }

        private function listRender(array $items, string $type): string
        {
            $list = '';

            foreach($items as $item)
            {
                if(
                    !is_object($item)      ||
                    !isset($item->items)   || !is_array($item->items) ||
                    !isset($item->content) || !is_string($item->content)
                )
                {
                    continue;
                }

                $list .= '<li>' . $item->content . '</li>';

                if(count($item->items))
                {
                    $list .= "<$type>" . $this->listRender($item->items, $type) . "</$type>";
                }

                $list .= '</li>';
            }

            return $list;
        }

        /* Table */
        private function table(object $block): void
        {
            /* Validate */
            if(
                !isset($block->data)          || !is_object($block->data) ||
                !isset($block->data->content) || !is_array($block->data->content)
            )
            {
                return;
            }

            $table = '<div class="dh-rich-text-table"><table>';

            foreach($block->data->content as $row)
            {
                if(!is_array($row))
                {
                    continue;
                }

                $table .= '<tr>';

                foreach($row as $cell)
                {
                    if(is_scalar($cell))
                    {
                        $table .= '<td>' . $cell . '</td>';
                    }
                }

                $table .= '</tr>';
            }

            $this->html .= $table . '</table></div>';
        }

        /* Embed */
        private function embed(object $block): void
        {
            /* Validate */
            if(
                !isset($block->data)          || !is_object($block->data) ||
                !isset($block->data->embed)   || !is_string($block->data->embed) ||
                !isset($block->data->service) || !is_string($block->data->service)
            )
            {
                return;
            }

            switch($block->data->service)
            {
                case 'youtube':
                case 'vimeo':
                    $this->html .= '<div class="dh-rich-text-embed">';
                    $this->html .= '<iframe src="' . sanitize($block->data->embed) . '" frameborder="0" allowfullscreen></iframe>';
                    $this->html .= '</div>';
                    break;
            }
        }
    };