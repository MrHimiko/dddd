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
            if(!$field = collections::fn_fetch_field($data['id']))
            {
                return $response->message("Field with provided ID doesn't exist.");
            }

            if($field->getTypeId() !== 9)
            {
                return $response->message("Invalid field type.");
            }

            if(!$field->jsonSet('type', $data['value'] === 'single' ? 'single' : 'multiple')->update())
            {
                return $response->fatal(true)->message("Failed to update field options.");
            }

            $response->success(true);
            $response->message('Field options successfully updated.');

            $response->out('field', $field->toArray());

            return $response;
        }
    };