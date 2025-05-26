<?php

    return new class()
    {
        public array $in = [
            'name' => ['type' => 'string', 'optional' => false],
            'section' => ['type' => 'integer', 'optional' => false],
            'field_type' => ['type' => 'integer', 'optional' => false],
        ];

        public array $out = [
            'field' => ['type' => 'array', 'optional' => false]
        ];

        public array $permission = [];

        public function init(Addon $addon, AddonResponse $response, array $data): AddonResponse
        {
            $data['name'] = utils::fn_validate_slug($data['name']);

            if(in_array(strtolower($data['name']), ['id', 'order', 'type', 'collection', 'parent', 'name', 'slug', 'client', 'updated', 'created', 'published', 'children', 'seo', 'schedule']))
            {
                return $response->message("Following names are reserved: 'id', 'order ,'type', 'collection', 'parent', 'name', 'slug', 'client', 'updated', 'created', 'published', 'children', 'seo', 'schedule");
            }

            /* Section */
            if(!$section = collections::fn_fetch_tab_section($data['section']))
            {
                return $response->message('Section with ID :1 doesn\'t exist.', $data['id']);
            }

            /* Exist */
            if($this->exist($section->getCollectionId(), $data['name']))
            {
                return $response->message('Field ":1" already exist. Please try using different name.', $data['name']);
            }

            /* Type */
            if(!$type = collections::fn_fetch_field_type($data['field_type']))
            {
                return $response->message('Field type with ID :1 doesn\'t exist.', $data['field_type']);
            }

            /* Field */
            if(!$field = collections::fn_create_field($section->getCollectionId(), $data['name'], $type->getId(), $section->getId()))
            {
                return $response->message('There was problem creating new field.');
            }

            $response->message('Field ":1" has been successfully created.', $field->getName());
            $response->success(true);

            $response->out('field', $field->toArray());

            return $response;
        }

        private function exist(int $collection, string $name): int 
        {
            return collections::fetch_field()->collection_id($collection)->name($name)->setLimit(1)->doCount();
        }
    };