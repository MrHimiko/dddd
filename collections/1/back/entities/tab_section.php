<?php

    namespace collections\entity;

    class tab_section extends \AddonEntity
    {
        protected string $database = 'pool';
        protected string $prefix = 'section_';
        protected string $table = 'collection_tab_sections';
        protected array $select = [
            'id', 'collection_id', 'tab_id', 'name', 'order',
        ];

        /* Order */

        public function getOrder(): int
        {
            return $this->get('order');
        }

        public function setOrder(int $order): self
        {
            return $this->set('order', $order);
        }

        /* Name */

        public function getName(): string
        {
            return $this->get('name');
        }

        public function setName(string $name): self
        {
            return $this->set('name', $name);
        }

        /* Tab */

        public function getTab(): \collections\entity\tab
        {
            return $this->entity('collections.tab');
        }

        public function getTabId(): int
        {
            return $this->get('tab_id');
        }

        public function setTabId(int $id): self
        {
            return $this->set('tab_id', $id);
        }

        /* Collection */

        public function getCollection(): \collections\entity\colection
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

        /* Array */

        public function toArray(): array
        {
            return [
                'id'         => $this->getId(),
                'order'      => $this->getOrder(),
                'name'       => $this->getName(),
                'tab'        => $this->getTabId(),
                'collection' => $this->getCollectionId(),
            ];
        }
    };