<?php

    return new Class()
    {
        public array $permission = [];
        public array $in = [
            'id' => ['type' => 'integer', 'optional' => false],
            'value' => ['type' => 'string', 'optional' => false],
        ];

        public array $out = [
            'field' => ['type' => 'array', 'optional' => false],
        ];

        public function init(Addon $addon, AddonResponse $response, array $data): AddonResponse
        {
            $data['value'] = json_decode($data['value']);

            if(!is_object($data['value']))
            {
                return $response->message("Invalid value, extected JSON.");
            }

            if(!$field = collections::fn_fetch_field($data['id']))
            {
                return $response->message("Field with provided ID doesn't exist.");
            }

            if($field->getTypeId() !== 10)
            {
                return $response->message("Invalid field type.");
            }

            if(!$field->jsonSet('config', $data['value'])->update())
            {
                return $response->fatal(true)->message("Failed to update field options.");
            }

            $response->success(true);
            $response->message('Field options successfully updated.');

            $response->out('field', $field->toArray());

            return $response;
        }
    };