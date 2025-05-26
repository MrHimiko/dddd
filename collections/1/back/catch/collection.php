<?php

    collections::addon()->OnEntityCreate('collection', function(Addon $addon, AddonEntity $entity)
    {
        collections::fn_object_set($entity);
    });

    collections::addon()->OnEntityUpdate('collection', function(Addon $addon, AddonEntity $entity)
    {
        collections::fn_object_set($entity);
    });

    collections::addon()->OnEntityDelete('collection', function(Addon $addon, AddonEntity $entity)
    {
        collections::fn_object_clear($entity);
    });