<?php

    return function(Addon $addon, int $id): ?\collections\entity\tab_section
    {
        return collections::fetch_tab_section()
            ->id($id)
            ->join('INNER', 'collections.collection')
            ->collection_site_id(site()->getId())
            ->setLimit(1)
            ->run();
    };