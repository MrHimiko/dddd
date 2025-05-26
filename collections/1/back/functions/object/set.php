<?php

    use collections\entity\collection;

    return function(Addon $addon, int|collection $collection): bool
    {
        if(!$object = collections::fn_object_get($collection))
        {
            return false;
        }

        $install = install('collections');
        $collections = $install->jsonGet('collections', new StdClass);

        $collections->{$object->id} = $object;

        return $install->jsonSet('collections', $collections)->update(false);
    };