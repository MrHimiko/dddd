<?php

    namespace collections\entity;

    class field extends \AddonEntity
    {
        protected string $database = 'pool';
        protected string $prefix = 'field_';
        protected string $table = 'collection_fields';
        protected array $select = [
            'id', 'collection_id', 'type_id', 'section_id', 'order', 'width', 'list',
            'name', 'json'
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

        public function getCollection(): \collections\entity\collection
        {
            return $this->entity('collections.collection');
        }

        public function getCollectionId(): int
        {
            return $this->get('collection_id');
        }
 
        public function setCollectionId(int $id): self
        {
            return $this->set('collection_id', $id);
        }

        /* Type */

        public function getType(): \collections\entity\field_type
        {
            return $this->entity('collections.field_type');
        }

        public function getTypeId(): int
        {
            return $this->get('type_id');
        }
 
        public function setTypeId(int $id): self
        {
            return $this->set('type_id', $id);
        }

        /* Section */

        public function getSection(): \collections\entity\tab_section
        {
            return $this->entity('collections.tab_section');
        }

        public function getSectionId(): int
        {
            return $this->get('section_id');
        }
 
        public function setSectionId(int $id): self
        {
            return $this->set('section_id', $id);
        }

        /* Order */

        public function getOrder(): int
        {
            return $this->get('order');
        }

        public function setOrder(int $order): self
        {
            return $this->set('order', $order);
        }

        /* List */

        public function getList(): bool
        {
            return $this->get('list') === 't';
        }

        public function setList(bool $global): self
        {
            return $this->set('list', $global ? 't' : 'f');
        }

        /* Width */

        public function getWidth(): int
        {
            return $this->get('width');
        }

        public function setWidth(int $width): self
        {
            return $this->set('width', $width);
        }

        /* Array */

        public function toArray(): array
        {
            return [
                'id'         => $this->getId(),
                'name'       => $this->getName(),
                'collection' => $this->getCollectionId(),
                'type'       => $this->getTypeId(),
                'section'    => $this->getSectionId(),
                'order'      => $this->getOrder(),
                'width'      => $this->getWidth(),
                'list'       => $this->getList(),
                'name'       => $this->getName(),
                'settings'   => $this->jsonGet(null)
            ];
        }
    };