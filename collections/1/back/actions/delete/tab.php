<?php

    return new Class()
    {
        public array $permission = [];
        public array $in = [
            'id' => ['type' => 'integer', 'optional' => false],
        ];

        public array $out = [
            'tab' => ['type' => 'object', 'optional' => false],
        ];

        public function init(Addon $addon, AddonResponse $response, array $data): AddonResponse
        {
            /* Tab */
            if(!$tab = collections::fn_fetch_tab($data['id']))
            {
                return $response->message("Collection tab with provided ID doesn't exist.");
            }

            if(!$tab->delete())
            {
                return $response->fatal(true)->message('Failed to remove tab ":1".', $tab->getName());
            }

            $response->success(true);
            $response->message('Tab ":1" successfully removed.', $tab->getName());

            $response->out('tab', (object) $tab->toArray());

            return $response;
        }
    };