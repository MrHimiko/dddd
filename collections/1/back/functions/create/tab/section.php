<?php

    use collections\entity\tab_section;

    return function(Addon $addon, int $collection, string $name, int $tab): ?tab_section
    {
        $section = collections::entity_tab_section();

        $section->setCollectionId($collection);
        $section->setTabId($tab);
        $section->setName($name);
        $section->setOrder((int) microtime(true));

        if(!$section->create())
        {
            return null;
        }

        return $section;
    };