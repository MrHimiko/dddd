<?php

    return function(Addon $addon, int|array $collection_id): array
    {
        if(!is_array($collection_id))
        {
            return collections::fetch_field()->collection_id($collection_id)->join('INNER', 'collections.field_type')->run();
        }

        if(!count($collection_id)) 
        { 
            return []; 
        }

        return collections::fetch_field()->collection_ids($collection_id)->join('INNER', 'collections.field_type')->run();
    };