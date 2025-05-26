<?php

    return new Class()
    {
        public array $permission = [];
        public array $in = [
            'order' => ['type' => 'object', 'optional' => false],
        ];

        public array $out = [];

        public function init(Addon $addon, AddonResponse $response, array $data): AddonResponse
        {
            $ids = [];

            foreach($data['order'] as $id => $order)
            {
                $id = (int) $id;
                $order = (int) $order;

                if($id && $order)
                {
                    $ids[$id] = $order;
                }
            }

            if(count($ids))
            {
                $items = collections::fetch_item()->join('INNER', 'collections.collection')->ids(array_keys($ids))->collection_site_id(site()->getId())->run();

                foreach($items as $item)
                {
                    if(array_key_exists($item->getId(), $ids))
                    {
                        $order = $ids[$item->getId()];

                        if($item->getOrder() !== $order)
                        {
                            if(!$item->setOrder($order)->update())
                            {
                                $response->fatal(true)->message('Failed to update item order.');
                            }
                        }
                    }
                }
            }

            $response->success(true);
            $response->message('Items order successfully updated.');

            return $response;
        }
    };