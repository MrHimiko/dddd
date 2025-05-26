<?php

    return new Class()
    {
        public array $permission = [
            [true, 'Truthy']
        ];

        public array $in = [
            'id'     => ['type' => 'integer', 'optional' => false],
            'limit'  => ['type' => 'integer', 'optional' => true],
            'page'   => ['type' => 'integer', 'optional' => true],
            'search' => ['type' => 'string', 'optional' => true],
            'sort'   => ['type' => 'string', 'optional' => true],
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

            $items = collections::fn_items($collection->getId(), function($config) use($data)
            {
                $config->sort = $data['sort'];
                $config->page = $data['page'];
                $config->limit = $data['limit'];
                $config->search = $data['search'];
                $config->parent = $data['parent'];
            }, ['relations', 'children']);

            $response->success(true);
            $response->message('Fetching items.');

            $response->out('items', $items);

            return $response;
        }
    };