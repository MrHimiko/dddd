<?php

    return new class()
    {
        public array $in = [
            'name'       => ['type' => 'string', 'optional' => false],
            'collection' => ['type' => 'integer', 'optional' => false],
        ];

        public array $out = [
            'tab' => ['type' => 'array', 'optional' => false]
        ];

        public array $permission = [];

        public function init(Addon $addon, AddonResponse $response, array $data): AddonResponse
        {
            /* Collection */
            if(!$collection = collections::fn_fetch_collection($data['collection']))
            {
                return $response->message('Collection with ID :1 doesn\'t exist.', $data['id']);
            }

            /* Name */
            if($error = collections::fn_validate_tab_name($data['name']))
            {
                $response->message($error);
                return false;
            }

            /* Tab */
            if(!$tab = collections::fn_create_tab($collection->getId(), $data['name']))
            {
                return $response->message('There was problem creating collection tab.');
            }

            $response->message('Tab ":1" has been successfully created.', $tab->getName());
            $response->success(true);

            $response->out('tab', $tab->toArray());

            return $response;
        }
    };