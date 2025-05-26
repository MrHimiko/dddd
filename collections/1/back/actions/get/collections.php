<?php

    return new Class()
    {
        public array $permission = [];

        public array $in = [
            'search'   => ['type' => 'string', 'optional' => true],
            'global'   => ['type' => 'boolean', 'optional' => true],
            'fields'   => ['type' => 'boolean', 'optional' => true, 'value' => true],
            'tabs'     => ['type' => 'boolean', 'optional' => true, 'value' => true],
            'sections' => ['type' => 'boolean', 'optional' => true, 'value' => true],
        ];

        public array $out = [
            'collections' => ['type' => 'array', 'optional' => false],
            'fields'      => ['type' => 'array', 'optional' => true],
            'tabs'        => ['type' => 'array', 'optional' => true],
            'sections'    => ['type' => 'array', 'optional' => true],
        ];

        public function init(Addon $addon, AddonResponse $response, array $data): AddonResponse
        {
            if($data['global'])
            {
                $collections = collections::fetch_collection()->global(true)->removed(false)->setKey('id');
            }
            else
            {
                $collections = collections::fetch_collection()->site_id(site()->getId())->removed(false)->setKey('id');
            }

            if($data['search'])
            {
                $collections->search($data['search']);
            }

            $collections = $collections->run();

            foreach($collections as &$collection)
            {
                $collection = $collection->toArray();
            }

            $response->success(true);
            $response->message('Fetching collections.');

            $response->out('collections', array_values($collections));
            $response->out('tabs', $data['tabs'] ? $this->tabs(array_keys($collections)) : []);
            $response->out('sections', $data['sections'] ? $this->sections(array_keys($collections)) : []);
            $response->out('fields', $data['fields'] ? $this->fields(array_keys($collections)) : []);

            return $response;
        }

        private function organizations(array $ids): array
        {
            $tabs = collections::fn_fetch_tabs($collections);

            foreach($tabs as &$tab)
            {
                $tab = $tab->toArray();
            }

            return $tabs;
        }

        private function tabs(array $collections): array
        {
            $tabs = collections::fn_fetch_tabs($collections);

            foreach($tabs as &$tab)
            {
                $tab = $tab->toArray();
            }

            return $tabs;
        }

        private function sections(array $collections): array
        {
            $sections = collections::fn_fetch_tab_sections($collections);

            foreach($sections as &$section)
            {
                $section = $section->toArray();
            }

            return $sections;
        }

        private function fields(array $collections): array
        {
            $fields = collections::fn_fetch_fields($collections);

            foreach($fields as &$field)
            {
                $field = $field->toArray();
            }

            return $fields;
        }
    };