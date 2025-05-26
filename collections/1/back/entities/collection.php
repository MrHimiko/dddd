<?php

    namespace collections\entity;

    class collection extends \AddonEntity
    {
        protected string $database = 'pool';
        protected string $prefix = 'collection_';
        protected string $table = 'collections';
        protected array $select = [
            'id', 'description', 'site_id', 'client_id', 'order', 'name', 'items', 'removed',
            'json', 'global', 'config', 'share', 'variable', 'nest', 'split'
        ];

        /* Site */

        public function getSiteId(): int
        {
            return $this->get('site_id');
        }

        public function setSiteId(int $id): self
        {
            return $this->set('site_id', $id);
        }

        /* Client */

        public function getClientId(): ?int
        {
            return $this->get('client_id');
        }

        public function setClientId(?int $id): self
        {
            return $this->set('client_id', $id);
        }

        /* Items */

        public function getItems(): int
        {
            return $this->get('items');
        }

        public function setItems(int $items): self
        {
            return $this->set('items', $items);
        }

        public function countItems(): int
        {
            return \collections::fetch_item()->collection_id($this->getId())->doCount();
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

        /* Global */

        public function getGlobal(): object
        {
            return (object) [
                'enabled'  => $this->get('global') === 't',
                'password' => $this->jsonGet('global.password') ? true : false,
            ];
        }

        public function setGlobal(bool $global, ?string $password = null): self
        {
            $this->set('global', $global ? 't' : 'f');
            $this->jsonSet('global.password', $password ? password_hash($password, PASSWORD_DEFAULT) : null);

            return $this;
        }

        /* Variable */

        public function getVariable(): object
        {
            return (object) [
                'enabled' => $this->get('variable') === 't',
                'format'  => $this->jsonGet('variable.format', 'array'),
                'items'   => []
            ];
        }

        public function setVariable(bool $variable, string $format): self
        {
            if(!in_array($format, ['array', 'object-id', 'object-slug']))
            {
                $format = 'array';
            }

            $this->set('variable', $variable ? 't' : 'f');
            $this->jsonSet('variable.format', $variable ? $format : null);

            return $this;
        }

        /* Storage */

        public function getStorage(): object
        {
            return (object) [
                'key' => $this->jsonGet('storage.key')
            ];
        }

        public function setStorage(?string $key): self
        {
            $this->jsonSet('storage.key', $key ? (substr($key, 0, 300)) : null);

            return $this;
        }

        /* Nest */

        public function getNest(): bool
        {
            return $this->get('nest') === 't';
        }

        public function setNest(bool $global): self
        {
            return $this->set('nest', $global ? 't' : 'f');
        }

        /* Config */

        public function getSplit(): ?string
        {
            return $this->get('split');
        }

        public function setSplit(?string $split): self
        {
            if($split && !in_array($split, ['client']))
            {
                $split = null;
            }

            return $this->set('split', $split);
        }

        /* Config */

        public function getConfig(): ?string
        {
            return $this->get('config');
        }

        public function setConfig(?string $config): self
        {
            return $this->set('config', $config);
        }

        /* Share */

        public function getShare(): ?string
        {
            return $this->get('share');
        }

        public function setShare(?string $share): self
        {
            return $this->set('share', $share ? $share : null);
        }

        /* Name */

        public function getName(): string
        {
            return $this->get('name');
        }

        public function setName(string $name): self
        {
            $name = substr($name, 0, 70);

            return $this->set('name', $name);
        }

        /* Description */

        public function getDescription(): ?string
        {
            return $this->get('description');
        }

        public function setDescription(?string $description): self
        {
            return $this->set('description', $description);
        }

        /* Removed */

        public function getRemoved(): bool
        {
            return $this->get('removed') === 't';
        }

        public function setRemoved(bool $removed): self
        {
            return $this->set('removed', $removed ? 't' : 'f');
        }

        /* Array */

        public function toArray(): array
        {
            return [
                'id'          => $this->getId(),
                'site'        => $this->getSiteId(),
                'client'      => $this->getClientId(),
                'order'       => $this->getOrder(),
                'name'        => $this->getName(),
                'description' => $this->getDescription(),
                'global'      => $this->getGlobal(),
                'variable'    => $this->getVariable(),
                'nest'        => $this->getNest(),
                'split'       => $this->getSplit(),
                'config'      => $this->getConfig(),
                'storage'     => $this->getStorage(),
                'share'       => $this->getShare(),
                'count'       => $this->getItems()
            ];
        }
    };