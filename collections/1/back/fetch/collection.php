<?php

    namespace collections\fetch;

    class collection extends \AddonFetch
    {
        public function id(int $id): self
        {
            $this->query()->where('collection_id')->is('equal', $id);
            return $this;
        }

        public function ids(array $ids): self
        {
            $this->query()->where('collection_id')->is('in', implode(',', $ids));
            return $this;
        }

        public function search(string $name): self
        {
            $this->query()->where('collection_name')->is('like', $name)->or('collection_description')->is('like', $name);;
            return $this;
        }

        public function share(string $share): self
        {
            $this->query()->where('collection_share')->is('equal', $share);
            return $this;
        }

        public function site_id(int $id): self
        {
            $this->query()->where('collection_site_id')->is('equal', $id);
            return $this;
        }

        public function removed(bool $removed): self
        {
            $this->query()->where('collection_removed')->is('equal', $removed ? 't' : 'f');
            return $this;
        }

        public function global(bool $removed): self
        {
            $this->query()->where('collection_global')->is('equal', $removed ? 't' : 'f');
            return $this;
        }
    }