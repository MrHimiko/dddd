<?php

    return function(Addon $addon, string $name): ?string
    {
        if(strlen($name) > 70)
        {
            return 'Name can not exceed 70 characters';
        }

        if(strlen($name) < 1)
        {
            return 'Name must have at least 1 character';
        }

        return null;
    };