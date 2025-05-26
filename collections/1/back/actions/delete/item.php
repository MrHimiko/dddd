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
                return $response->message('Item with ID :1 doesn\'t exist.', $data['id']);
            }

            /* Remove */
            if(!$item->delete())
            {
                return $response->fatal(true)->message('Failed to remove item ":1".', $item->getName());
            }

            $response->success(true);
            $response->message('Item ":1" successfully removed.', $item->getName());

            $response->out('item', (object) $item->toArray());

            return $response;
        }
    };