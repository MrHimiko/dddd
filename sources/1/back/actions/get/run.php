<?php

    return new class()
    {
        public array $in = [
            'data' => ['type' => 'string', 'optional' => false],
        ];

        public array $out = [];
        public array $permission = [[10, 'Equals', '10']];

        public function init(Addon $addon, AddonResponse $response, array $data): AddonResponse
        {
            $data = json_decode(urldecode($data['data']));

            if(!is_object($data))
            {
                return $response->message('Invalid data sent.');
            }

            $data = (array) $data;

            if(!array_key_exists('id', $data) || !array_key_exists('properties', $data) || !array_key_exists('filters', $data) || !array_key_exists('sort', $data))
            {
                return $response->message('Invalid data sent.');
            }

            if(!is_string($data['id']))
            {
                return $response->message('Invalid source ID.');
            }

            if(!is_string($data['sort']))
            {
                $data['sort'] = '';
            }

            if(!is_object($data['properties']))
            {
                $data['properties'] = new StdClass;
            }

            if(!is_array($data['filters']))
            {
                $data['filters'] = [];
            }

            $response->message('Getting data from source ":1".', $data['id']);
            $response->success(true);

            $source = source((string) $data['id'], (array) $data['properties'], (array) $data['filters'], (string) $data['sort']);

            $response->out('data', $source);

            return $response;
        }
    };