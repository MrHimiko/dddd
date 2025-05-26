<?php

    return function(Addon $addon, int $id, ?int $collection_id = null): ?\collections\entity\field
    {
        if(!$collection_id)
        {
            return collections::fetch_field()
                ->id($id)
                ->join('INNER', 'collections.collection')
                ->collection_site_id(site()->getId())
                ->setLimit(1)
                ->run();
        }

        return collections::fetch_field()->id($id)->collection_id($collection_id)->setLimit(1)->run();
    };