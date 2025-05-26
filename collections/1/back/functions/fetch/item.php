<?php

    return function(Addon $addon, string|int $id, ?int $collection = null): ?\collections\entity\item
    {
        $fetch = collections::fetch_item()->join('INNER', 'collections.collection')->collection_site_id(site()->getId())->setLimit(1);

        if(is_integer(($id)))
        {
            $fetch->id($id);
        }
        else
        {
            $fetch->slug($id);
        }

        if($collection)
        {
            $fetch->collection_id($collection);
        }

        return $fetch->run();
    };