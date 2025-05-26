<?php

    use collections\entity\tab;

    return new Class()
    {
        public array $permission = [];
        public array $in = [
            'id' => ['type' => 'integer', 'optional' => false],
            'name' => ['type' => 'string', 'optional' => true],
        ];

        public array $out = [
            'tab' => ['type' => 'array', 'optional' => false],
        ];

        public function init(Addon $addon, AddonResponse $response, array $data): AddonResponse
        {
            /* Tab */
            if(!$tab = collections::fn_fetch_tab($data['id']))
            {
                return $response->message("Tab with ID :1 doesn't exist.", $data['id']);
            }

            if(!$this->name($tab, $response, $data['name']))
            {
                return $response;
            }

            if(!$tab->update())
            {
                return $response->message('Failed to update tab :1', $tab->getName());
            }

            $response->success(true);
            $response->message('Tab :1 successfully updated.', $tab->getName());

            $response->out('tab', $tab->toArray());

            return $response;
        }

        private function name(tab $tab, AddonResponse $response, ?string $name): bool
        {
            if($name !== null)
            {
                if($error = collections::fn_validate_tab_name($name))
                {
                    $response->message($error);
                    return false;
                }

                $tab->setName($name);
            }

            return true;
        }
    };