<?php

    return function(Addon $addon, int $collection_id, ?string $search = null): array
    {
        $items =  collections::fetch_item()->collection_id($collection_id)->setOrder('item_order ASC, item_id DESC');

        if($search)
        {
            $items->search($search);
        }

        return $items->run();
    };