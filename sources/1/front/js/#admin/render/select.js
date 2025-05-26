mdSources.RenderCreate('select', function(addon, data)
{
    let id = data('id', '');
    let value = data('value');

    let properties = data('properties', {});
    let attributes = data('attributes', {});
    
    let identifier = dh.increaser('md.sources.select');

    this.init = () => 
    {
        if(value)
        {
            attributes['placeholder'] = 'Loading...';
            attributes['id'] = 'md-sources-select-' + identifier;
    
            this.list(value, null, (list) => 
            {
                if(list.length)
                {
                    $('#md-sources-select-' + identifier).val(list[0].title);
                }
            });

            delete properties['id'];
        }

        return html.Render('input', {
            label: data('label'),
            suffix: dh.icon('carrot-down', 12, 'common', {
                style: 'margin-right: 5px;'
            }),
            attributes,
            onInput: (target, value) => 
            {
                dh.debounce(() => 
                {
                    this.modal(target, value);
                }, 200);
            },
            onClick: (target) => 
            {
                dh.debounce(() => 
                {
                    this.modal(target);
                }, 50);
            },
            variable: data('variable'),
        }, {class: data('label') ? 'inline' : ''});
    };

    this.modal = (target, search = '') => 
    {
        this.list(null, search, (list) => 
        {
            let modal = {
                id: 'md.sources.select',
                element: target,
                width: 'inherit',
                closeable: 'hard',
                align: {x: 'center', y: 'bottom-out'},
                offset: {x: 0, y: 5},
                overlay: {opacity: 0, closeable: true},
                corners: true,
            };

            modal.html = () => 
            {
                return html.Render('list', 
                {
                    list,
                    onClick: function(listTarget, item)
                    {
                        target.val(item.value).trigger('change');

                        if(data('onSelect'))
                        {
                            data('onSelect')(target, item);
                        }
                    },
                }); 
            }
        
            mdModal.ItemAdd(modal);
        });
    };

    this.list = (single, search, then) => 
    {
        addon.ItemGet(id, (item) =>
        {
            properties.search = search;
            properties.limit = 200;
            properties.page = 1;

            if(single)
            {
                properties.id = single;
                properties.limit = 1;
            }

            item.Fn('run', properties, [], '', {}, (data) =>
            {
                let list = [];

                data.forEach((value, index) => 
                {
                    if(!('id' in value) || !('name' in value))
                    {
                        return true;
                    }

                    list.push({title: value.name, value: value.id});
                });

                then(list);
            });
        });
    };

    return this.init();
});