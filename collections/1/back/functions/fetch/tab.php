<?php

    return function(Addon $addon, int $id): ?\collections\entity\tab
    {
        return collections::fetch_tab()
            ->id($id)
            ->join('INNER', 'collections.collection')
            ->collection_site_id(site()->getId())
            ->setLimit(1)
            ->run();
    };