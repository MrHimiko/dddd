<?php

    return function(Addon $addon, object $properties): object
    {
        $validated = new StdClass;

        foreach($properties as $key => $value)
        {
            if(!is_scalar($value))
            {
                continue;
            }

            if(!$key = utils::fn_regex_allow('a-z0-9.', str_replace(' ', '.', strtolower($key))))
            {
                continue;
            }

            $validated->{$key} = $value;
        }

        return $validated;
    };