<?php

    namespace collections\entity;

    class item extends \AddonEntity
    {
        protected string $database = 'pool';
        protected string $prefix = 'item_';
        protected string $table = 'collection_items';
        protected array $select = [
            'id', 'collection_id', 'parent_id', 'client_id', 'site_id', 'order', 'updated', 'created',
            ':name', ':slug', ':fields', ':seo', ':published', 'schedule_from', 'schedule_to'
        ];

        /* Name */

        public function getName(): string
        {
            return $this->get('name', 'Invalid name');
        }

        public function setName(string $name): self
        {
            return $this->set('name', $name);
        }

        /* Slug */

        public function getSlug(): ?string
        {
            return $this->get('slug');
        }

        public function setSlug(string $slug): self
        {
            return $this->set('slug', $slug);
        }

        /* Collection */

        public function getCollection(bool $lazy = false): \collections\entity\collection
        {
            return $this->entity('collections.collection', $lazy);
        }

        public function getCollectionId(): int
        {
            return $this->get('collection_id');
        }
 
        public function setCollectionId(int $id): self
        {
            return $this->set('collection_id', $id);
        }

        /* Site */

        public function getSiteId(): ?int
        {
            return $this->get('site_id');
        }

        public function setSiteId(int $id): self
        {
            return $this->set('site_id', $id);
        }

        /* Parent */

        public function getParentId(): ?int
        {
            return $this->get('parent_id');
        }

        public function setParentId(?int $id): self
        {
            return $this->set('parent_id', $id);
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

        /* Fields */

        public function getFields(): object
        {
            $fields = json_decode($this->get('fields', ''));

            return is_object($fields) ? $fields : new \StdClass;
        }
 
        public function setFields(object $fields): self
        {
            return $this->set('fields', json_encode($fields));
        }

        /* SEO */

        public function getSEO(): object
        {
            $seo = json_decode($this->get('seo', ''));
            $seo = is_object($seo) ? $seo : new \StdClass;

            if(!property_exists($seo, 'title'))
            {
                $seo->title = null;
            }

            if(!property_exists($seo, 'description'))
            {
                $seo->description = null;
            }

            if(!property_exists($seo, 'cover'))
            {
                $seo->cover = null;
            }

            return $seo;
        }
 
        public function setSEO(object $seo): self
        {
            return $this->set('seo', json_encode($seo));
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

        /* Published */

        public function getPublished(): bool
        {
            $published = $this->get('published') === 't';

            if(!$this->get('translation_id') && $published)
            {
                return false;
            }

            return $published;
        }

        public function setPublished(bool $published): self
        {
            return $this->set('published', $published ? 't' : 'f');
        }

        /* Updated */

        public function getUpdated(): string
        {
            return $this->get('updated');
        }

        public function setUpdated(string $date): self
        {
            return $this->set('updated', $date);
        }

        /* Created */

        public function getCreated(): string
        {
            return $this->get('created');
        }

        public function setCreated(string $date): self
        {
            return $this->set('created', $date);
        }

        /* Schedule */

        public function getScheduleFrom(): ?string
        {
            $schedule = $this->get('schedule_from');

            if($schedule)
            {
                return date('Y-m-d H:i', $schedule);
            }

            return null;
        }

        public function getScheduleTo(): ?string
        {
            $schedule = $this->get('schedule_to');

            if($schedule)
            {
                return date('Y-m-d H:i', $schedule);
            }

            return null;
        }

        public function setScheduleFrom(?int $time): self
        {
            return $this->set('schedule_from', $time);
        }

        public function setScheduleTo(?int $time): self
        {
            return $this->set('schedule_to', $time);
        }

        /* Array */

        public function toArray(): array
        {
            return [
                'id'          => $this->getId(),
                'collection'  => $this->getCollectionId(),
                'site'        => $this->getSiteId(),
                'parent'      => $this->getParentId(),
                'client'      => $this->getClientId(),
                'name'        => $this->getName(),
                'slug'        => $this->getSlug(),
                'order'       => $this->getOrder(),
                'fields'      => $this->getFields(),
                'seo'         => $this->getSEO(),
                'schedule'    => ['from' => $this->getScheduleFrom(), 'to' => $this->getScheduleTo()],
                'published'   => $this->getPublished(),
                'updated'     => $this->getUpdated(),
                'created'     => $this->getCreated(),
            ];
        }
    };