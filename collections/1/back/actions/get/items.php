<?php

    return new Class()
    {
        public array $permission = [];

        public array $in = [
            'id'      => ['type' => 'integer', 'optional' => false],
            'parent'  => ['type' => 'integer', 'optional' => true],
            'ids'     => ['type' => 'string', 'optional' => true],
            'limit'   => ['type' => 'integer', 'optional' => true, 'value' => 100],
            'page'    => ['type' => 'integer', 'optional' => true, 'value' => 1],
            'search'  => ['type' => 'string', 'optional' => true],
            'sort'    => ['type' => 'string', 'optional' => true],
            'filters' => ['type' => 'array', 'optional' => true],
        ];

        public array $out = [
            'items' => ['type' => 'array', 'optional' => false],
        ];

        public function init(Addon $addon, AddonResponse $response, array $data): AddonResponse
        {
            /* Collection */
            if(!$collection = collections::fn_fetch_collection($data['id']))
            {
                return $response->message("Collection with provided ID doesn't exist.");
            }

            $items = collections::fn_items($collection->getId(), function($config) use($data, $collection)
            {
                /* Split */
                if($collection->getSplit() && $collection->getClientId() !== client()->getId())
                {
                    $config->client = client()->getId();
                }

                if($data['search'])
                {
                    $config->search = $data['search'];
                }

                $config->sort = $data['sort'];
                $config->page = $data['page'];
                $config->limit = $data['limit'];
                
                if($data['ids'] === null) 
                {
                    $config->parent = $data['parent'] ? $data['parent'] : false;
                }

                if($data['filters'])
                {
                    foreach($data['filters'] as $index => &$filter)
                    {
                        if(!is_object($filter) && !is_array($filter))
                        {
                            unset($data['filters'][$index]);
                            continue;
                        }

                        $filter = (object) $filter;

                        foreach($filter as $key => $value)
                        {
                            if(!in_array($key, ['field', 'operator', 'value']) || !is_scalar($value))
                            {
                                unset($filter->{$key});
                            }
                        }

                        $filter->value = (string) $filter->value;
                        $filter->field = (object) ['name' => explode(':', $filter->field)[0]];

                        if(!is_string($filter->operator ?? null))
                        {
                            unset($data['filters'][$index]);
                            continue;
                        }

                        if(!is_string($filter->value ?? null))
                        {
                            unset($data['filters'][$index]);
                            continue;
                        }
                    }

                    if(count($data['filters']))
                    {
                        $config->filters = $data['filters'];
                    }
                }

                if($data['ids'] !== null)
                {
                    $config->id = explode(',', $data['ids']);
                }
            }, ['relations', 'children']);

            $response->success(true);
            $response->message('Fetching items.');

            $response->out('items', $items);

            return $response;
        }
    };