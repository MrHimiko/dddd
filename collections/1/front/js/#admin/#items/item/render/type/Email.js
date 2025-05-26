collections.items.RenderCreate('item.type.Email', function(files, item, data, attributes)
{
    let field = data('field');
    let value = item.Fn('value', field.Get('name'));

    return html.Render('setting', {
        value,
        setting: {
            type: 'EMAIL',
            format: 'joe@email.com',
            placeholder: field.Get('name')
        },
        onChange: (value) =>
        {
            item.Fn('save.set', field.Get('name'), value);
        }
    });
});