<?php

    use collections\entity\collection;

    return new Class()
    {
        public function init(Addon $addon): object
        {
            $objects = new StdClass;

            $collections = collections::fetch_collection()->site_id(site()->getId())->removed(false)->setKey('id')->run();
            $fields = count($collections) ? collections::fetch_field()->collection_ids(array_keys($collections))->join('INNER', 'collections.field_type')->run() : [];
;
            foreach($collections as $collection)
            {
                $object = (object) [
                    'id'       => $collection->getId(),
                    'name'     => $collection->getName(),
                    'global'   => $collection->getGlobal(),
                    'nest'     => $collection->getNest(),
                    'config'   => $collection->getConfig(),
                    'share'    => $collection->getShare(),
                    'variable' => $collection->getVariable(),
                    'fields'   => $this->fields($collection->getId(), $fields)
                ];
    
                if($object->variable->enabled)
                {
                    $object->variable->items = $this->items($object);
                }

                $objects->{$collection->getId()} = $object;
            }

            return $objects;
        }

        private function collection(int|collection $collection): ?collection
        {
            if(!is_integer($collection))
            {
                return $collection;
            }

            return collections::fetch_collection()->id($collection)->removed(false)->setLimit(1)->run();
        }

        private function fields(int $id, array $fields): array
        {
            $list = [];

            foreach($fields as $field)
            {   
                if($field->getCollectionId() !== $id)
                {
                    continue;
                }

                $settings = [];
    
                if($field->getType()->getName() === 'Select')
                {
                    $settings['options'] = new StdClass;
    
                    foreach($field->jsonGet('options', []) as $option)
                    {
                        $settings['options']->{$option} = $option;
                    }
                }
    
                else if($field->getType()->getName() === 'Relation')
                {
                    $settings['collection'] = $field->jsonGet('collection', 0);
                    $settings['type'] = $field->jsonGet('type') === 'multiple' ? 'multiple' : 'single';
                }
    
                $list[] = (object) [
                    'id'       => $field->getId(),
                    'name'     => $field->getName(),
                    'type'     => $field->getType()->getName(),
                    'settings' => (object) $settings
                ];
            }

            return $list;
        }

        private function items(object $collection): array 
        {
            $items = collections::fn_items($collection, function($config)
            {
                $config->limit = 500;
                $config->published = true;
            }, ['seo', 'clients', 'relations', 'children']);

            if(strlen(json_encode($items)) > 200000)
            {
                return [];
            }

            /* Conver to Object (ID) */
            if($collection->variable->format === 'object-id')
            {
                foreach($items as $index => $item)
                {
                    $items[$item['id']] = $item;
                    unset($items[$index]);
                }

                return utils::fn_reorder($items, null, true);
            }

            /* Conver to Object (Slug) */
            else if($collection->variable->format === 'object-slug')
            {
                foreach($items as $index => $item)
                {
                    $items[$item['slug']] = $item;
                    unset($items[$index]);
                }

                return utils::fn_reorder($items, null, true);
            }
                
            return utils::fn_reorder($items);
        }
     };