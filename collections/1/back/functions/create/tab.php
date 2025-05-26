<?php

    use collections\entity\tab;

    return function(Addon $addon, int $collection, string $name): ?tab
    {
        $tab = collections::entity_tab();

        $tab->setCollectionId($collection);
        $tab->setName($name);
       
        if(!$tab->create())
        {
            return null;
        }

        return $tab;
    };