<?php

    use collections\entity\field;

    return function(Addon $addon, int $collection, string $name, int $type, int $section): ?field
    {
        $field = collections::entity_field();

        $field->setCollectionId($collection);
        $field->setName($name);
        $field->setTypeId($type);
        $field->setSectionId($section);
        $field->setWidth(12);
        $field->setOrder((int) microtime(true));

        if(!$field->create())
        {
            return null;    
        }

        return $field;
    };