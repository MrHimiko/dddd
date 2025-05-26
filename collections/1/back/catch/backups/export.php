<?php

    mdEvents::fn_catch('dh.backups.export', function(object $export)
    {
        return new Class($export)
        {
            private object $export;

            public function __construct(object $export)
            {
                $this->export = $export;

                if($export->include === '*' || $export->include === 'collections')
                {
                    $ids = $this->collections();

                    $this->tabs($ids);
                    $this->tab_sections($ids);
                    $this->fields($ids);
                    $this->items($ids);
                }
            }

            private function collections()
            {
                $ids = [];
                $collections = collections::fetch_collection()->site_id($this->export->site->id)->removed(false)->run();

                foreach($collections as $index => &$collection)
                {
                    if($this->export->filter)
                    {
                        if(!\utils::fn_regex_check($this->export->filter, $collection->getName()))
                        {
                            unset($collections[$index]);
                            continue;
                        }
                    }

                    $collection = $collection->toArray();

                    $ids[] = $collection['id'];

                    unset($collection['count']);
                    unset($collection['global']);
                    unset($collection['share']);
                    unset($collection['site']);
                    unset($collection['variable']->items);
                }
        
                $this->export->{'collections'} = $collections;
                $this->export->count->{'collections'} = count($collections);

                return $ids;
            }
        
            private function tabs($ids)
            {
                if(!count($ids))
                {
                    $this->export->{'collections.tabs'} = [];
                    $this->export->count->{'collections.tabs'} = 0;

                    return;
                }

                $tabs = collections::fetch_tab()->collection_ids($ids)->run();

                foreach($tabs as &$tab)
                {
                    $tab = $tab->toArray();
                }

                $this->export->{'collections.tabs'} = $tabs;
                $this->export->count->{'collections.tabs'} = count($tabs);
            }

            private function tab_sections($ids)
            {
                if(!count($ids))
                {
                    $this->export->{'collections.tab_sections'} = [];
                    $this->export->count->{'collections.tab_sections'} = 0;

                    return;
                }

                $sections = collections::fetch_tab_section()->collection_ids($ids)->run();

                foreach($sections as &$section)
                {
                    $section = $section->toArray();
                }

                $this->export->{'collections.tab_sections'} = $sections;
                $this->export->count->{'collections.tab_sections'} = count($sections);
            }

            private function fields($ids)
            {
                if(!count($ids))
                {
                    $this->export->{'collections.fields'} = [];
                    $this->export->count->{'collections.fields'} = 0;

                    return;
                }

                $fields = collections::fetch_field()->collection_ids($ids)->run();

                foreach($fields as &$field)
                {
                    $field = $field->toArray();
                }

                $this->export->{'collections.fields'} = $fields;
                $this->export->count->{'collections.fields'} = count($fields);
            }

            private function items($ids)
            {
                if(!count($ids))
                {
                    $this->export->{'collections.items'} = [];
                    $this->export->count->{'collections.items'} = 0;

                    return;
                }

                $items = collections::fetch_item()->collection_ids($ids)->setKey('id')->setLanguage(site()->getLanguage())->run();

                foreach($items as &$item)
                {
                    if($this->export->filter)
                    {
                        if(!\utils::fn_regex_check($this->export->filter, $item['name']))
                        {
                            continue;
                        }
                    }

                    $item = $item->toArray();

                    $item['name']      = [site()->getLanguage() => $item['name']];
                    $item['slug']      = [site()->getLanguage() => $item['slug']];
                    $item['fields']    = [site()->getLanguage() => $item['fields']];
                    $item['seo']       = [site()->getLanguage() => $item['seo']];
                    $item['published'] = [site()->getLanguage() => $item['published']];

                    unset($item['site']);
                    unset($item['updated']);
                    unset($item['created']);
                }

                foreach(site()->getLanguages() as $name => $language)
                {
                    if($name === site()->getLanguage())
                    {
                        continue;
                    }   

                    $locales = collections::fetch_item()->collection_ids($ids)->setLanguage($name)->run();

                    foreach($locales as $locale)
                    {
                        if($this->export->filter)
                        {
                            if(!\utils::fn_regex_check($this->export->filter, $locale->getName()))
                            {
                                continue;
                            }
                        }
                        
                        $items[$locale->getId()]['name'][$name]      = $locale->getName();
                        $items[$locale->getId()]['slug'][$name]      = $locale->getSlug();
                        $items[$locale->getId()]['fields'][$name]    = $locale->getFields();
                        $items[$locale->getId()]['seo'][$name]       = $locale->getSEO();
                        $items[$locale->getId()]['published'][$name] = $locale->getPublished();
                    }
                }

                $this->export->{'collections.items'} = array_values($items);
                $this->export->count->{'collections.items'} = count($items);
            }
        };
    });