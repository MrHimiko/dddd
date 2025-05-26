<?php

    return new Class()
    {
        private array $content = [];

        public function init(Addon $addon, string $html): array
        {
            $dom = $this->dom($html);

            $this->children($dom->childNodes);

            return $this->content;
        }

        private function dom(string $html): object
        {
            $dom = new DOMDocument();
            @$dom->loadHTML('<div id="divhunt-parser">' . $html . '</div>');

            return $dom->getElementById('divhunt-parser');
        }

        private function children(DOMNodeList $children): void
        {
            foreach($children as $child) 
            {
                if($child->nodeType === XML_ELEMENT_NODE) 
                {
                    if(in_array($child->nodeName, ['div', 'section', 'figure']))
                    {
                        $this->children($child->childNodes);
                    }
                    else if(method_exists($this, $child->nodeName))
                    {
                        $this->{$child->nodeName}($child);
                    }
                } 
            }
        }

        private function p($child)
        {
            $this->content[] = (object) [
                'id'   => 'block' . (count($this->content) + 1),
                'data' => (object) [
                    'text' => $child->nodeValue
                ],
                'type'  => 'paragraph',
                'tunes' => new StdClass
            ];
        }

        private function h1($child)
        {
            $this->content[] = (object) [
                'id'   => 'block' . (count($this->content) + 1),
                'data' => (object) [
                    'text'  => $child->nodeValue,
                    'level' => 1
                ],
                'type'  => 'header',
                'tunes' => new StdClass
            ];
        }

        private function h2($child)
        {
            $this->content[] = (object) [
                'id'   => 'block' . (count($this->content) + 1),
                'data' => (object) [
                    'text'  => $child->nodeValue,
                    'level' => 2
                ],
                'type'  => 'header',
                'tunes' => new StdClass
            ];
        }

        private function h3($child)
        {
            $this->content[] = (object) [
                'id'   => 'block' . (count($this->content) + 1),
                'data' => (object) [
                    'text'  => $child->nodeValue,
                    'level' => 3
                ],
                'type'  => 'header',
                'tunes' => new StdClass
            ];
        }
        
        private function h4($child)
        {
            $this->content[] = (object) [
                'id'   => 'block' . (count($this->content) + 1),
                'data' => (object) [
                    'text'  => $child->nodeValue,
                    'level' => 4
                ],
                'type'  => 'header',
                'tunes' => new StdClass
            ];
        }

        private function h5($child)
        {
            $this->content[] = (object) [
                'id'   => 'block' . (count($this->content) + 1),
                'data' => (object) [
                    'text'  => $child->nodeValue,
                    'level' => 5
                ],
                'type'  => 'header',
                'tunes' => new StdClass
            ];
        }

        private function h6($child)
        {
            $this->content[] = (object) [
                'id'   => 'block' . (count($this->content) + 1),
                'data' => (object) [
                    'text'  => $child->nodeValue,
                    'level' => 6
                ],
                'type'  => 'header',
                'tunes' => new StdClass
            ];
        }

        private function code($child)
        {
            $this->content[] = (object) [
                'id'   => 'block' . (count($this->content) + 1),
                'data' => (object) [
                    'code'  => $child->nodeValue,
                ],
                'type'  => 'code',
            ];
        }

        private function pre($child)
        {
            $this->content[] = (object) [
                'id'   => 'block' . (count($this->content) + 1),
                'data' => (object) [
                    'html'  => $child->ownerDocument->saveHTML($child)
                ],
                'type'  => 'raw',
            ];
        }

        private function img($child)
        {
            if(!$src = $child->getAttribute('src'))
            {
                return;
            }

            $upload = storage::fn_upload_link($src, 'Image');

            if($upload['success'])
            {
                $src = 'https://global.divhunt.com/' . $upload['upload']['hash'] . '_' . $upload['upload']['size'] . $upload['upload']['type']['extension'];
            }

            $this->content[] = (object) [
                'id'   => 'block' . (count($this->content) + 1),
                'data' => (object) [
                    'file' => (object) [
                        'url' => $src,
                    ],
                    'caption' => '',
                    'stretched' => false,
                    'withBorder' => false,
                    'withBackground' => false
                ],
                'type'  => 'image',
                'tunes' => new StdClass
            ];
        }
    };