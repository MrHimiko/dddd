<?php

    return new Class()
    {
        public array $permission = [
            [true, 'Truthy']
        ];

        public array $in = [
            'slug' => ['type' => 'string', 'optional' => false],
        ];

        public array $out = [
            'collection' => ['type' => 'array', 'optional' => false],
            'fields'     => ['type' => 'array', 'optional' => false],
            'tabs'       => ['type' => 'array', 'optional' => false],
            'sections'   => ['type' => 'array', 'optional' => false],
        ];

        public function init(Addon $addon, AddonResponse $response, array $data): AddonResponse
        {
            if(!$collection = collections::fn_fetch_collection($data['slug']))
            {
                return $response->message('Collection with slug ":1" doesn\'t exist.', $data['id']);
            }

            $collection = $collection->toArray();
            
            $response->success(true);
            $response->message('Fetching collection.');

            $response->out('collection', $collection);
            $response->out('tabs', $this->tabs($collection['id']));
            $response->out('sections', $this->sections($collection['id']));
            $response->out('fields', $this->fields($collection['id']));

            return $response;
        }

        private function tabs(int $collection): array
        {
            $tabs = collections::fn_fetch_tabs($collection);

            foreach($tabs as &$tab)
            {
                $tab = $tab->toArray();
            }

            return $tabs;
        }

        private function sections(int $collection): array
        {
            $sections = collections::fn_fetch_tab_sections($collection);

            foreach($sections as &$section)
            {
                $section = $section->toArray();
            }

            return $sections;
        }

        private function fields(int $collection): array
        {
            $fields = collections::fn_fetch_fields($collection);

            foreach($fields as &$field)
            {
                $field = $field->toArray();
            }

            return $fields;
        }
    };