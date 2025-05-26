<?php

    namespace collections\entity;

    class tab extends \AddonEntity
    {
        protected string $database = 'pool';
        protected string $prefix = 'tab_';
        protected string $table = 'collection_tabs';
        protected array $select = [
            'id', 'collection_id', 'name'
        ];

        /* Name */

        public function getName(): string
        {
            return $this->get('name');
        }

        public function setName(string $name): self
        {
            return $this->set('name', $name);
        }

        /* Collection */

        public function getCollection(): \collections\entity\colection
        {
            return $this->get('collection_id');
        }

        public function getCollectionId(): int
        {
            return $this->get('collection_id');
        }
 
        public function setCollectionId(int $id): self
        {
            return $this->set('collection_id', $id);
        }

        /* Array */

        public function toArray(): array
        {
            return [
                'id'         => $this->getId(),
                'name'       => $this->getName(),
                'collection' => $this->getCollectionId(),
            ];
        }
    };