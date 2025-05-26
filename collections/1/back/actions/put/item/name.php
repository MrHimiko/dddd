<?php

    return new Class()
    {
        public array $permission = [];
        public array $in = [
            'id' => ['type' => 'integer', 'optional' => false],
            'value' => ['type' => 'string', 'optional' => false],
        ];

        public array $out = [
            'item' => ['type' => 'array', 'optional' => false],
        ];

        public function init(Addon $addon, AddonResponse $response, array $data): AddonResponse
        {
            if(!strlen($data['value']))
            {
                return $response->message('Please provide item name.');
            }

            if(!$item = collections::fn_fetch_item($data['id']))
            {
                return $response->message("Item with provided ID doesn't exist.");
            }

            $item->setPublished($item->getPublished());

            if(!$item->setName($data['value'])->update())
            {
                return $response->fatal(true)->message("Failed to update item name.");
            }

            $response->success(true);
            $response->message('Item name successfully updated.');

            $response->out('item', $item->toArray());

            return $response;
        }
    };