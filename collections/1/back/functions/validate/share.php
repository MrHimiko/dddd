<?php

    return function(Addon $addon, string $share): ?string
    {
        if(strlen($share) > 70)
        {
            return 'Share link can not exceed 70 characters';
        }

        return null;
    };