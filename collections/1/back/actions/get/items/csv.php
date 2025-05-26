<?php

    return new Class()
    {
        public array $permission = [];

        public array $in = ['id' => ['type' => 'integer', 'optional' => false]];
        public array $out = [];

        public function init(Addon $addon, AddonResponse $response, array $data): AddonResponse
        {
            if(!$collection = collections::fn_object_get($data['id'], false))
            {
                return $response->message("Collection with provided ID doesn't exist.");
            }

            if(!$entity = collections::fn_fetch_collection($data['id']))
            {
                return $response->message('Collection with ID :1 doesn\'t exist.', $data['id']);
            }

            $items = collections::fn_items($collection, function($config) use(&$entity)
            {
                /* Split */
                if($entity->getSplit() && $entity->getClientId() !== client()->getId())
                {
                    $config->client = client()->getId();
                }

                $config->limit = 100000;
            }, ['relations', 'clients', 'children']);

            $data = [];
            $keys = ['id' => 1, 'name' => 1, 'slug' => 1]; 

            foreach($collection->fields as $field)
            {
                $keys[$field->name] = 1;
            }

            $data[] = array_keys($keys);

            foreach($items as $item)
            {
                $csv = [
                    $item['id'],
                    $item['name'],
                    $item['slug']
                ];

                foreach($collection->fields as $field)
                {
                    switch($field->type)
                    {
                        case 'Rich Text':
                            $csv[] = collections::fn_editor_html($item[$field->name]);
                            break;
                        case 'Media':
                            $csv[] = $item[$field->name]->file;
                            break;
                        default:
                            $csv[] = is_scalar($item[$field->name]) ? $item[$field->name] : null;
                    }
                }

                $data[] = $csv;
            }

            $tmpFile = tmpfile();

            $name = 'collection-data-' . ((int) microtime(true)) . '.csv';

            foreach($data as $row) 
            {
                fputcsv($tmpFile, $row);
            }

            rewind($tmpFile);

            header('Content-Type: text/csv');
            header('Content-Disposition: attachment; filename="'.$name.'"');

            fpassthru($tmpFile);
            fclose($tmpFile);

            exit;
        }
    };