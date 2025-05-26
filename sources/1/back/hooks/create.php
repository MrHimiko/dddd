<?php

    return new class()
    {
        public function init(Addon $addon): void
        {
            $this->fields($addon);
        }

        private function fields(Addon $addon)
        {
            $addon->FieldAdd('title');
            $addon->FieldAdd('folder');
            $addon->FieldAdd('description');

            $addon->FieldAdd('sitemap', null, function($value)
            {
                return is_callable($value)  ? $value : function() {};
            });

            $addon->FieldAdd('properties', null, function($value)
            {
                return is_array($value) ? $value : [];
            });

            $addon->FieldAdd('fields', null, function($value)
            {
                return is_array($value) ? $value : [];
            });

            $addon->FieldAdd('operators', null, function($value)
            {
                return is_array($value) ? $value : [];
            });

            $addon->FieldAdd('sort', null, function($value)
            {
                return is_array($value) ? $value : [];
            });

            $addon->FieldAdd('callback', null, function($value, $item)
            {
                if(!is_callable($value))
                {
                    $value = function()
                    {
                        return [];
                    };
                }

                return $value;
            });
        }
    };

    function source(string $id, array $properties, array $filters, string $sort): array
    {
        if(!$item = mdSources::addon()->ItemGet($id))
        {
            return [];
        }

        $data = $item->Fn('run', $properties, $filters, $sort);
    
        return is_array($data) ? $data : [$data];
    }