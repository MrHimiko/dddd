<?php

    collections::addon()->OnEntityCreate('field', function(Addon $addon, AddonEntity $entity)
    {
        collections::fn_object_set($entity->getCollectionId());
    });

    collections::addon()->OnEntityUpdate('field', function(Addon $addon, AddonEntity $entity)
    {
        collections::fn_object_set($entity->getCollectionId());
    });

    collections::addon()->OnEntityDelete('field', function(Addon $addon, AddonEntity $entity)
    {
        collections::fn_object_set($entity->getCollectionId());
    });