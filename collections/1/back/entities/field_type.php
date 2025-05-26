<?php

    namespace collections\entity;

    class field_type extends \AddonEntity
    {
        protected string $database = 'pool';
        protected string $prefix   = 'type_';
        protected string $table    = 'collection_field_types';
        protected array $select    = [
            'id', 'name', 'description', 'icon'
        ];

        /* Name */

        public function getName(): string
        {
            return $this->get('name');
        }

        /* Description */

        public function getDescription(): string
        {
            return $this->get('description');
        }

        /* Icon */

        public function getIcon(): ?object
        {
            return \sv_storage::fn_process_get($this->get('icon'));
        }

        /* Array */

        public function toArray(): array
        {
            return [
                'id'          => $this->getId(),
                'name'        => $this->getName(),
                'description' => $this->getDescription(),
                'icon'        => $this->getIcon(),
            ];
        }
    };