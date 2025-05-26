<?php

    return function(Addon $addon, array $filters): array
    {
        foreach($filters as $index => $filter)
        {         
            if(!is_object($filter))
            {
                unset($filters[$index]);
                continue;
            }

            if(
                !isset($filter->field)    ||
                !isset($filter->operator) ||
                !isset($filter->value)
            )
            {
                unset($filters[$index]);
                continue;
            }

            if(!is_scalar($filter->field))
            {
                unset($filters[$index]);
                continue;
            }

            if(!is_scalar($filter->operator))
            {
                unset($filters[$index]);
                continue;
            }

            if(!is_scalar($filter->value))
            {
                unset($filters[$index]);
            }
        }

        return $filters;
    };