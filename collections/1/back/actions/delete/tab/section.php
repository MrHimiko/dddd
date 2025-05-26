<?php

    return new Class()
    {
        public array $permission = [];
        public array $in = [
            'id' => ['type' => 'integer', 'optional' => false],
        ];

        public array $out = [
            'section' => ['type' => 'object', 'optional' => false],
        ];

        public function init(Addon $addon, AddonResponse $response, array $data): AddonResponse
        {
            /* Section */
            if(!$section = collections::fn_fetch_tab_section($data['id']))
            {
                return $response->message('Section with ID :1 doesn\'t exist.', $data['id']);
            }

            /* Remove */
            if(!$section->delete())
            {
                return $response->fatal(true)->message('Failed to remove section ":1".', $section->getName());
            }

            $response->success(true);
            $response->message('Section ":1" successfully removed.', $section->getName());

            $response->out('section', (object) $section->toArray());

            return $response;
        }
    };