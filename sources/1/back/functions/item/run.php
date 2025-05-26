<?php

    return new Class()
    {
        public function init(Addon $addon, AddonItem $item, array $properties, array $filters, string $sort): mixed
        {
            $properties = $this->properties($properties, $item->Get('properties'));
            $filters = $this->filters($filters, $item->Get('fields'), $item->Get('operators'));
            $sort = $this->sort($sort, $item->Get('sort'));

            return $item->Get('callback')($properties, $filters, $sort);
        }

        private function properties(array $passed_properties, array $item_properties): array
        {
            $validated = [];

            $item_properties['limit']  = ['type' => 'input', 'value' => 20];
            $item_properties['page']   = ['type' => 'input', 'value' => 1];
            $item_properties['offset'] = ['type' => 'input', 'value' => 0];
            $item_properties['search'] = ['type' => 'input', 'value' => ''];

            foreach($item_properties as $key => $property)
            {
                if(!isset($passed_properties[$key]))
                {
                    $validated[$key] = $property['value'];
                    continue;
                }

                $value = $passed_properties[$key];
                $value_type = gettype($value);
                $property_type = gettype($property['value']);


                if($value_type === $property_type)
                {
                    $validated[$key] = $value;
                }
                else if($property_type === 'integer' && is_numeric($value))
                {
                    $validated[$key] = (int) $value;
                }
                else if($property_type === 'string' && is_numeric($value))
                {
                    $validated[$key] = $value . '';
                }
                else
                {
                    $validated[$key] = $property['value'];
                }
            }

            return $validated;
        }

        private function sort(string $passed_sort, array $item_sort): string
        {
            foreach($item_sort as $key => $sort)
            {
                if($key === $passed_sort)
                {
                    return $key;
                }
            }

            return '';
        }

        private function filters(array $passed_filters, array $fields, array $operators): array
        {
            foreach($passed_filters as $index => $filter)
            {
                if(!is_object($filter))
                {
                    unset($passed_filters[$index]);
                    continue;
                }

                if(
                    !isset($filter->field)     ||
                    !isset($filter->operator) ||
                    !isset($filter->value)
                )
                {
                    unset($passed_filters[$index]);
                    continue;
                }

                if(!isset($fields[$filter->field]) || !is_object($fields[$filter->field]))
                {
                    unset($passed_filters[$index]);
                    continue;
                }

                if(!isset($operators[$filter->operator]))
                {
                    unset($passed_filters[$index]);
                    continue;
                }

                if(!is_scalar($filter->value))
                {
                    unset($passed_filters[$index]);
                    continue;
                }

                $filter->field = $fields[$filter->field];
            }

            return $passed_filters;
        }
    };