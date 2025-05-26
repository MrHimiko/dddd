<?php

    return function(Addon $addon, int|string $id): ?\collections\entity\collection
    {
        if(is_string($id))
        {
            return collections::fetch_collection()->share($id)->site_id(site()->getId())->removed(false)->setLimit(1)->run();
        }

        return collections::fetch_collection()->id($id)->site_id(site()->getId())->removed(false)->setLimit(1)->run();
    };