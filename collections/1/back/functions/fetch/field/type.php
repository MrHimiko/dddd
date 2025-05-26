<?php

    return function(Addon $addon, int $id): ?\collections\entity\field_type
    {
        return collections::fetch_field_type()->id($id)->setLimit(1)->run();
    };