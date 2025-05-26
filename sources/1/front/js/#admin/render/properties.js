mdSources.RenderCreate('properties', function(addon, data)
{
    let source = addon.GetTemp('source');
    let item = 'id' in source ? addon.ItemGet(source.id) : null;

    if(!item || !item.Get('properties'))
    {
        return '';
    }

    let properties = '';

    let defaultProperties = {
        limit:  {type: 'INPUT', value: 20},
        page:   {type: 'INPUT', value: 1},
        offset: {type: 'INPUT', value: 0},
        search: {type: 'INPUT', value: ''}
    };

    let render = (key, property) => 
    {
        if(property.type.toLowerCase() === 'select')
        {
            return html.Render('input', {
                label: key,
                attributes: {
                    placeholder: key,
                    value: key in source.properties ? source.properties[key] : property.value,
                },
                variable: data('variable'),
                select: () => 
                {
                    return property.values;
                },
                onChange: (target, value) =>
                {
                    source.properties[key] = value;
                },
            }, {
                class: 'inline'
            });
        }
        
        return html.Render('input', {
            label: key,
            attributes: {
                placeholder: key,
                value: key in source.properties ? source.properties[key] : property.value,
            },
            variable: data('variable'),
            onChange: (target, value) =>
            {
                source.properties[key] = value;
            },
        }, {
            class: 'inline'
        });
    };

    $.each(defaultProperties, (key, property) =>
    {
        properties += render(key, property);
    });

    $.each(item.Get('properties'), (key, property) =>
    {
        properties += render(key, property);
    });

    return `
        <p>Properties</p>
        <div>
            ${properties}
        </div>  
    `;
});