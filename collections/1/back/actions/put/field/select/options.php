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

            if($field->getTypeId() !== 4)
            {
                return $response->message("Invalid field type.");
            }

            $options = [];
            $i = 0;

            foreach(explode(PHP_EOL, $data['value']) as $option)
            {
                if(!is_string($option) || strlen($option) > 70 || strlen($option) < 1)
                {
                    return $response->message('Each option can not exceed more than 70 characters.');
                }

                $options[$i] = $option;
                $i++;
            }

            if(count($options) > 50)
            {
                return $response->message('Total number of options can not exceed 50.');
            }

            if(!$field->jsonSet('options', $options)->update())
            {
                return $response->fatal(true)->message("Failed to update field options.");
            }

            $response->success(true);
            $response->message('Field options successfully updated.');

            $response->out('field', $field->toArray());

            return $response;
        }
    };