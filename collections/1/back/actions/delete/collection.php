<?php

    return new Class()
    {
        public array $permission = [];

        public array $in = [
            'id' => ['type' => 'integer', 'optional' => false],
        ];

        public array $out = [
            'collection' => ['type' => 'object', 'optional' => false],
        ];

        public function init(Addon $addon, AddonResponse $response, array $data): AddonResponse
        {
            /* Collection */
            if(!$collection = collections::fn_fetch_collection($data['id']))
            {
                return $response->message('Collection with ID :1 doesn\'t exist.', $data['id']);
            }

            /* Remove */
            if(!$collection->setRemoved(true)->update())
            {
                return $response->fatal(true)->message('Failed to remove collection ":1".', $collection->getName());
            }

            $response->success(true);
            $response->message('Collection ":1" was successfully removed.', $collection->getName());

            $response->out('collection', (object) $collection->toArray());

            return $response;
        }
    };