<?php

    return new Class()
    {
        public function init(Addon $addon, int|object $collection, ?callable $callback = null, array $exclude = []): ?array
        {
            if(!$collection = $this->collection($collection))
            {
                return null;
            }

            $config = (object) [
                'filters'   => [],
                'sort'      => null,
                'page'      => 1,
                'limit'     => 100,
                'offset'    => 0,
                'search'    => null,
                'id'        => null,
                'slug'      => null,
                'published' => null,
                'parent'    => null,
                'client'    => null,
                'key'       => null,
                'schedule'  => false,
                'trim'      => false,
                'language'  => null
            ];

            if($callback)
            {
                $callback($config);
            }

            $array = [];
            $items = $this->items($collection, $config);

            foreach($items as $index => $item)
            {
                $fields = $item->getFields();

                $data = [
                    'id'         => $item->getId(),
                    'order'      => $index + 1,
                    'collection' => $item->getCollectionId(),
                    'parent'     => $item->getParentId(),
                    'name'       => $item->getName(),
                    'slug'       => $item->getSlug(),
                    'seo'        => !in_array('seo', $exclude) ? $item->getSEO() : null,
                    'schedule'   => ['from' => $item->getScheduleFrom(), 'to' => $item->getScheduleTo()],
                    'client'     => $item->getClientId(),
                    'published'  => $item->getPublished(),
                    'updated'    => $item->getUpdated(),
                    'created'    => $item->getCreated(),
                    'children'   => []
                ];

                if(!in_array('seo', $exclude))
                {
                    $data['seo']->cover = sv_storage::fn_process_get($data['seo']->cover);
                }

                foreach($collection->fields as $field)
                {
                    $value = $fields->{$field->name} ?? null;

                    if($field->type === 'Media')
                    {
                        $data[$field->name] = sv_storage::fn_process_get($value);
                    }
                    else if($field->type === 'Switch')
                    {
                        $data[$field->name] = !!($value);
                    }
                    else if ($field->type === 'Date') 
                    {
                        if(is_string($value))
                        {
                            $date = DateTime::createFromFormat('Y-m-d G:i', $value);
                            $data[$field->name] = $date ? $date->format('Y-m-d H:i:s') : null;
                        }
                        else 
                        {
                            $data[$field->name] = null;
                        }
                    }
                    else if($field->type === 'Relation')
                    {
                        if(is_string($value))
                        {
                            $value = str_replace(['{', '}'], '', $value);
                            $value = explode(',', $value);
                        }

                        $data[$field->name] = is_array($value) ? $value : [];
                    }
                    else
                    {
                        if($config->trim && is_string($value) && strlen($value) > 2000)
                        {
                            $data[$field->name] = null;
                        }
                        else
                        {
                            $data[$field->name] = $value;
                        }
                    }
                }

                if($config->key === 'id')
                {
                    $array[$data['id']] = $data;
                }
                else if($config->key === 'slug')
                {
                    $array[$data['slug']] = $data;
                }
                else 
                {
                    $array[] = $data;
                }
            }
          
            if(!in_array('clients', $exclude))
            {
                $this->processClients($collection, $array);
            }

            if(!in_array('relations', $exclude))
            {
                $this->processRelations($collection, $array);
            }

            if(!in_array('children', $exclude) && $collection->nest)
            {
                $this->processChildren($collection, $array);
            }

            return $array;
        }

        private function collection(int|object $collection): ?object
        {
            if(is_object($collection))
            {
                return $collection;
            }

            if(function_exists('install'))
            {
                $collections = install('collections')->jsonGet('collections', new StdClass);

                if(isset($collections->{$collection}))
                {
                    return $collections->{$collection};
                }
            }

            return collections::fn_object_get($collection, false);
        }
      
        private function items(object $collection, object $config): array
        {
            $items = collections::fetch_item()->collection_id($collection->id)
                ->setPage(min(max($config->page, 1), 10000))
                ->setLimit(min(max($config->limit, 1), 1000))
                ->setOffset(min(max($config->offset, 0), 100000))
                ->setOrder('item_id DESC');

            /* Schedule */
            if($config->schedule)
            {
                $items->scheduleFrom((int) microtime(true));
                $items->scheduleTo((int) microtime(true));
            }

            /* Client */
            if($config->client && is_integer($config->client))
            {
                $items->client_id($config->client);
            }

            /* ID Single */
            if(is_integer($config->id))
            {
                $items->id($config->id);
            }

            /* ID Multiple */
            if(is_array($config->id))
            {
                $config->id = array_map('intval', array_filter($config->id, function($value) 
                {
                    return is_numeric($value) && $value > 0;
                }));

                if(!count($config->id))
                {
                    return [];
                }

                $items->ids($config->id);
            }

            /* Slug */
            if(is_string($config->slug))
            {
                $items->slug($config->slug);
            }

            /* Search */
            if(is_string($config->search) && strlen($config->search))
            {
                $this->search($items, $collection->fields, $config);
            }

            /* Language */
            if($config->language !== null)
            {
                $items->setLanguage($config->language);
            }

            /* Published TRUE */
            if($config->published === true)
            {
                $items->published(true);
            }

            /* Published FALSE */
            if($config->published === false)
            {
                $items->published(false);
            }

            /* Parent FALSE */
            if($config->parent === false)
            {
                $items->parent_id_null(true);
            }

            /* Parent TRUE */
            if($config->parent === true)
            {
                $items->parent_id_null(false);
            }

            /* Parent ID Single */
            if(is_integer($config->parent))
            {
                $items->parent_id($config->parent);
            }
            
            /* Parent ID Multiple */
            if(is_array($config->parent))
            {
                $config->parent = array_map('intval', array_filter($config->parent, function($value) 
                {
                    return is_numeric($value) && $value > 0;
                }));

                if(!count($config->parent))
                {
                    return [];
                }

                $items->parent_ids($config->parent);
            }

            $this->itemsSort($collection, $config, $items);
            $this->itemsFilters($collection, $config, $items);

            $items = $items->run();

            return is_array($items) ? $items : ($items ? [$items] : []);
        }

        private function search($items, array $fields, object $config): void
        {
            if(count(explode(':', $config->search)) !== 2)
            {
                $items->search($config->search);
                return;
            }

            $search = explode(':', $config->search);
            $field = null;

            foreach($fields as $value)
            {
                if($value->name === strtolower(trim($search[0])))
                {
                    $field = $value;
                    break;
                }
            }

            if(!$field)
            {
                return;
            }

            if($field->type === 'Relation')
            {
                if(!$item = collections::fetch_item()->collection_id($field->settings->collection)->search(trim($search[1]))->setLimit(1)->run())
                {
                    return;
                }

                $items->query()->where('T1.item_fields')->isJson('includes', $field->name . ':Relation', $item->getId());
            }
            else 
            {
                $items->query()->where('T1.item_fields')->isJson('like', $field->name, trim($search[1]));
            }
        }

        private function itemsSort(object $collection, object $config, AddonFetch $items)
        {
            $items->setOrder('item_order ASC, item_id DESC');

            switch($config->sort)
            {
                case 'name-asc':
                    $items->setOrder('T1.item_name ASC');
                    break;

                case 'name-desc':
                    $items->setOrder('T1.item_name DESC');
                    break;

                case 'slug-asc':
                    $items->setOrder('T1.item_slug ASC');
                    break;

                case 'slug-desc':
                    $items->setOrder('T1.item_slug DESC');
                    break;

                case 'updated-asc':
                    $items->setOrder('item_updated ASC');
                    break;

                case 'updated-desc':
                    $items->setOrder('item_updated DESC');
                    break;

                case 'created-asc':
                    $items->setOrder('item_id ASC');
                    break;

                case 'created-desc':
                    $items->setOrder('item_id DESC');
                    break;

                case 'order-asc':
                    $items->setOrder('item_order ASC, item_id DESC');
                    break;

                case 'order-desc':
                    $items->setOrder('item_order DESC, item_id DESC');
                    break;

                case 'random':
                    $items->setOrder('random()');
                    break;

                default:
                    foreach($collection->fields as $field) 
                    {
                        foreach($collection->fields as $field) 
                        {
                            if($config->sort === $field->id . '-asc' || $config->sort === $field->id . '-desc') 
                            {
                                $direction = strpos($config->sort, '-desc') !== false ? 'DESC' : 'ASC';
                                $fieldName = utils::fn_regex_allow('a-zA-Z0-9- ', $field->name);
                                
                                if($field->type === 'Date') 
                                {
                                    $items->setOrder("(COALESCE(T1.item_fields->>'$fieldName', NULL))::timestamp $direction NULLS LAST");
                                } 
                                else 
                                {
                                    $items->setOrder("T1.item_fields->'$fieldName' $direction");
                                }

                                break;
                            }
                        }
                    }
                    break;
            }
        }

        private function itemsFilters(object $collection, object $config, AddonFetch $items)
        {
            foreach($config->filters as $filter)
            {
                if($filter->operator === 'Equals')
                {
                    if($filter->value)
                    {
                        if(in_array($filter->field->name, ['name', 'slug']))
                        {
                            $items->query()->where('T1.item_' . $filter->field->name)->is('equals', $filter->value);
                        }
                        else 
                        {
                            $items->query()->where('T1.item_fields')->isJson('equals', $filter->field->name, $filter->value);
                        }
                    }
                }
                else if($filter->operator === 'NotEquals')
                {
                    if($filter->value)
                    {
                        if(in_array($filter->field->name, ['name', 'slug']))
                        {
                            $items->query()->where('T1.item_' . $filter->field->name)->is('notEquals', $filter->value);
                        }
                        else 
                        {
                            $items->query()->where('T1.item_fields')->isJson('notEquals', $filter->field->name, $filter->value);
                        }
                    }
                }
                else if($filter->operator === 'LessThan')
                {
                    if($filter->value)
                    {
                        if(in_array($filter->field->name, ['name', 'slug']))
                        {
                            $items->query()->where('T1.item_' . $filter->field->name)->is('lessThan', $filter->value);
                        }
                        else 
                        {
                            $items->query()->where('T1.item_fields')->isJson('lessThan', $filter->field->name, $filter->value);
                        }
                    }
                }
                else if($filter->operator === 'LessEqualThan')
                {
                    if($filter->value)
                    {
                        if(in_array($filter->field->name, ['name', 'slug']))
                        {
                            $items->query()->where('T1.item_' . $filter->field->name)->is('lessEqualThan', $filter->value);
                        }
                        else 
                        {
                            $items->query()->where('T1.item_fields')->isJson('lessEqualThan', $filter->field->name, $filter->value);
                        }
                    }
                }
                else if($filter->operator === 'GreaterThan')
                {
                    if($filter->value)
                    {
                        if(in_array($filter->field->name, ['name', 'slug']))
                        {
                            $items->query()->where('T1.item_' . $filter->field->name)->is('greaterThan', $filter->value);
                        }
                        else 
                        {
                            $items->query()->where('T1.item_fields')->isJson('greaterThan', $filter->field->name, $filter->value);
                        }
                    }
                }
                else if($filter->operator === 'GreaterEqualThan')
                {
                    if($filter->value)
                    {
                        if(in_array($filter->field->name, ['name', 'slug']))
                        {
                            $items->query()->where('T1.item_' . $filter->field->name)->is('greaterEqualThan', $filter->value);
                        }
                        else 
                        {
                            $items->query()->where('T1.item_fields')->isJson('greaterEqualThan', $filter->field->name, $filter->value);
                        }
                    }
                }
                else if($filter->operator === 'Contains')
                {
                    if($filter->value)
                    {
                        if(in_array($filter->field->name, ['name', 'slug']))
                        {
                            $items->query()->where('T1.item_' . $filter->field->name)->is('like', $filter->value);
                        }
                        else 
                        {
                            $items->query()->where('T1.item_fields')->isJson('like', $filter->field->name, $filter->value);
                        }
                    }
                }
                else if($filter->operator === 'NotContains')
                {
                    if($filter->value)
                    {
                        if(in_array($filter->field->name, ['name', 'slug']))
                        {
                            $items->query()->where('T1.item_' . $filter->field->name)->is('notLike', $filter->value);
                        }
                        else 
                        {
                            $items->query()->where('T1.item_fields')->isJson('notLike', $filter->field->name, $filter->value);
                        }
                    }
                }
                else if($filter->operator === 'StartsWith')
                {
                    if($filter->value)
                    {
                        if(in_array($filter->field->name, ['name', 'slug']))
                        {

                        }
                        else 
                        {
                            $items->query()->where('T1.item_fields')->isJson('startsWith', $filter->field->name, $filter->value);
                        }
                    }
                }
                else if($filter->operator === 'EndsWith')
                {
                    if($filter->value)
                    {
                        if(in_array($filter->field->name, ['name', 'slug']))
                        {
                            
                        }
                        else 
                        {
                            $items->query()->where('T1.item_fields')->isJson('endsWith', $filter->field->name, $filter->value);
                        }
                    }
                }
                else if($filter->operator === 'True')
                {
                    if(in_array($filter->field->name, ['name', 'slug']))
                    {
                        
                    }
                    else 
                    {
                        $items->query()->where('T1.item_fields')->isJson('true', $filter->field->name, $filter->value);
                    }
                }
                else if($filter->operator === 'False')
                {
                    if(in_array($filter->field->name, ['name', 'slug']))
                    {
                        
                    }
                    else 
                    {
                        $items->query()->where('T1.item_fields')->isJson('false', $filter->field->name, $filter->value);
                        $items->query()->or('T1.item_fields')->isJson('null', $filter->field->name, $filter->value);
                    }
                }
                else if($filter->operator === 'Empty')
                {
                    if(in_array($filter->field->name, ['name', 'slug']))
                    {
                        
                    }
                    else 
                    {
                        $items->query()->where('T1.item_fields')->isJson('null', $filter->field->name, $filter->value);
                    }
                }
                else if($filter->operator === 'NotEmpty')
                {
                    if(in_array($filter->field->name, ['name', 'slug']))
                    {
                        
                    }
                    else 
                    {
                        $items->query()->where('T1.item_fields')->isJson('notNull', $filter->field->name, $filter->value);
                    }
                }
                else if($filter->operator === 'In')
                {
                    if($filter->value)
                    {
                        if(in_array($filter->field->name, ['name', 'slug']))
                        {
                            
                        }
                        else 
                        {
                            $items->query()->where('T1.item_fields')->isJson('in', $filter->field->name, $filter->value);
                        }
                    }
                }
                else if($filter->operator === 'NotIn')
                {
                    if($filter->value)
                    {
                        if(in_array($filter->field->name, ['name', 'slug']))
                        {
                            
                        }
                        else 
                        {
                            $items->query()->where('T1.item_fields')->isJson('notIn', $filter->field->name, $filter->value);
                        }
                    }
                }
                else if($filter->operator === 'Includes')
                {
                    if($filter->value)
                    {
                        if(in_array($filter->field->name, ['name', 'slug']))
                        {
                            
                        }
                        else 
                        {
                            $items->query()->where('T1.item_fields')->isJson('includes', $filter->field->name . ':Relation', $filter->value);
                        }
                    }
                }
                else if($filter->operator === 'NotIncludes')
                {
                    if($filter->value)
                    {
                        if(in_array($filter->field->name, ['name', 'slug']))
                        {
                            
                        }
                        else 
                        {
                            $items->query()->where('T1.item_fields')->isJson('noIncludes', $filter->field->name . ':Relatioon', $filter->value);
                        }
                    }
                }
            }
        }

        private function processClients(object $collection, array &$items): void 
        {
            $clients = [];

            foreach($items as $item)
            {
                if($id = (int) $item['client'])
                {
                    $clients[] = $id;
                }
            }

            if(!count($clients))
            {
                return;
            }

            $clients = cms::fetch_client()->ids($clients)->setKey('id')->run();

            foreach($items as &$item)
            {
                if(!isset($clients[$item['client']]))
                {
                    $item['client'] = null;
                }
                else 
                {
                    $item['client'] = (object) array_filter($clients[$item['client']]->toArray(), function($key)  
                    {
                        return !in_array($key, ['logged', 'verified', 'owner', 'admin']);
                    }, ARRAY_FILTER_USE_KEY);
                }
            }   
        }

        private function processRelations(object $collection, array &$items): void
        {
            $collections = $fields = $array = [];

            /* Get Relation Fields */
            foreach($collection->fields as $field)
            {
                if($field->type === 'Relation')
                {
                    $fields[] = $field;
                }
            }

            /* Get IDS From Relation */
            foreach($items as $item)
            {
                foreach($fields as $field)
                {
                    if(!$relation = (int) ($field->settings->collection ?? null))
                    {
                        continue;
                    }
    
                    if(!isset($collections[$relation]))
                    {
                        $collections[$relation] = [];
                    }
    
                    $collections[$relation] = array_merge($collections[$relation], $item[$field->name]);
                }
            }

            /* Get Items */
            foreach($collections as $relation => $ids)
            {
                if(!count($ids))
                {
                    continue;
                }

                $fetch = collections::fn_items($relation, function($config) use($ids)
                {
                    $config->id = $ids;
                }, ['clients', 'children', 'relations']);

                foreach($fetch as $item)
                {
                    $array[$item['id']] = $item;
                }
            }

            /* Set Relation Items */
            foreach($items as &$item)
            {
                foreach($fields as $field)
                {
                    foreach($item[$field->name] as $index => $id)
                    {
                        if(isset($array[$id]))
                        {
                            $item[$field->name][$index] = $array[$id];
                        }
                        else
                        {
                            unset($item[$field->name][$index]);
                        }
                    }

                    if(($field->settings->type ?? null) === 'single')
                    {
                        if(count($item[$field->name]))
                        {
                            $item[$field->name] = (object) $item[$field->name][array_rand($item[$field->name])];
                        }
                        else 
                        {
                            $item[$field->name] = null;
                        }
                    }
                }
            }
        }

        private function processChildren(object $collection, array &$items): void 
        {
            $parents = [];

            foreach($items as $item)
            {
                $parents[$item['id']] = [];
            }

            if(!count($parents))
            {
                return;
            }

            $fetch = collections::fn_items($collection, function($config) use($parents)
            {
                $config->parent = array_keys($parents);
                $config->key = 'id';
            }, ['clients', 'children', 'relations']);

            foreach($fetch as $item)
            {
                $parents[$item['parent']][] = $item;
            }

            foreach($items as &$item)
            {
                $item['children'] = $parents[$item['id']];
            }   
        }
    };