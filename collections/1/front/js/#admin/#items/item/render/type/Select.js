collections.items.RenderCreate('item.type.Select', function(files, item, data, attributes)
{
    let field = data('field');
    let value = item.Fn('value', field.Get('name'));
    let onChange = data('onChange');
    let options = field.Get('settings').options;
    let items = [
        {title: 'None', value: 'none'}
    ];

    if(Array.isArray(options))
    {
        options.forEach((option) => 
        {
            items.push({title: option, value: option})
        });
    }

    return html.Render('setting', {
        value,
        setting: {
            type: 'SELECT',
            values: items,
            placeholder: field.Get('name').replaceAll('-', ' ')
        },
        onChange: (value) =>
        {
            if(onChange)
            {
                onChange(value);
            }
            else 
            {
                item.Fn('save.set', field.Get('name'), value);
            }
        }
    });
});