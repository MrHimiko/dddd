<?php

    return new class()
    {
        public array $in = [
            'name'       => ['type' => 'string', 'optional' => false],
            'id'         => ['type' => 'integer', 'optional' => true],
            'slug'       => ['type' => 'string', 'optional' => true],
            'collection' => ['type' => 'integer', 'optional' => false],
            'parent'     => ['type' => 'integer', 'optional' => true]
        ];

        public array $out = [
            'item' => ['type' => 'object', 'optional' => false]
        ];

        public array $permission = [];

        public function init(Addon $addon, AddonResponse $response, array $data): AddonResponse
        {
            /* Collection */
            if(!$collection = collections::fn_fetch_collection($data['collection']))
            {
                return $response->message("Collection with provided ID doesn't exist.");
            }

            $item = null;

            /* Find Item */
            if($data['id'] || $data['slug'])
            {
                $item = collections::fn_fetch_item(
                    $data['id'] ? $data['id'] : utils::fn_validate_slug($data['slug']
                ), $collection->getId());
            }

            /* Create Item */
            if(!$item && !$item = collections::fn_items_create($collection->getId(), $data['name'], $data['slug']))
            {
                return $response->message('There was problem creating new item222.');
            }

            /* Update Item */
            $update = collections::fn_items_update($item, $data);

            if(!$update->success)
            {
                return $response->message(implode(PHP_EOL, $update->errors));
            }

            /* Re-Fetch */
            if(!$item = collections::fn_items($collection->getId(), function($config) use($item) { $config->id = $item->getId(); }, ['relations', 'children']))
            {
                return $response->message('There was problem creating new item33.');
            }

            $response->message('Item ":1" was successfully created.', $item[0]['name']);
            $response->success(true);

            $response->out('item', (object) $item[0]);

            return $response;
        }
    };