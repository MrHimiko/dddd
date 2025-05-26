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
            if(!$item = collections::fn_fetch_item($data['id']))
            {
                return $response->message("Item with provided ID doesn't exist.");
            }

            $cover = storage::fn_process_set(explode(',', $data['value']));

            $seo = $item->getSEO();

            if($cover)
            {
                $seo->cover = $cover;
            }
            else
            {
                unset($seo->cover);
            }

            if(!$item->setSEO($seo)->update())
            {
                return $response->fatal(true)->message("Failed to update item SEO data.");
            }

            $response->success(true);
            $response->message('Item SEO data successfully updated.');

            $response->out('item', $item->toArray());

            return $response;
        }
    };