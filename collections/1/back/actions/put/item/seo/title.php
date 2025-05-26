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

            if(strlen($data['value']) > 500)
            {
                return $response->message('Meta title can not exceed 500 characters.');
            }
            
            $seo = $item->getSEO();

            if($data['value'])
            {
                $seo->title = $data['value'];
            }
            else
            {
                unset($seo->title);
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