<?php

    dh::triggerCatch('delete.admin.advanced.language', function(object $data)
    {
        return new class($data)
        {
            private AddonResponse $response;
            private object $language;
            private object $site;

            public function __construct(object $data)
            {
                $this->response = $data->response;
                $this->language = $data->language;
                $this->site = $data->site;

                if(!$this->removeTranslations($this->getTranslations()))
                {
                    $this->response->success(false);
                }
            }

            private function getTranslations(): array
            {
                $translations = qb::select(['*' => true], 'pool')
                    ->from('collection_items_translation as translations')
                    ->join('INNER JOIN collection_items as items ON items.item_id = translations.translation_item_id')
                    ->where('item_site_id')->is('equal', $this->site->getId())
                    ->and('translation_code')->is('equal', $this->language->slug)
                    ->key('translation_id')
                    ->run();

                if(!$translations->success)
                {
                    return [];
                }

                return array_keys($translations->data);
            }

            private function removeTranslations(array $translations): bool
            {
                if(!count($translations))
                {
                    return true;
                }

                $translations = qb::delete('collection_items_translation', 'pool')
                    ->where('translation_id')->is('in', implode(',', $translations))
                    ->and('translation_code')->is('equal', $this->language->slug)
                    ->run();

                return !!$translations->success;
            }
        };
    });