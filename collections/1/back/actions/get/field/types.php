<?php

    return new Class()
    {
        public array $permission = [];
        
        public array $in = [];

        public array $out = [
            'types' => ['type' => 'array', 'optional' => false],
        ];

        public function init(Addon $addon, AddonResponse $response, array $data): AddonResponse
        {
            $types = collections::fn_fetch_field_types();

            foreach($types as &$type)
            {
                $type = $type->toArray();
            }

            $response->success(true);
            $response->message('Fetching field types.');

            $response->out('types', $types);

            return $response;
        }
    };