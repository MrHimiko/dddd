<?php

    use collections\entity\collection;

    return function(Addon $addon, string $name, ?int $client = null): ?collection
    {
        $collection = collections::entity_collection();
 
        $collection->setSiteId(site()->getId());
        $collection->setName($name);
        $collection->setOrder(1);
        $collection->setItems(0);
        $collection->setClientId($client);

        if(!$collection->create())
        {
            return null;
        }

        return $collection;
    };
