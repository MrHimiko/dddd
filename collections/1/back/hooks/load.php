<?php

    use cms\entity\addon_install;

    return new class()
    {
        public function init(Addon $addon, addon_install $install)
        {
            $collections = $addon->Fn('object.all');

            $addon->Fn('actions', $collections);

            $this->parent($collections, $install);

            if($this->share($collections))
            {
                return;
            }

            $this->variables($collections, $install);
            $this->sources($collections);

            return;
            
            $this->actions($collections);
        }

        private function parent(object $collections, cms\entity\addon_install $install)
        {
            if(!$parent = site()->getSetting('dh.parent', 0))
            {
                return;
            }

            if(!$parentInstall = cms::fetch_addon_install()->site_id($parent)->addon_id($install->getAddonId())->setLimit(1)->run())
            {
                return;
            }

            foreach($parentInstall->jsonGet('collections', new StdClass) as $id => $collection)
            {
                $collections->{$id} = $collection;
            }
        }

        private function share(object $collections): bool
        {
            $uri = utils::fn_headers_uri();

            if(count($uri->array) !== 2)
            {
                return false;
            }

            if($uri->array[0] !== 'collections')
            {
                return false;
            }

            $share = false;

            foreach($collections as $collection)
            {
                if(!isset($collection->share))
                {
                    continue;
                }

                if($collection->share && $collection->share === $uri->array[1])
                {
                    cms::addon()->SetTemp('share', 'collections/' . $collection->share);
                    
                    $share = true;
                    break;
                }
            }

            return $share;
        }

        private function variables(object $collections, addon_install $install): void 
        {
            foreach($collections as $collection)
            {
                if(!isset($collection->variable))
                {
                    continue;
                }

                if(!$collection->variable->enabled)
                {
                    continue;
                }

                $items = $collection->variable->items ?? [];

                if(!is_array($items) && !is_object($items))
                {
                    $items = null;
                }

                mdVars::fn_add('collections', $collection->name, $items);
            }
        }

        private function sources(object $collections): void
        {
            foreach($collections as $collection)
            {
                $sort = [];
                $fields = [];

                $properties = [
                    'id' => ['type' => 'input', 'value' => ''],
                    'slug' => ['type' => 'input', 'value' => ''],
                    'parent' => ['type' => 'input', 'value' => 0],
                    'client' => ['type' => 'input', 'value' => 0]
                ];

                foreach($collection->fields as $field)
                {
                    $type = 'INPUT';
                    $options = new StdClass;

                    if($field->type === 'Select')
                    {
                        $type = 'SELECT';
                        $options = $field->settings->options;
                    }

                    if($field->type === 'Relation')
                    {
                        $type = 'SOURCE';
                        $options = (object) ['source' => 'collection.' . $field->settings->collection];
                    }

                    $fields[$field->id] = (object) [
                        'id'      => $field->id,
                        'name'    => $field->name,
                        'type'    => $type,
                        'options' => $options
                    ];

                    if(in_array($field->type, ['Text', 'Date']))
                    {
                        $sort[$field->id . '-asc'] = $field->name . ' - Ascending';
                        $sort[$field->id . '-desc'] = $field->name . ' - Descending';
                    }
                }

                $fields['name'] = (object) [
                    'id'      => 'name',
                    'name'    => 'name',
                    'type'    => 'text',
                    'options' => null
                ];

                $fields['slug'] = (object) [
                    'id'      => 'slug',
                    'name'    => 'slug',
                    'type'    => 'text',
                    'options' => null
                ];

                $sort['name-asc'] = 'Name - Ascending';
                $sort['name-desc'] = 'Name - Descending';
                $sort['created-asc'] = 'Created - Ascending';
                $sort['created-desc'] = 'Created - Descending';
                $sort['order-asc'] = 'Order - Ascending';
                $sort['order-desc'] = 'Order - Descending';
                $sort['random'] = 'Random';

                mdSources::addon()->ItemAdd([
                    'id'         => 'collection.' . $collection->id,
                    'folder'     => 'Collections',
                    'title'      => $collection->name,
                    'properties' => $properties,
                    'fields'     => $fields,
                    'operators'  => [
                        'Equals'           => 'Equals',
                        'NotEquals'        => 'Not Equals',
                        'LessThan'         => 'Less Than',
                        'LessEqualThan'    => 'Less Equal Than',
                        'GreaterThan'      => 'Greater Than',
                        'GreaterEqualThan' => 'Greater Equal Than',
                        'Contains'         => 'Contains',
                        'NotContains'      => 'Not Contains',
                        'StartsWith'       => 'Starts With',
                        'EndsWith'         => 'Ends With',
                        'True'             => 'True',
                        'False'            => 'False',
                        'Empty'            => 'Empty',
                        'NotEmpty'         => 'Not Empty',
                        'In'               => 'In',
                        'NotIn'            => 'Not In',
                        'Includes'         => 'Includes',
                        'NotIncludes'      => 'Not Includes'
                    ],
                    'sort' => $sort,
                    'callback' => function(array $properties, array $filters, string $sort) use($collection): array
                    {
                        if($properties['slug'])
                        {
                            return collections::fn_items($collection, function($config) use($filters, $properties)
                            {
                                $config->schedule = true;
                                $config->slug     = $properties['slug'];
                                $config->filters  = $filters;

                                if(!client()->isAdmin())
                                {
                                    $config->published = true;
                                }
                            });
                        }

                        return collections::fn_items($collection, function($config) use($filters, $sort, $properties)
                        {
                            $config->parent = $properties['search'] ? null : false;
                            $config->schedule = true;

                            if($properties['parent'])
                            {
                                $config->parent = $properties['parent'];
                            }

                            if($properties['client'])
                            {
                                $config->client = $properties['client'];
                            }

                            $config->filters = $filters;
                            $config->sort = $sort;
                            $config->page = $properties['page'];
                            $config->limit = $properties['limit'];
                            $config->offset = $properties['offset'];

                            if(!client()->isAdmin())
                            {
                                $config->published = true;
                            }

                            if($properties['search'])
                            {
                                $config->search = $properties['search'];
                            }

                            if($properties['id'])
                            {
                                $config->id = explode(',', $properties['id']);
                            }

                            if($properties['limit'] > 1)
                            {
                                $config->trim = true;
                            }
                        });
                    },
                    'sitemap' => function(string $url, callable $callback) use($collection): void 
                    {
                        $page = 1;

                        while($items = collections::fn_items($collection, function($config) use($page)
                        {
                            $config->limit     = 1000;
                            $config->page      = $page;
                            $config->published = true;
                            $config->parent    = false;
                            $config->trim      = true;
                            $config->schedule  = true;

                        }, ['clients', 'relations', 'children']))
                        {
                            foreach($items as $item)
                            {
                                $newUrl = str_replace(':id', $item['id'], $url);
                                $newUrl = str_replace(':slug', $item['slug'], $newUrl);
    
                                $callback($newUrl);
                            }

                            $page = $page + 1;
                        }
                    }
                ]);
            }
        }

        private function actions(object $collections): void 
        {
            foreach($collections as $collection)
            {
                $options = [];

                foreach($collection->fields as $field)
                {
                    $options[$field->id] = [
                        'label' => $field->name,
                        'type' => 'INPUT'
                    ];
                }

                $options['name'] = [
                    'group'    => 'Main',
                    'value'    => '',
                    'required' => true
                ];

                $options['slug'] = [
                    'group'    => 'Main',
                    'value'    => '',
                    'required' => true
                ];

                $options['variable'] = [
                    'label'    => 'Name',
                    'group'    => 'Variable',
                    'required' => true,
                ];

                mdActions::addon()->ItemAdd([
                    'id' => 'COLLECTIONS ITEMS CREATE ' . $collection->id,
                    'name' => 'Create ' . $collection->name,
                    'group' => 'Collections',
                    'description' => 'Creates collection item for "' . $collection->name . '"',
                    'options' => $options,
                    'function' => function(object $data, object $options, callable $callback) use($collection)
                    {
                        if(utils::fn_headers_method() === 'GET')
                        {
                            return $callback(['stop' => true]);
                        }

                        $fields = [
                            'collection' => $collection->id
                        ];

                        foreach($options as $key => $values)
                        {
                            $fields[$key] = $values[0] ?? null;
                        }

                        $response = collections::action_post_item($fields);

                        /* Variable */
                        $data->{$options->variable[0]} = $response->getSuccess() ? $response->getOut('item') : null;
                        $callback();
                    }
                ]);

                // mdActions::addon()->ItemAdd([
                //     'id' => 'COLLECTIONS ITEMS GET ' . $collection->id,
                //     'name' => 'Get One ' . $collection->name,
                //     'group' => 'Collections',
                //     'description' => 'Retrieves single collection item from "' . $collection->name . '"',
                //     'options' => [
                //         'id' => [
                //             'label' => 'ID',
                //             'type'  => 'INPUT'
                //         ],
                //         'slug' => [
                //             'label' => 'Slug',
                //             'type'  => 'INPUT',
                //         ],
                //         'variable' => [
                //             'label'    => 'Name',
                //             'group'    => 'Variable',
                //             'type'     => 'INPUT',
                //             'required' => true,
                //         ]
                //     ],
                //     'function' => function(object $data, object $options, callable $callback) use($collection)
                //     {
                //         $id = (int) ($options->id[0] ?? null);
                //         $slug = $options->slug[0] ?? null;
                //         $item = null;

                //         if($id)
                //         {
                //             $item = collections::fn_get_items($collection, [], null, 1, 1, null, null, [$id], false);
                //         }
                //         else if($slug)
                //         {
                //             $item = collections::fn_get_items($collection, [], null, 1, 1, 'slug::' . $slug, null, null, false);
                //         }

                //         $item = $item ? count($item) ? $item[0] : null : null;

                //         $data->{$options->variable[0]} = $item;

                //         return $callback();
                //     }
                // ]);
            }
        }
    };