<?php

    return function(Addon $addon): array
    {
        return collections::fetch_field_type()->run();
    };