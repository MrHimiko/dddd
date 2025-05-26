<?php

    namespace collections\fetch;

    class item extends \AddonFetch
    {
        public function id(int $id): self
        {
            $this->query()->where('item_id')->is('equal', $id);
            return $this;
        }

        public function ids(array $ids): self
        {
            $this->query()->where('item_id')->is('in', implode(',', $ids));
            return $this;
        }

        public function client_id(int $id): self
        {
            $this->query()->where('item_client_id')->is('equal', $id);
            return $this;
        }

        public function parent_id(int $id): self
        {
            $this->query()->where('item_parent_id')->is('equal', $id);
            return $this;
        }

        public function parent_id_null(bool $null): self
        {
            $this->query()->where('item_parent_id')->is($null ? 'null' : 'notNull');
            return $this;
        }

        public function parent_ids(array $ids): self
        {
            $this->query()->where('item_parent_id')->is('in', implode(',', $ids));
            return $this;
        }

        public function collection_id(int $id): self
        {
            $this->query()->where('item_collection_id')->is('equal', $id);
            return $this;
        }
        
        public function collection_ids(array $ids): self
        {
            $this->query()->where('item_collection_id')->is('in', implode(',', $ids));
            return $this;
        }

        public function collection_site_id(int $id): self
        {
            $this->query()->where('collection_site_id')->is('equal', $id);
            return $this;
        }

        public function collection_removed(bool $removed): self
        {
            $this->query()->where('collection_removed')->is('equal', $removed ? 't' : 'f');
            return $this;
        }

        public function search(string $search): self
        {
            $this->query()->where('T1.item_name')->is('like', $search);
            return $this;
        }

        public function slug(string $slug): self
        {
            $this->query()->where('T1.item_slug')->is('equal', $slug);
            return $this;
        }

        public function published(bool $published): self
        {
            $this->query()->where('T1.item_published')->is('equal', $published ? 't' : 'f');
            return $this;
        }

        public function scheduleFrom(int $time): self
        {
            $this->query()->where('item_schedule_from')->is('lessEqualThan', $time)->or('item_schedule_from')->is('null');
            return $this;
        }

        public function scheduleTo(int $time): self
        {
            $this->query()->where('item_schedule_to')->is('greaterEqualThan', $time)->or('item_schedule_to')->is('null');
            return $this;
        }
    }