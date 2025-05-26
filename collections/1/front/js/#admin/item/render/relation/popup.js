collections.RenderCreate('item.relation.popup', function(collections, item, data, attributes)
{
    attributes['class'] = 'dh-scrollbar';

    let values = data('values', []);
    let parent = data('parent', 0);
    let search = data('search', '');
    let onChange = data('onChange');
    let changed = data('changed') ? true : false;

    values.forEach((value, index) => 
    {
        values[index] = parseInt(value);
    });

    this.init = () =>
    {
        html.form.ItemsClear();

      
        this.search();

        if(parent)
        {
            this.parent();
        }

        this.items();
        this.finish();

        return html.form.Render('main', {}, {class: 'clean'});
    };

    this.parent = () =>
    {
        html.form.ItemsAdd({
            group: 'Relation',
            title: '',
            description: '',
            type: 'column',
            html: function()
            {
                return html.Render('button', {
                    title: 'Go Back',
                    onClick: () => 
                    {
                        item.Replace('relation.popup', {values, onChange, changed, search});
                    }
                });
            }
        });
    };

    this.search = () =>
    {
        html.form.ItemsAdd({
            group: 'Relation',
            title: 'Filter',
            description: 'Search to retreive more specific items.',
            type: 'column',
            html: function()
            {
                return html.Render('input', {
                    attributes: {
                        value: search,
                        placeholder: 'Search...'
                    },
                    onChange: (target, value) =>
                    {
                        item.Replace('relation.popup', {values, onChange, changed, search: value});
                    }
                });
            }
        });
    };

    this.items = () =>
    {
        html.form.ItemsAdd({
            group: 'Relation',
            title: 'Select',
            description: 'Select one or multiple items.',
            html: function()
            {
                return collections.Fetch('items', {id: item.Get('id'), parent, search}, (fetch) =>
                {
                    return html.Render('table', 
                    {
                        empty: 'No items found.',
                        keys: {
                            'name': {
                                callback(row) 
                                {
                                    return dh.sanitize(row.name);
                                }
                            },
                            '': {
                                callback(row) 
                                {
                                    if(!item.Get('nest'))
                                    {
                                        return '';
                                    }

                                    return html.Render('button', {
                                        title: 'Children',
                                        onClick: () => 
                                        {
                                            parent = row.id;
                                            item.Replace('relation.popup', {values, onChange, search, changed, parent});
                                        }
                                    });
                                }
                            }
                        },
                        rows: fetch.items,
                        selected: values,
                        onSelect: (row, index, selected) =>
                        {
                            changed = true;
                            
                            /* Handle Selected */
                            if(selected)
                            {
                                if(!values.includes(row.id))
                                {
                                    values.push(row.id);
                                }
                            }

                            /* Handle Un-Selected */
                            else 
                            {
                                if(values.includes(row.id))
                                {
                                    values.forEach((value, index) =>
                                    {
                                        if(value === row.id)
                                        {
                                            delete values[index];
                                        }
                                    });

                                    values = values.filter(Boolean);
                                }
                            }
                        }
                    });
                });
            }
        });
    };

    this.finish = () =>
    {
        html.form.ItemsAdd({
            group: 'Relation',
            title: '',
            description: '',
            type: 'column',
            html: function()
            {
                return html.Render('button', {
                    title: 'Finish',
                    attributes: {
                        'modal-close': true
                    },
                    onClick: () =>
                    {
                        if(changed)
                        {
                            onChange(values);
                        }
                    }
                }, {class: 'success'});
            }
        });
    };

    return this;
});