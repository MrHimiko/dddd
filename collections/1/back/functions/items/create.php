<?php

    use collections\entity\item;

    return new Class()
    {
        public function init(Addon $addon, int $collection, string $name, ?string $slug = null): ?item
        {
            if(!$slug = utils::fn_validate_slug($slug ? $slug : $name))
            {
                return null;
            }

            $slug = $this->slug($collection, $slug);

            $item = collections::entity_item();
                
            $item->setCollectionId($collection);
            $item->setName($name);
            $item->setSlug($slug);
            $item->setClientId(client()->getId());
            $item->setOrder(1);
            $item->setSiteId(site()->getId());
            $item->setFields(new StdClass);

            $dateTime = new DateTime();
            $formattedDate = $dateTime->format('Y-m-d H:i:s.uP');

            $item->setUpdated($formattedDate);
            $item->setCreated($formattedDate);

            if(!$item->create())
            {
                return null;
            }

            return $item;
        }

        private function slug(int $collection, string $slug, int $tries = 0): string 
        {
            $exist = collections::fetch_item()->collection_id($collection)->slug($slug . ($tries === 0 ? '' : ('-' . $tries)))->doCount();

            if(!$exist)
            {
                return $slug . ($tries === 0 ? '' : ('-' . $tries));
            }

            return $this->slug($collection, $slug, $tries + 1);
        }
    };

    