collections.items.RenderCreate('item.type.Text', function(files, item, data)
{
    let field = data('field');
    let onChange = data('onChange');
    let value = item.Fn('value', field.Get('name'));

    return html.Render('setting', {
        value,
        setting: {
            type: field.Get('settings')['long'] ? 'TEXTAREA' : 'INPUT' ,
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