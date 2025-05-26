<?php

    return new Class()
    {
        public array $permission = [];

        public array $in = [
            'collection' => ['type' => 'integer', 'optional' => false],
        ];

        public array $out = [
            'fields' => ['type' => 'array', 'optional' => false],
        ];

        public function init(Addon $addon, AddonResponse $response, array $data): AddonResponse
        {
            if(!$collection = collections::fn_fetch_collection($data['collection']))
            {
                return $response->message("Collection with provided ID doesn't exist.");
            }

            $fields = collections::fetch_field()->collection_id($collection->getId())->run();

            foreach($fields as &$field)
            {
                $field = $field->toArray();
            }

            $response->success(true);
            $response->message('Fetching fields.');

            $response->out('fields', $fields);

            return $response;
        }
    };