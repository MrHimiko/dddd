<?php

    namespace collections\fetch;

    class tab_section extends \AddonFetch
    {
        public function id(int $id): self
        {
            $this->query()->where('section_id')->is('equal', $id);
            return $this;
        }

        public function ids(array $ids): self
        {
            $this->query()->where('section_id')->is('in', implode(',', $ids));
            return $this;
        }

        public function collection_id(int $id): self
        {
            $this->query()->where('section_collection_id')->is('equal', $id);
            return $this;
        }

        public function collection_ids(array $ids): self
        {
            $this->query()->where('section_collection_id')->is('in', implode(',', $ids));
            return $this;
        }

        public function tab_id(int $id): self
        {
            $this->query()->where('section_tab_id')->is('equal', $id);
            return $this;
        }

        public function collection_site_id(int $id): self
        {
            $this->query()->where('collection_site_id')->is('equal', $id);
            return $this;
        }
    }