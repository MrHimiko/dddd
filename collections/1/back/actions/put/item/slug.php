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

            if(!$slug = utils::fn_validate_slug($data['value'] ? $data['value'] : $item->getName()))
            {
                return $response->message('Please provide item slug.');
            }

            $item->setPublished($item->getPublished());
          
            if(!$item->setSlug($slug)->update())
            {
                return $response->fatal(true)->message("Failed to update item slug.");
            }

            $response->success(true);
            $response->message('Item slug successfully updated.');

            $response->out('item', $item->toArray());

            return $response;
        }

        private function slug(string $name): string 
        {
            $slug = strtolower(trim($name));
            $slug = preg_replace('/[^a-z0-9]+/', '-', $slug);
            $slug = preg_replace('/-+/', '-', $slug);
            $slug = trim($slug, '-');
            
            return $slug;
        }
    };