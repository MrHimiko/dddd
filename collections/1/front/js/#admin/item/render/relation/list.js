collections.RenderCreate('item.relation.list', function(addon, collection, data, attributes)
{
    let values = data('values', []);
    let onChange = data('onChange');
    let id = data('id', 'dh-cms-relation-list-' + dh.increaser('collections.relation', 10000000));

    values.forEach((value, index) => 
    {
        values[index] = parseInt(value);
    });

    if(!Array.isArray(values))
    {
        values = [];
    }

    attributes['id'] = id;
 
    this.init = () =>
    {
        return addon.Fetch('items', {id: collection.Get('id'), ids: values.join(',')}, (data) =>
        {
            return `   
                <div class="dh-grid col1 gap10">
                    ${this.table(data.items)}
                    ${this.button()}
                </div>
            `;
        });
    };

    this.table = (items) =>
    {
        return html.Render('table', {
            empty: 'No items selected.',
            keys: {
                'name': {
                    callback(row) 
                    {
                        return dh.sanitize(row.name);
                    }
                },
                'actions': 
                {
                    callback(row) 
                    {
                        return html.Render('button', {
                            icon: 'trash',
                            onClick: (target) =>
                            {
                                values.forEach((value, index) =>
                                {
                                    if(value === row.id)
                                    {
                                        delete values[index];
                                    }
                                });

                                values = values.filter(Boolean);

                                onChange(values);

                                if(values.length)
                                {
                                    $('#table-row-' + row.id).remove();
                                }
                                else
                                {
                                    collection.Replace('relation.list', {values, onChange, id}, {}, true, '#' + id)
                                }
                            }
                        });
                    }
                },
            },
            rows: items
        });
    };

    this.button = () =>
    {
        return html.Render('button', {
            title: 'Select Items',
            onClick: () =>
            {
                mdModal.Fn('template.sidebar', collection.Render('relation.popup', {
                    values,
                    onChange: (values) =>
                    {
                        onChange(values);
                        collection.Replace('relation.list', {values, onChange, id}, {}, true, '#' + id)
                    }
                }));
            }
        })
    };

    return this.init();
});