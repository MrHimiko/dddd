mdSources.RenderCreate('filters', function(addon, data)
{
    let source = addon.GetTemp('source');
    let item = 'id' in source ? addon.ItemGet(source.id) : null;

    if(!item || !item.Get('fields') || !item.Get('operators'))
    {
        return '';
    }

    return html.Render('listing', {
        label: 'Filters',
        keys: {
            field: function(value)  {

                let list = [];

                $.each(item.Get('fields'), (id, field) =>
                {
                    list.push({title: field.name, value: id});
                });

                return html.Render('input', {
                    select: () =>
                    {
                        return list;
                    },
                    onChange: (target, val) =>
                    {
                        if(!(val in item.Get('fields')))
                        {
                            return;
                        }

                        let field = item.Get('fields')[val];

                        if(field.type === 'SELECT')
                        {
                            html.Render('input', {
                                attributes: {
                                    value: '',
                                    placeholder: 'Value',
                                    id: 'md-sources-filter'
                                },
                                select: () => {
                                    let list = [];

                                    $.each(field.options, (value, title) =>
                                    {
                                        list.push({value, title});
                                    });

                                    return list;
                                },
                                variable: data('variable')
                            }, {id: 'dh-source-filter-value'}, true, true, '#dh-source-filter-value');
                        }
                        if(field.type === 'SOURCE')
                        {
                            mdSources.Render('select', {
                                id: field.options.source,
                                value,
                                attributes: {
                                    placeholder: 'Value',
                                    id: 'md-sources-filter'
                                },
                                variable: data('variable')
                            }, {id: 'dh-source-filter-value'}, true, true, '#dh-source-filter-value');
                        }
                        else
                        {
                            html.Render('input', {
                                attributes: {
                                    value: '',
                                    placeholder: 'Value',
                                    id: 'md-sources-filter'
                                },
                                variable: data('variable')
                            }, {id: 'dh-source-filter-value'}, true, true, '#dh-source-filter-value');
                        }
                    },
                    attributes: {
                        value,
                        placeholder: 'Field'
                    }
                });
            },
            operator: function(value)
            {
                let list = [];

                $.each(item.Get('operators'), (value, title) =>
                {
                    list.push({title, value});
                });

                return html.Render('input', {
                    select: () =>
                    {
                        return list;
                    },
                    attributes: {
                        value,
                        placeholder: 'Operator'
                    }
                });
            },
            value: function(value, row)
            {
                let field = item.Get('fields')[row?.field];

                if(field && field.type === 'SELECT')
                {
                    return html.Render('input', {
                        attributes: {
                            value,
                            placeholder: 'Value',
                            id: 'md-sources-filter'
                        },
                        select: () => {
                            let list = [];

                            $.each(field.options, (value, title) =>
                            {
                                list.push({value, title});
                            });

                            return list;
                        },
                        variable: data('variable')
                    }, {id: 'dh-source-filter-value'}, true, true, '#dh-source-filter-value');
                }

                if(field && field.type === 'SOURCE')
                {
                    return mdSources.Render('select', {
                        value,
                        attributes: {
                            placeholder: 'Value',
                            id: 'md-sources-filter'
                        },
                        variable: data('variable')
                    }, {id: 'dh-source-filter-value'}, true, true, '#dh-source-filter-value');
                }

                return html.Render('input', {
                    attributes: {
                        value,
                        placeholder: 'Value',
                        id: 'md-sources-filter'
                    },
                    variable: data('variable')
                }, {id: 'dh-source-filter-value'})
            }
        },
        items: source.filters,
        onChange: (items) =>
        {
            source.filters = items;
        },
        onDisplay: (row, key, value) =>
        {
            if(key === 'field' && value.val in item.Get('fields'))
            {
                value.val = item.Get('fields')[value.val].name;
            }

            if(key === 'operator' && value.val in item.Get('operators'))
            {
                value.val = item.Get('operators')[value.val];
            }
        }
    });
});