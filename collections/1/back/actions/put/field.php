<?php

    use collections\entity\field;

    return new Class()
    {
        public array $permission = [];
        public array $in = [
            'id'    => ['type' => 'integer', 'optional' => false],
            'width' => ['type' => 'integer', 'optional' => true],
            'list'  => ['type' => 'boolean', 'optional' => true],
            'order' => ['type' => 'integer', 'optional' => true],
        ];

        public array $out = [
            'field' => ['type' => 'object', 'optional' => false],
        ];

        public function init(Addon $addon, AddonResponse $response, array $data): AddonResponse
        {
            /* Field */
            if(!$field = collections::fn_fetch_field($data['id']))
            {
                return $response->message('Field with ID :1 doesn\'t exist.', $data['id']);
            }

            if(
                !$this->width($field, $response, $data['width']) ||
                !$this->list($field, $response, $data['list'])  ||
                !$this->order($field, $response, $data['order']) 
            )
            {
                return $response;
            }

            if(!$field->update())
            {
                return $response->message('Failed to update field ":1"', $field->getName());
            }

            $response->success(true);
            $response->message('Field ":1" successfully updated.', $field->getName());

            $response->out('field', (object) $field->toArray());

            return $response;
        }

        private function width(field $field, AddonResponse $response, ?int $width): bool
        {
            if($width !== null)
            {
                if(!in_array($width, [3, 6, 9, 12]))
                {
                    $response->message('Invalid width value provided.');
                    return false;
                }

                $field->setWidth($width);
            }

            return true;
        }

        private function list(field $field, AddonResponse $response, ?bool $list): bool
        {
            if($list !== null)
            {
                $field->setList($list);
            }

            return true;
        }

        private function order(field $field, AddonResponse $response, ?int $order): bool
        {
            if($order !== null)
            {
                $field->setOrder($order);
            }

            return true;
        }
    };