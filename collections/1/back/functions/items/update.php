<?php

    use collections\entity\item;
    use collections\entity\field;

    return new class()
    {
        public function init(Addon $addon, item $item, array $data = []): object
        {
            $update = (object) ['success' => true, 'errors' => []];
            $fields = collections::fn_fetch_fields($item->getCollectionId());
    
            $this->order($item, $data, $update);
            $this->name($item, $data, $update);
            $this->slug($item, $data, $update);
            $this->published($item, $data, $update);
            $this->seoTitle($item, $data, $update);
            $this->seoDescription($item, $data, $update);
            $this->seoCover($item, $data, $update);
            $this->scheduleFrom($item, $data, $update);
            $this->scheduleTo($item, $data, $update);
            $this->parent($item, $data, $update);

            foreach($fields as $field)
            {
                switch($field->getType()->getName())
                {
                    case 'Text':
                    case 'HTML Editor':
                        $this->text($item, $field, $data, $update);
                        break;
                    case 'Date':
                        $this->date($item, $field, $data, $update);
                        break;
                    case 'Email':
                        $this->email($item, $field, $data, $update);
                        break;
                    case 'Switch':
                        $this->switch($item, $field, $data, $update);
                        break;
                    case 'Select':
                        $this->select($item, $field, $data, $update);
                        break;
                    case 'Media':
                        $this->media($item, $field, $data, $update);
                        break;
                    case 'Rich Text':
                        $this->rich_text($item, $field, $data, $update);
                        break;
                    case 'Relation':
                        $this->relation($item, $field, $data, $update);
                        break;
                    case 'Repeater':
                        $this->repeater($item, $field, $data, $update);
                        break;
                }
            }   
    
            if($update->success)
            {
                $update->success = $item->update();
            }

            return $update;
        }

        private function name(item $item, array $data, object $update): void
        {
            if(!isset($data['name']))
            {
                return;
            }

            if(!is_string($data['name']))
            {   
                $update->success = false;
                $update->errors[] = 'Name must be passed as string.';

                return;
            }

            $data['name'] = substr($data['name'], 0, 70);

            if(strlen($data['name']) < 1)
            {   
                $update->success = false;
                $update->errors[] = 'Name must have at least 1 character.';

                return;
            }

            $item->setName($data['name']);
        }

        private function order(item $item, array $data, object $update): void
        {
            if(!isset($data['order']))
            {
                return;
            }

            if(is_integer($data['order']))
            {   
                $item->setOrder($data['order']);
            }
        }

        private function slug(item $item, array $data, object $update): void
        {
            if(!isset($data['slug']))
            {
                return;
            }

            if(!is_string($data['slug']))
            {   
                $update->success = false;
                $update->errors[] = 'Slug must be passed as string.';

                return;
            }

            $slug = utils::fn_validate_slug($data['slug']);
            $slug = substr($slug, 0, 70);

            if(strlen($slug) < 1)
            {   
                $update->success = false;
                $update->errors[] = 'Slug must be have at least 1 character.';

                return;
            }

            $item->setSlug($slug);
        }

        private function published(item $item, array $data, object $update): void
        {
            if(!isset($data['published']))
            {
                return;
            }

            if(!is_bool($data['published']))
            {   
                $update->success = false;
                $update->errors[] = 'Published must be passed as boolean.';

                return;
            }

            $item->setPublished(!!$data['published']);
        }

        private function seoTitle(item $item, array $data, object $update): void
        {
            if(!isset($data['seo.title']))
            {
                return;
            }

            if(!is_null($data['seo.title']) && !is_string($data['seo.title']) )
            {   
                $update->success = false;
                $update->errors[] = 'SEO title must be passed as null or string.';

                return;
            }

            $seo = $item->getSEO();

            if($data['seo.title'])
            {
                $seo->title = $data['seo.title'];
            }
            else
            {
                unset($seo->title);
            }

            $item->setSEO($seo);
        }

        private function seoDescription(item $item, array $data, object $update): void
        {
            if(!isset($data['seo.description']))
            {
                return;
            }

            if(!is_null($data['seo.description']) && !is_string($data['seo.description']) )
            {   
                $update->success = false;
                $update->errors[] = 'SEO description must be passed as null or string.';

                return;
            }

            $seo = $item->getSEO();

            if($data['seo.description'])
            {
                $seo->description = $data['seo.description'];
            }
            else
            {
                unset($seo->description);
            }

            $item->setSEO($seo);
        }

        private function seoCover(item $item, array $data, object $update): void
        {
            if(!isset($data['seo.cover']))
            {
                return;
            }

            if(
                !is_integer($data['seo.cover']) &&
                !is_string($data['seo.cover'])  &&
                !is_object($data['seo.cover']) 
            )
            {
                $update->success = false;
                $update->errors[] = 'SEO cover must be passed as integer (ID), string (URL) or object.';

                return;
            }

            if(filter_var($data['seo.cover'], FILTER_VALIDATE_URL))
            {
                $value = storage::fn_upload_link($data['seo.cover'], $item->getName());

                if(!$value['success'])
                {
                    $update->success = false;
                    $update->errors[] = 'Failed to upload Media URL on field "SEO cover".';

                    return;
                }

                $value = $value['upload']['hash'] . '_' . $value['upload']['size'] . $value['upload']['type']['extension'] . '|' . $value['upload']['id'];
            }
            else 
            {
                if(is_object($data['seo.cover']))
                {
                    if(!property_exists($data['seo.cover'], 'ids') || !is_array($data['seo.cover']->ids))
                    {
                        $update->success = false;
                        $update->errors[] = 'Failed to upload Media URL on field "SEO cover". Invalid object sent.';

                        return;
                    }

                    $value = storage::fn_process_set($data['seo.cover']->ids);
                }
                else
                {
                    $value = storage::fn_process_set(explode(',', $data['seo.cover']));
                }
            }

            $seo = $item->getSEO();
            $seo->cover = $value;

            $item->setSEO($seo);
        }

        private function scheduleFrom(item $item, array $data, object $update): void
        {
            if(!isset($data['schedule.from']))
            {
                return;
            }

            if(is_string($data['schedule.from']))
            {
                $data['schedule.from'] = strtotime($data['schedule.from']);
            }

            if(!is_integer($data['schedule.from']) )
            {   
                $update->success = false;
                $update->errors[] = 'Schedule from must be passed as integer.';

                return;
            }

            $item->setScheduleFrom($data['schedule.from'] === 0 ? null : $data['schedule.from']);
        }

        private function scheduleTo(item $item, array $data, object $update): void
        {
            if(!isset($data['schedule.to']))
            {
                return;
            }

            if(is_string($data['schedule.to']))
            {
                $data['schedule.to'] = strtotime($data['schedule.to']);
            }

            if(!is_integer($data['schedule.to']) )
            {   
                $update->success = false;
                $update->errors[] = 'Schedule to must be passed as integer.';

                return;
            }

            $item->setScheduleTo($data['schedule.to'] === 0 ? null : $data['schedule.to']);
        }

        private function parent(item $item, array $data, object $update): void
        {
            if(!isset($data['parent']))
            {
                return;
            }

            if(!$parent = (int) $data['parent'])
            {
                $update->success = false;
                $update->errors[] = 'Parent must be passed as integer (ID).';

                return;
            }

            if(!$parent = collections::fn_fetch_item($parent, $item->getCollectionId()))
            {
                $update->success = false;
                $update->errors[] = 'Invalid parent ID.';

                return;
            }

            $item->setParentId($parent->getId());
        }

        /* 
         * TEXT
         */
        private function text(item $item, field $field, array $data, object $update): void
        {
            if(!isset($data[$field->getName()]))
            {
                return;
            }

            if(!is_scalar($data[$field->getName()]))
            {
                $update->success = false;
                $update->errors[] = 'Expected string on field ' . $field->getName() . '.';

                return;
            }

            $fields = $item->getFields();
            $fields->{$field->getName()} = (string) $data[$field->getName()];

            $item->setFields($fields);
        }

        /* 
         * Date
         */
        private function date(item $item, field $field, array $data, object $update): void
        {
            if(!isset($data[$field->getName()]))
            {
                return;
            }

            if(!is_string($data[$field->getName()]))
            {
                $update->success = false;
                $update->errors[] = 'Expected string on field ' . $field->getName() . '.';

                return;
            }

            $fields = $item->getFields();
            $fields->{$field->getName()} = $data[$field->getName()];

            $item->setFields($fields);
        }


        /* 
         * Email
         */
        private function email(item $item, field $field, array $data, object $update): void
        {
            if(!isset($data[$field->getName()]))
            {
                return;
            }
        
            if(!filter_var($data[$field->getName()], FILTER_VALIDATE_EMAIL))
            {
                $update->success = false;
                $update->errors[] = 'Invalid email format on field ' . $field->getName() . '.';
        
                return;
            }
        
            $fields = $item->getFields();
            $fields->{$field->getName()} = $data[$field->getName()];
        
            $item->setFields($fields);
        }

        /* 
         * Switch
         */
        private function switch(item $item, field $field, array $data, object $update): void
        {
            if(!isset($data[$field->getName()]))
            {
                return;
            }

            if(!is_bool($data[$field->getName()]))
            {
                $update->success = false;
                $update->errors[] = 'Expected boolean on field ' . $field->getName() . '.';

                return;
            }

            $fields = $item->getFields();
            $fields->{$field->getName()} = !!$data[$field->getName()];

            $item->setFields($fields);
        }

        /* 
         * Select
         */
        private function select(item $item, field $field, array $data, object $update): void
        {
            if(!isset($data[$field->getName()]))
            {
                return;
            }

            if(!is_string($data[$field->getName()]))
            {
                $update->success = false;
                $update->errors[] = 'Expected string on field ' . $field->getName() . '.';

                return;
            }

            $options = $field->jsonGet('options', []);
            $value = null;

            foreach($options as $option)
            {
                if(strtolower($option) === strtolower($data[$field->getName()]))
                {
                    $value = $option;
                    break;
                }
            }

            $fields = $item->getFields();
            $fields->{$field->getName()} = $value;

            $item->setFields($fields);
        }

        /* 
         * MEDIA
         */
        private function media(item $item, field $field, array $data, object $update): void
        {
            if(!isset($data[$field->getName()]))
            {
                return;
            }

            $upload = $data[$field->getName()];

            if(
                !is_integer($upload) &&
                !is_string($upload)  &&
                !is_object($upload) 
            )
            {
                $update->success = false;
                $update->errors[] = 'Expected integer (ID), string (Comma Separated URLs) or object on field ' . $field->getName() . '.';

                return;
            }

            if(is_integer($upload))
            {
                $value = storage::fn_process_set([$upload]);
            }
            else if(is_object($upload))
            {
                if(!property_exists($upload, 'ids') || !is_array($upload->ids))
                {
                    $update->success = false;
                    $update->errors[] = 'Failed to upload Media URL on field ' . $field->getName() . ' -  Invalid object sent.';

                    return;
                }

                $value = storage::fn_process_set($upload->ids);
            }   
            else
            {
                $uploaded = [];

                foreach(explode(',', $upload) as $urlOrId)
                {
                    if(is_numeric($urlOrId))
                    {
                        $uploaded[] = $urlOrId;
                        continue;
                    }

                    if(!filter_var($urlOrId, FILTER_VALIDATE_URL))
                    {
                        continue;
                    }

                    $upload = storage::fn_upload_link($urlOrId, $item->getName() . ' - #' . (count($uploaded) + 1));

                    if(!$upload['success'])
                    {
                        $update->success = false;
                        $update->errors[] = 'Failed to upload Media URL on field ' . $field->getName() . ' - ' . $upload['message'] . '.';
    
                        return;
                    }

                    $uploaded[] = $upload['upload']['id'];
                }

                $value = storage::fn_process_set($uploaded);
            }

            $fields = $item->getFields();
            $fields->{$field->getName()} = $value;

            $item->setFields($fields);
        }

        /* 
         * Rich Text
         */
        private function rich_text(item $item, field $field, array $data, object $update): void
        {
            if(!isset($data[$field->getName()]))
            {
                return;
            }

            if(!is_string($data[$field->getName()]) && !is_array($data[$field->getName()]))
            {
                $update->success = false;
                $update->errors[] = 'Expected string or array on field ' . $field->getName() . '.';

                return;
            }

            $fields = $item->getFields();
            $fields->{$field->getName()} = is_string($data[$field->getName()]) ? collections::fn_editor_json($data[$field->getName()]) : $data[$field->getName()];

            $item->setFields($fields);
        }

        /* 
         * Relation
         */
        private function relation(item $item, field $field, array $data, object $update): void
        {
            if(!isset($data[$field->getName()]))
            {
                return;
            }

            if(!$collection = (int) $field->jsonGet('collection', 0))
            {
                return;
            }

            if(is_string($data[$field->getName()]))
            {
                $data[$field->getName()] = explode(',', $data[$field->getName()]);
            }

            if(!is_array($data[$field->getName()]))
            {
                $update->success = false;
                $update->errors[] = 'Expected array on field ' . $field->getName() . '.';

                return;
            }

            $ids = $data[$field->getName()];
            
            foreach($ids as $index => $id)
            {
                if(!$id = (int) $id)
                {
                    unset($ids[$index]);
                }
            }

            if(count($ids))
            {
                $ids = collections::fetch_item()->collection_id($collection)->ids($ids)->getIds();
            }

            $fields = $item->getFields();
            $fields->{$field->getName()} = '{' . implode(',', $ids) . '}';
            $fields->{$field->getName() . ':Relation'} = '{' . implode(',', $ids) . '}';

            $item->setFields($fields);
        }

        /* 
         * Repeater
         */
        private function repeater(item $item, field $field, array $data, object $update): void
        {
            if(!isset($data[$field->getName()]))
            {
                return;
            }

            if(!is_array($data[$field->getName()]))
            {
                $update->success = false;
                $update->errors[] = 'Expected array on field ' . $field->getName() . '.';

                return;
            }

            $config = $field->jsonGet('config', new StdClass);
            $validate = html::fn_settings_values((object) ['repeater' => $config], (object) ['repeater' => $data[$field->getName()]]);

            $fields = $item->getFields();
            $fields->{$field->getName()} = $validate->values->repeater ?? [];

            $item->setFields($fields);
        }
    };