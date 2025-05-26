collections.items.RenderCreate('item.children', function(addon, item, data, attributes)
{
    let share = addon.GetTemp('share');
    let rows = [];

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
            id: item.Get('collection'),
            parent: item.Get('id')
        };

        return collections.Fetch('items', fetch, (data) =>
        {
            $.each(data.items, (index, item) =>
            {
                collections.items.Fn('fields', item);
            });

            collections.items.ItemsArrayAdd(data.items);

            return this.table();
        });
    };

    this.table = () => 
    {
        return html.Render('table', {
            keys: this.keys(), 
            rows: this.rows(),
            callback: (row, attributes) =>
            {
                attributes['bind-click'] = 'settings|collections.items';
                attributes['data-item'] = row.Get('id');
                attributes['style'] = 'cursor: pointer';
            },
            empty: 'No children found.'
        }, {class: 'h-auto'});
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
    
        $.each(item.Get('Collection').Get('fields'), (index, field) =>
        {
            if(!field.Get('list'))
            {
                return true;
            }
    
            keys[field.Get('name').replaceAll('-', ' ')] = 
            {
                callback(item) 
                {
                    return item.Render('list.' + field.Get('Type').Get('name'), {field}, {}, false);
                }
            };
        });
    
        keys['published'] =  
        {
            callback(item) 
            {
                return item.Get('published') ? `<div class="dh-success">Yes</div>` : `<div class="dh-warning">No</div>`
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

        $.each(item.Get('Collection').Get('items'), (index, row) =>
        {
            if(row.Get('parent') === item.Get('id'))
            {
                rows.push(row);
            }
        });

        return rows;
    };

    return this.init();
});