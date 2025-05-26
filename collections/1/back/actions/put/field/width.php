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

            if(!in_array($data['value'], [3, 6, 9, 12]))
            {
                return $response->message("Invalid width value provided.");
            }

            if(!$field->setWidth($data['value'])->update())
            {
                return $response->fatal(true)->message("Failed to update field width.");
            }

            $response->success(true);
            $response->message('Field width successfully updated.');

            $response->out('field', $field->toArray());

            return $response;
        }
    };