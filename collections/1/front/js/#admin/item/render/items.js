collections.RenderCreate('item.items', function(addon, item, data, attributes)
{
    let share = addon.GetTemp('share');

    addon.SetTemp('selected', {});

    attributes['id'] = 'collection-items';

    this.init = () =>
    {
        if(data('fetch', false))
        {
            return this.fetch();
        }

        return this.table();
    };

    this.fetch = () =>
    {
        let fetch = {
            id: item.Get('id'),
            limit: data('limit', 100),
            page: data('page', 1),
            share: data('share', false),
            filters: data('filters', []),
            item: $dh.query('item')
        };

        if(data('search', ''))
        {
            fetch.search = data('search', '');
        }

        if(data('sort', ''))
        {
            fetch.sort = data('sort', '');
        }

        $.each(collections.items.ItemsGet(), (id, item) =>
        {
            item.Remove();
        });

        return collections.Fetch('items', fetch, (data) =>
        {
            $.each(data.items, (index, item) =>
            {
                collections.items.Fn('fields', item);
            });

            collections.items.ItemsClear();
            collections.items.ItemsArrayAdd(data.items);

            if($dh.query('item'))
            {
                collections.items.ItemGet($dh.query('item'))?.Fn('settings');
            }

            return this.table();
        });
    };

    this.table = () => 
    {
        let rows = $.map(this.rows(), function(value) { return [value]; });

        let dev = false;
        if ($dh.client().permissions.includes("collections.developer") || $dh.client().permissions.includes("*")) {
            dev = true;
        }

        rows.sort((a, b) => a.Get('order') - b.Get('order'));

        let table = {
            keys: this.keys(), 
            rows,
            callback: (row, attributes) =>
            {
                attributes['bind-click'] = 'settings|collections.items';
                attributes['data-item'] = row.Get('id');
                attributes['style'] = 'cursor: pointer';
            },
            onSelect: !share && dev ? this.onSelect() : null
        };


        if(data('page', 1) === 1 && rows.length < 100 && dev) {
            let order = {};

            table.onOrder = (target, index) => 
            {
                order[target.attr('data-item')] = index;

                dh.debounce(() => 
                {
                    collections.ActionSend('item.order', {type: 'put', collection: item.Get('id'), order});
                    order = {};
                }, 100, 'collection.items.reoder')
            };
        }
        

        return html.Render('table', table, {class: 'h-auto'});
    };

    this.keys = () =>
    {
        let keys = 
        {
            name: 
            {
                callback: (item) =>
                {
                    return item.Get('name') ? item.Get('name') : '-';
                }
            }
        };

        let fields = Object.values(item.Get('fields')).sort((a, b) => a.Get('order') - b.Get('order'));

        fields.forEach((field, item) =>
        {
            if(!field.Get('list'))
            {
                return true;
            }
    
            keys[field.Get('name').replaceAll('-', ' ')] = 
            {
                callback(item) 
                {
                    let query = ($dh.query('edit') + '').split(',')

                    if((query.includes('*') || query.includes(field.Get('name'))) && ['Text', 'Select'].includes(field.Get('Type').Get('name')))
                    {
                        return `<div class="settings-prevent">${item.Render('type.' + field.Get('Type').Get('name'), {field, onChange: (value) => 
                        {
                            item.Fn('save.set', field.Get('name'), value);
                            item.Fn('save.process');

                        }}, {}, false)}</div>`;
                    }
                    else 
                    {
                        return item.Render('list.' + field.Get('Type').Get('name'), {field}, {}, false);
                    }
                }
            };
        });
    
        keys['published'] =  
        {
            callback(item) 
            {
                let tags = [];
                let schedule = item.Get('schedule');
                let published = item.Get('published');

                if(published)
                {
                    tags.push('<div class="dh-success dh-plr5">Yes</div>');
                }
                else 
                {
                    tags.push('<div class="dh-warning dh-plr5">No</div>');
                }

                if(schedule.from && published)
                {
                    let from = new Date(schedule.from);
                    let today = new Date();

                    if(today < from)
                    {
                        tags.push('<div class="dh-warning dh-plr5">Inactive</div>');
                    }
                }

                if(schedule.to && published)
                {
                    let to = new Date(schedule.to);
                    let today = new Date();

                    if(today > to)
                    {
                        tags.push('<div class="dh-warning dh-plr5">Expired</div>');
                    }
                }

                return `<div class="dh-flex gap5">${tags.join('')}</div>`;
            }
        };
    
        keys['updated'] =  
        {
            callback(item) 
            {
                return dh.date(item.Get('updated'), 'D M, Y - H:i');
            }
        };

        return keys;
    };

    this.rows = () =>
    {
        let rows = [];

        $.each(item.Get('items'), (index, row) =>
        {
            if(!row.Get('parent'))
            {
                rows.push(row);
            }
        });

        return rows;
    };

    this.onSelect = () =>
    {
        return (row, index, bool) =>
        {
            let selected = addon.GetTemp('selected', {});
    
            if(bool)
            {
                selected[row.Get('id')] = row;
            }
            else
            {
                delete selected[row.Get('id')];
            }
    
            let length = Object.keys(selected).length;
    
            if(length)
            {
                $('#dh-collections-items-select').show();
                $('#dh-collections-items-select').find('button').text(`Selected (${length})`);
            }
            else
            {
                $('#dh-collections-items-select').hide();
            }
    
            addon.SetTemp('selected', selected);
        };
    };

    return this.init();
});