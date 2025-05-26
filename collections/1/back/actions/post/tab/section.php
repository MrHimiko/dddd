<?php

    return new class()
    {
        public array $in = [
            'name' => ['type' => 'string', 'optional' => false],
            'tab' => ['type' => 'integer', 'optional' => false],
        ];

        public array $out = [
            'section' => ['type' => 'object', 'optional' => false]
        ];

        public array $permission = [];

        public function init(Addon $addon, AddonResponse $response, array $data): AddonResponse
        {
            /* Tab */
            if(!$tab = collections::fn_fetch_tab($data['tab']))
            {
                return $response->message("Collection tab with provided ID doesn't exist.");
            }

            /* Name */
            if($error = collections::fn_validate_name($data['name']))
            {
                $response->message($error);
                return false;
            }

            /* Section */
            if(!$section = collections::fn_create_tab_section($tab->getCollectionId(), $data['name'], $tab->getId()))
            {
                return $response->message('There was problem creating section ":1".', $data['name']);
            }

            $response->message('Section ":1" has been successfully created.', $section->getName());
            $response->success(true);

            $response->out('section', (object) $section->toArray());

            return $response;
        }
    };