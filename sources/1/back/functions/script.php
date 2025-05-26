<?php

    return function(Addon $addon): string
    {
        $items = $addon->ItemsRaw();
        $items = json_encode($items);
        $items = ltrim($items, '[');
        $items = rtrim($items, ']');

        // $html = '<script id="mdSources" type="application/javascript">';
        // $html .= 'mdSources.ItemsAdd('.$items.'); $("#mdSources").remove();';
        // $html .= '</script>';

        return 'mdSources.ItemsAdd('.$items.');';
        // return $html;
    };