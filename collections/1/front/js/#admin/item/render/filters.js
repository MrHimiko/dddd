collections.RenderCreate('item.filters', function(addon, item, data, attributes)
{
    return html.Render('listing', {
        label: '',
        keys: {
            field: function(value)
            {
                let list = [];

                $.each(item.Get('fields'), (id, field) =>
                {
                    if(field.Get('type') === 9)
                    {
                        list.push({title: field.Get('name') , value: (field.Get('name') + ':' + field.Get('settings')['collection'])});
                    }
                    else 
                    {
                        list.push({title: field.Get('name'), value: field.Get('name')});
                    }
                });

                return html.Render('input', {
                    select: () =>
                    {
                        return list;
                    },
                    onChange: (target, val) =>
                    {
                        
                    },
                    attributes: {
                        value,
                        placeholder: 'Field'
                    }
                });
            },
            operator: function(value)
            {
                return html.Render('input', {
                    select: () =>
                    {
                        return [
                            {title: 'Equals', value: 'Equals'},
                            {title: 'NotEquals', value: 'NotEquals'},
                            {title: 'LessThan', value: 'LessThan'},
                            {title: 'LessEqualThan', value: 'LessEqualThan'},
                            {title: 'GreaterThan', value: 'GreaterThan'},
                            {title: 'GreaterEqualThan', value: 'GreaterEqualThan'},
                            {title: 'Contains', value: 'Contains'},
                            {title: 'NotContains', value: 'NotContains'},
                            {title: 'StartsWith', value: 'StartsWith'},
                            {title: 'EndsWith', value: 'EndsWith'},
                            {title: 'True', value: 'True'},
                            {title: 'False', value: 'False'},
                            {title: 'Empty', value: 'Empty'},
                            {title: 'NotEmpty', value: 'NotEmpty'},
                            {title: 'In', value: 'In'},
                            {title: 'NotIn', value: 'NotIn'},
                            {title: 'Includes', value: 'Includes'},
                            {title: 'NotIncludes', value: 'NotIncludes'}
                        ];
                    },
                    attributes: {
                        value,
                        placeholder: 'Operator'
                    }
                });
            },
            value: function(value, row)
            {
                console.log(row);

                if(row && row.field && row.field.split(':').length === 2)
                {
                    return mdSources.Render('select', {
                        id: 'collection.' + row.field.split(':')[1],
                        value,
                        attributes: {
                            placeholder: 'Value',
                            id: 'md-sources-filter'
                        }
                    });
                }
                else
                {
                    return html.Render('input', {
                        attributes: {
                            value,
                            placeholder: 'Value',
                            id: 'md-sources-filter'
                        },
                        variable: data('variable')
                    })
                }
            }
        },
        items: addon.GetTemp('filters.' + item.Get('id'), []),
        onChange: (items) =>
        {
            addon.SetTemp('page.' + item.Get('id'), 1);
            addon.SetTemp('filters.' + item.Get('id'), items);

            $('#collection-items').html(item.Render('items', {page: 1, filters: items, fetch: true}, {}, false));
            item.Replace('heading');
        }
    });
});