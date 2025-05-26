<?php

    return function(Addon $addon, int|array $collection_id): array
    {
        if(is_array($collection_id))
        {
            if(!count($collection_id)) { return []; }
            return collections::fetch_tab_section()->collection_ids($collection_id)->run();
        }

        return collections::fetch_tab_section()->collection_id($collection_id)->run();
    };