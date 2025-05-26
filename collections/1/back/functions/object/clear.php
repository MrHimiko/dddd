<?php

    use collections\entity\collection;

    return function(Addon $addon, int|collection $collection): bool
    {
        $id = is_integer($collection) ? $collection : $collection->getId();

        $install = install('collections');
        $collections = $install->jsonGet('collections', new StdClass);

        if(!property_exists($collections, $id))
        {
            return true;
        }

        unset($collections->{$id});

        return $install->jsonSet('collections', $collections)->update(false);
    };