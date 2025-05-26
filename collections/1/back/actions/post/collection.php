<?php

    return new class()
    {
        public array $in = [
            'name' => ['type' => 'string', 'optional' => false],
        ];

        public array $out = [
            'collection' => ['type' => 'object', 'optional' => false],
            'tab' => ['type' => 'object', 'optional' => false],
        ];

        public array $permission = [];

        public function init(Addon $addon, AddonResponse $response, array $data): AddonResponse
        {
            /* Pool */
            if(!$pool = site()->pool())
            {
                return $response->message('There was problem creating new collection. Invalid pool site.');
            }

            /* Name */
            if($error = collections::fn_validate_name($data['name']))
            {
                $response->message($error);
                return false;
            }

            $pool->transaction('START');

            /* Collection */
            if(!$collection = collections::fn_create_collection($data['name']))
            {
                $pool->transaction('ROLLBACK');
                return $response->message('There was problem creating new collection.');
            }

            /* Tab */
            if(!$tab = collections::fn_create_tab($collection->getId(), 'General'))
            {
                $pool->transaction('ROLLBACK');
                return $response->message('There was problem creating collection tab.');
            }

            $pool->transaction('COMMIT');

            $response->message('Collection ":1" has been successfully created.', $collection->getName());
            $response->success(true);

            $response->out('collection', (object) $collection->toArray());
            $response->out('tab', (object) $tab->toArray());

            return $response;
        }
    };