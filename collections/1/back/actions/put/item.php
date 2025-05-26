<?php

    return new Class()
    {
        public array $permission = [];
        public array $in = [
            'id' => ['type' => 'integer', 'optional' => false],
        ];

        public array $out = [
            'item' => ['type' => 'object', 'optional' => false],
        ];

        public function init(Addon $addon, AddonResponse $response, array $data): AddonResponse
        {
            /* Item */
            if(!$item = collections::fn_fetch_item($data['id']))
            {
                return $response->message('Item with ID :1 doesn\'t exist.');
            }

            /* Update Item */
            $update = collections::fn_items_update($item, $data);

            if(!$update->success)
            {
                return $response->message(implode(PHP_EOL, $update->errors));
            }

            /* Re-Fetch */
            if(!$item = collections::fn_items($item->getCollectionId(), function($config) use($item) { $config->id = $item->getId(); }, ['relations', 'children']))
            {
                return $response->message('There was problem creating new item.');
            }

            $response->success(true);
            $response->message('Item ":1" was successfully updated.', $item[0]['name']);

            $response->out('item', (object) $item[0]);

            return $response;
        }
    };