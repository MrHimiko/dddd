<?php

    namespace collections\fetch;

    class field extends \AddonFetch
    {
        public function id(int $id): self
        {
            $this->query()->where('field_id')->is('equal', $id);
            return $this;
        }

        public function ids(array $ids): self
        {
            $this->query()->where('field_id')->is('in', implode(',', $ids));
            return $this;
        }

        public function name(string $name): self
        {
            $this->query()->where('field_name')->is('equal', $name);
            return $this;
        }
        
        public function collection_id(int $id): self
        {
            $this->query()->where('field_collection_id')->is('equal', $id);
            return $this;
        }

        public function collection_ids(array $ids): self
        {
            $this->query()->where('field_collection_id')->is('in', implode(',', $ids));
            return $this;
        }

        public function type_id(int $id): self
        {
            $this->query()->where('field_type_id')->is('equal', $id);
            return $this;
        }

        public function collection_site_id(int $id): self
        {
            $this->query()->where('collection_site_id')->is('equal', $id);
            return $this;
        }

        public function collection_removed(bool $removed): self
        {
            $this->query()->where('collection_remove')->is('equal', $removed ? 't' : 'f');
            return $this;
        }
    }