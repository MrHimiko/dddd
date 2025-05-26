<?php

    return new Class()
    {
        public array $permission = [];
        public array $in = [
            'id' => ['type' => 'integer', 'optional' => false],
        ];

        public array $out = [
            'field' => ['type' => 'object', 'optional' => false],
        ];

        public function init(Addon $addon, AddonResponse $response, array $data): AddonResponse
        {
            /* Field */
            if(!$field = collections::fn_fetch_field($data['id']))
            {
                return $response->message("Field with ID :1 doesn't exist.", $data['id']);
            }

            /* Remove */
            if(!$field->delete())
            {
                return $response->fatal(true)->message('Failed to remove field ":1".', $field->getName());
            }

            $response->success(true);
            $response->message('Field ":1" was successfully removed.', $field->getName());

            $response->out('field', (object) $field->toArray());

            return $response;
        }
    };