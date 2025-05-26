<?php

    use collections\entity\tab_section;

    return new Class()
    {
        public array $permission = [];
        public array $in = [
            'id'    => ['type' => 'integer', 'optional' => false],
            'name'  => ['type' => 'string', 'optional' => true],
            'order' => ['type' => 'integer', 'optional' => true],
        ];

        public array $out = [
            'section' => ['type' => 'array', 'optional' => false],
        ];

        public function init(Addon $addon, AddonResponse $response, array $data): AddonResponse
        {
            /* Section */
            if(!$section = collections::fn_fetch_tab_section($data['id']))
            {
                return $response->message("Section with provided ID doesn't exist.");
            }

            if(
                !$this->name($section, $response, $data['name']) ||
                !$this->order($section, $response, $data['order'])
            )
            {
                return $response;
            }

            if(!$section->update())
            {
                return $response->message('Failed to update section ":1"', $section->getName());
            }

            $response->success(true);
            $response->message('Section ":1" successfully updated.', $section->getName());

            $response->out('section', $section->toArray());

            return $response;
        }

        private function name(tab_section $section, AddonResponse $response, ?string $name): bool
        {
            if($name !== null)
            {
                if($error = collections::fn_validate_name($name))
                {
                    $response->message($error);
                    return false;
                }

                $section->setName($name);
            }

            return true;
        }

        private function order(tab_section $section, AddonResponse $response, ?int $order): bool
        {
            if($order !== null)
            {
                $section->setOrder($order);
            }

            return true;
        }
    };