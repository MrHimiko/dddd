<?php

    return function(Addon $addon, object $import)
    {
        return new Class($import)
        {
            private object $import;
            private array $existing;

            public function __construct(object $import)
            {
                if($import->include !== '*' && $import->include !== 'collections')
                {
                    return;
                }

                $import->callbacks[1][] = function(object $import)
                {
                    $collections = $import->data->{'collections'} ?? null;

                    if($collections === null)
                    {
                        return;
                    }

                    $this->import = $import;

                    if(!$import->partial)
                    {
                        $this->remove();
                    }

                    $collections = $this->createCollections($collections);

                    $import->created->collections = $collections;

                    if($tabs = $import->data->{'collections.tabs'} ?? null)
                    {
                        $tabs = $this->createTabs($collections, $tabs);

                        if($sections = $import->data->{'collections.tab_sections'} ?? null)
                        {
                            $sections = $this->createTabSections($collections, $tabs, $sections);

                            if($fields = $import->data->{'collections.fields'} ?? null)
                            {
                                $fields = $this->createFields($collections, $sections, $fields);
                            }
                        }
                    }

                    if(!isset($fields))
                    {
                        $fields = [];
                    }

                    // $this->recache($import, $collections, $fields);

                    if($items = $import->data->{'collections.items'} ?? null)
                    {
                        $items = $this->createItems($collections, $items, $fields);
                    }
                };

                $import->callbacks[5][] = function(object $import)
                {
                    $collections = $import->created->collections;
                    $pages = $import->created->{'builder.pages'} ?? [];

                    /* Pages */
                    foreach($pages as $page)
                    {
                        if(!$source = $page->getSource())
                        {
                            continue;
                        }

                        foreach($collections as $id => $collection)
                        {
                            if($source === 'collection.' . $id)
                            {
                                if(!$page->setSource('collection.' . $collection->getId())->update())
                                {
                                    throw new Exception('Failed to update source on page.');
                                }
                            }
                        }
                    }
                };
            }

            private function remove()
            {
                if(!qb::delete('collections', 'pool')->where('collection_site_id')->is('equal', $this->import->site)->run())
                {
                    throw new Exception('Failed to remove collections.');
                }
            }

            private function createCollections(array $collections)
            {
                $created = [];
                $entities = [];

                foreach($collections as $index => $collection)
                {
                    $entity = collections::entity_collection();

                    $entity->setSiteId($this->import->site);
                    $entity->setName($collection->name);
                    $entity->setDescription($collection->description);
                    $entity->setOrder($collection->order);

                    $entities[$index] = $entity;
                }

                if(!collections::addon()->EntitiesCreate($entities))
                {
                    throw new Exception('Failed to create collections.');
                }

                foreach($collections as $index => $collection)
                {
                    $created[$collection->id] = $entities[$index];
                }

                return $this->import->created->{'collections'} = $created;
            }

            private function createTabs(array $collections, array $tabs)
            {
                $created = [];
                $entities = [];

                foreach($tabs as $index => $tab)
                {
                    $entity = collections::entity_tab();

                    $entity->setCollectionId($collections[$tab->collection]->getId());
                    $entity->setName($tab->name);

                    $entities[$index] = $entity;
                }

                if(!collections::addon()->EntitiesCreate($entities))
                {
                    throw new Exception('Failed to create collection tabs.');
                }

                foreach($tabs as $index => $tab)
                {
                    $created[$tab->id] = $entities[$index];
                }

                return $this->import->created->{'collections.tabs'} = $created;
            }

            private function createTabSections(array $collections, array $tabs, array $sections)
            {
                $created = [];
                $entities = [];

                foreach($sections as $index => $section)
                {
                    $entity = collections::entity_tab_section();

                    $entity->setCollectionId($collections[$section->collection]->getId());
                    $entity->setTabId($tabs[$section->tab]->getId());
                    $entity->setName($section->name);
                    $entity->setOrder($section->order);

                    $entities[$index] = $entity;
                }

                if(!collections::addon()->EntitiesCreate($entities))
                {
                    throw new Exception('Failed to create collection tab section.');
                }

                foreach($sections as $index => $section)
                {
                    $created[$section->id] = $entities[$index];
                }

                return $this->import->created->{'collections.tab_sections'} = $created;
            }

            private function createFields(array $collections, array $sections, array $fields)
            {
                $created = [];
                $entities = [];

                foreach($fields as $index => $field)
                {
                    $entity = collections::entity_field();

                    $entity->setCollectionId($collections[$field->collection]->getId());
                    $entity->setSectionId($sections[$field->section]->getId());
                    $entity->setTypeId($field->type);
                    $entity->setName($field->name);
                    $entity->setOrder($field->order);
                    $entity->setList($field->list);
                    $entity->setWidth($field->width);
                    $entity->jsonSet('field', true);

                    if(property_exists($field->settings, 'collection'))
                    {
                        $field->settings->collection = $collections[$field->settings->collection]?->getId();
                    }

                    foreach($field->settings as $key => $value)
                    {
                        $entity->jsonSet($key, $value);
                    }

                    $entities[$index] = $entity;
                }

                if(!collections::addon()->EntitiesCreate($entities))
                {
                    throw new Exception('Failed to create collection fields.');
                }

                foreach($fields as $index => $field)
                {
                    $created[$field->id] = $entities[$index];
                }

                return $this->import->created->{'collections.fields'} = $created;
            }

            private function createItems(array $collections, array $items, array $fields)
            {
                $created = [];
                $entities = [];

                foreach($items as $index => $item)
                {
                    $entity = collections::entity_item();

                    $entity->setSiteId($this->import->site);
                    $entity->setCollectionId($collections[$item->collection]->getId());
                    $entity->setOrder($item->order);
                    
                    foreach($item->name as $name)
                    {
                        $entity->setName($name ? $name : 'Unknown');
                        break;
                    }

                    foreach($item->slug as $slug)
                    {
                        $entity->setSlug($slug ? $slug : 'unknown');
                        break;
                    }

                    foreach($item->published as $published)
                    {
                        $entity->setPublished(!!$published);
                        break;
                    }

                    foreach($item->fields as $itemFields)
                    {
                        $entity->setFields($itemFields ? $itemFields : new StdClass);
                        break;
                    }

                    foreach($item->seo as $seo)
                    {
                        $entity->setSEO($seo ? $seo : new StdClass);
                        break;
                    }

                    $entities[$index] = $entity;
                }

                if(!collections::addon()->EntitiesCreate($entities))
                {
                    throw new Exception('Failed to create collection items.');
                }

                foreach($items as $index => $item)
                {
                    $created[$item->id] = $entities[$index];
                }

                /* Relations */
                foreach($entities as $item)
                {
                    $json = $item->getFields();
                    $changed = false;

                    foreach($fields as $field)
                    {
                        if($field->getTypeId() !== 9)
                        {
                            continue;
                        }

                        if(!$ids = $json->{$field->getName()} ?? null)
                        {
                            continue;
                        }

                        $newIds = [];
                        $ids = ltrim($ids, '{');
                        $ids = rtrim($ids, '}');
                        $ids = explode(',', $ids);

                        foreach($ids as $id)
                        {
                            if(array_key_exists($id, $created))
                            {
                                $changed = true;
                                $newIds[] = $created[$id]->getId();
                            }
                        }

                        $json->{$field->getName()} = '{' . implode(',', $newIds) . '}';
                    }

                    if($changed)
                    {
                        if(!$item->setFields($json)->update())
                        {
                            throw new Exception('Failed to update item relations.');
                        }
                    }
                }

                return $this->import->created->{'collections.items'} = $created;
            }

            private function recache(object &$import, array $collections, array $fields)
            {
                $install = null;

                foreach(($import->created->{'cms.addons'} ?? []) as $entity)
                {
                    if($entity->getAddonId() === 10)
                    {
                        $install = $entity;
                        break;
                    }
                }
                
                if(!$install)
                {
                    return;
                }

                $json = $install->jsonGet('collections', new StdClass);
                $newJson = new StdClass;

                foreach($json as $id => &$object)
                {
                    $newCollection = $collections[$id] ?? null;

                    if(!$newCollection)
                    {
                        continue;
                    }

                    $object->id = $newCollection->getId();

                    foreach($object->fields as $index => &$field)
                    {
                        $newField = $fields[$field->id] ?? null;

                        if(!$newField)
                        {
                            unset($object->fields->{$field->id});
                            continue;
                        }

                        $field->id = $newField->getId();

                        /* Relation */
                        if($field->type === 'Relation')
                        {
                            $relationCollection = $collections[$field->settings->collection ?? null] ?? null;
                            $field->settings->collection = $relationCollection?->getId();
                        }
                    }

                    $newJson->{$object->id} = $object;
                }

                if(!$install->jsonSet('collections', $newJson)->update())
                {
                    throw Exception('Failed to re-cache collections.');
                }
            }
        };
    };