collections.items.RenderCreate('item.type.Switch', function(files, item, data, attributes)
{
    let field = data('field');
    let value = item.Fn('value', field.Get('name'));

    return html.Render('setting', {
        value: !!value,
        setting: {
            type: 'TOGGLE',
            placeholder: field.Get('name').replaceAll('-', ' ')
        },
        onChange: (value) =>
        {
            item.Fn('save.set', field.Get('name'), value);
        }
    });
});