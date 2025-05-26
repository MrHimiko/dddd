<?php

    namespace collections\fetch;

    class field_type extends \AddonFetch
    {
        public function id(int $id): self
        {
            $this->query()->where('type_id')->is('equal', $id);
            return $this;
        }

        public function ids(array $ids): self
        {
            $this->query()->where('type_id')->is('in', implode(',', $ids));
            return $this;
        }
    }