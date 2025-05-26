<?php

    return new Class()
    {
        public array $permission = [];
        public array $in = [
            'id' => ['type' => 'integer', 'optional' => false],
            'value' => ['type' => 'integer', 'optional' => false],
        ];

        public array $out = [
            'field' => ['type' => 'array', 'optional' => false],
        ];

        public function init(Addon $addon, AddonResponse $response, array $data): AddonResponse
        {
            if(!$field = collections::fn_fetch_field($data['id']))
            {
                return $response->message("Field with provided ID doesn't exist.");
            }

            if(!$field->setOrder($data['value'])->update())
            {
                return $response->fatal(true)->message("Failed to update field order.");
            }

            $response->success(true);
            $response->message('Field order successfully updated.');

            $response->out('field', $field->toArray());

            return $response;
        }
    };