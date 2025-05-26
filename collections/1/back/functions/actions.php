<?php

    return new class()
    {
        public function init(Addon $addon, object $collections): void 
        {
            Addons::getOne('md.actions', function(Addon $actions) use($collections)
            {
                foreach($collections as $collection)
                {
                    $this->get($actions, $collection);
                }
            });
        }

        private function get(Addon $actions, object $collection): void 
        {
            $actions->ItemAdd([
                'id'          => 'COLLECTIONS GET' . $collection->id,
                'name'        => 'GET ' . $collection->name,
                'description' => 'Get items from collection "' . $collection->name . '"',
                'group'       => 'COLLECTIONS',
                'options'     => function()
                {
                    return [
                        'id' => [
                            'match' => 'integer|null',
                            'variable' => true
                        ],
                        'slug' => [
                            'match' => 'string|null',
                            'variable' => true
                        ],
                        'limit' => [
                            'value' => 20,
                            'variable' => true
                        ],
                        'page' => [
                            'value' => 1,
                            'variable' => true
                        ],
                        'published' => [
                            'type'   => 'SELECT',
                            'value'  => 'any',
                            'values' => [
                                ['title' => 'Any', 'value' => 'any'],
                                ['title' => 'Yes', 'value' => 'yes'],
                                ['title' => 'No',  'value' => 'any'],
                            ]
                        ],
                        'data' => [
                            'type'   => 'SELECT',
                            'value'  => 'array',
                            'group'  => 'Variable',
                            'values' => [
                                ['title' => 'Array', 'value' => 'array', 'description' => 'Returns an array (list) of all items that are found.'],
                                ['title' => 'Object', 'value' => 'object', 'description' => 'Returns an object (single item). In case multiple items are found, only one randomly will be returned.']
                            ]
                        ],
                        'variable' => [
                            'match'    => 'string',
                            'label'    => 'Name',
                            'group'    => 'Variable',
                            'required' => true,
                        ]
                    ];
                },
                'function' => function(object $data, object $values, callable $callback) use($collection)
                {
                    $variable = utils::fn_validate_slug($values->variable);

                    $items = collections::fn_items($collection, function($config) use($values)
                    {
                        $config->limit = $values->limit;
                        $config->page = $values->page;
                        $config->id = $values->id;
                        $config->slug = $values->slug;
                    }, ['children', 'relations', 'client']);

                    if($values->data === 'object')
                    {
                        $items = count($items) ? (object) $items[array_rand($items)] : null;
                    }

                    $data->{$variable} = $items;
                    $callback(['success' => true]);
                }
            ]);
        }
    };