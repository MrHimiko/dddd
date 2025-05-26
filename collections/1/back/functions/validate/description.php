<?php

    return function(Addon $addon, ?string $description): ?string
    {
        if(!$description)
        {
            return null;
        }

        if(strlen($description) > 500)
        {
            return 'Description can not exceed 500 characters';
        }

        if(strlen($description) < 1)
        {
            return 'Description must have at least 1 character';
        }

        return null;
    };