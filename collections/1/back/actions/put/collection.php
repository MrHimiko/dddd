<?php

    use collections\entity\collection;

    return new Class()
    {
        public array $permission = [];
        public array $in = [
            'id'          => ['type' => 'integer', 'optional' => false],
            'name'        => ['type' => 'string', 'optional' => true],
            'description' => ['type' => 'string', 'optional' => true],
            'share'       => ['type' => 'string', 'optional' => true],
            'variable'    => ['type' => 'object', 'optional' => true],
            'global'      => ['type' => 'object', 'optional' => true],
            'nest'        => ['type' => 'boolean', 'optional' => true],
            'split'       => ['type' => 'string', 'optional' => true],
            'client'      => ['type' => 'integer', 'optional' => true],
            'storage'     => ['type' => 'object', 'optional' => true],
        ];

        public array $out = [
            'collection' => ['type' => 'object', 'optional' => false],
        ];

        public function init(Addon $addon, AddonResponse $response, array $data): AddonResponse
        {
            /* Collection */
            if(!$collection = collections::fn_fetch_collection($data['id']))
            {
                return $response->message("Collection with ID :1 doesn't exist.", $data['id']);
            }

            if(
                !$this->name($collection, $response, $data['name'])               ||
                !$this->description($collection, $response, $data['description']) ||
                !$this->share($collection, $response, $data['share'])             ||
                !$this->variable($collection, $response, $data['variable'])       ||
                !$this->global($collection, $response, $data['global'])           ||
                !$this->nest($collection, $response, $data['nest'])               ||
                !$this->split($collection, $response, $data['split'])             ||
                !$this->client($collection, $response, $data['client'])           ||
                !$this->storage($collection, $response, $data['storage'])      
            )
            {
                return $response;
            }

            if(!$collection->update())
            {
                return $response->message('Failed to update collection :1', $collection->getName());
            }

            $response->success(true);
            $response->message('Collection ":1" successfully updated.', $collection->getName());

            $response->out('collection', (object) $collection->toArray());

            return $response;
        }

        private function name(collection $collection, AddonResponse $response, ?string $name): bool
        {
            if($name !== null)
            {
                if($error = collections::fn_validate_name($name))
                {
                    $response->message($error);
                    return false;
                }

                $collection->setName($name);
            }

            return true;
        }

        private function description(collection $collection, AddonResponse $response, ?string $description): bool
        {
            if($description !== null)
            {
                if($error = collections::fn_validate_description($description))
                {
                    $response->message($error);
                    return false;
                }

                $collection->setDescription($description);
            }

            return true;
        }

        private function share(collection $collection, AddonResponse $response, ?string $share): bool
        {
            if($share !== null)
            {
                $share = utils::fn_validate_slug($share);

                if($error = collections::fn_validate_share($share))
                {
                    $response->message($error);
                    return false;
                }

                $collection->setShare($share);
            }

            return true;
        }

        private function variable(collection $collection, AddonResponse $response, ?object $variable): bool
        {
            if($variable !== null)
            {
                if(
                    !property_exists($variable, 'enabled') ||
                    !property_exists($variable, 'format')  ||
                    !is_bool($variable->enabled)           ||
                    !is_string($variable->format)          ||
                    !in_array($variable->format, ['array', 'object-id', 'object-slug'])
                )
                {
                    $response->message('Invalid data sent for property "variable"');
                    return false;
                }

                $collection->setVariable($variable->enabled, $variable->format);
            }

            return true;
        }

        private function global(collection $collection, AddonResponse $response, ?object $global): bool
        {
            if($global !== null)
            {
                if(
                    !property_exists($global, 'enabled')  ||
                    !property_exists($global, 'password') ||
                    !is_bool($global->enabled)            ||
                    !(!is_string($global->password) || !is_null($global->password))    
                )
                {
                    $response->message('Invalid data sent for property "global"');
                    return false;
                }

                $collection->setGlobal($global->enabled, $global->password);
            }

            return true;
        }

        private function nest(collection $collection, AddonResponse $response, ?bool $nest): bool
        {
            if($nest !== null)
            {
                $collection->setNest($nest);
            }

            return true;
        }

        private function split(collection $collection, AddonResponse $response, ?string $split): bool
        {
            if($split !== null)
            {
                $collection->setSplit($split);
            }

            return true;
        }

        private function client(collection $collection, AddonResponse $response, ?int $client): bool
        {
            if($client === null)
            {
                return true;
            }
            
            if($client && $collection->getClientId())
            {
                $response->message('Ownership of this collection was already claimed.');
                return false;
            }

            if(!$client && $collection->getClientId() !== client()->getId())
            {
                $response->message('Only the owner of this collection can unclaim ownership.');
                return false;
            }

            $collection->setClientId($client ? client()->getId() : null);
            return true;
        }

        private function storage(collection $collection, AddonResponse $response, ?object $storage): bool
        {
            if($storage !== null)
            {
                if(!property_exists($storage, 'key'))
                {
                    $response->message('Invalid data sent for property "storage"');
                    return false;
                }

                $collection->setStorage(is_string($storage->key) ? $storage->key : null);
            }

            return true;
        }
    };


   