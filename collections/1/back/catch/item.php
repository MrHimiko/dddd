<?php

    collections::addon()->OnEntityCreate('item', function(Addon $addon, AddonEntity $entity)
    {
        $collection = $entity->getCollection(true);

        /* Count Number of Items */
        $count = $addon->Fetch('item')->collection_id($collection->getId())->parent_id_null(true)->doCount();

        /* Save Into Collection */
        $collection->setItems($count)->update(false);
    });

    collections::addon()->OnEntityDelete('item', function(Addon $addon, AddonEntity $entity)
    {
        $collection = $entity->getCollection(true);

        /* Count Number of Items */
        $count = $addon->Fetch('item')->collection_id($collection->getId())->parent_id_null(true)->doCount();

        /* Save Into Collection */
        $collection->setItems($count)->update(false);
    });