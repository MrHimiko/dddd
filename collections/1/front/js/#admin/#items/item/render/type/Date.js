collections.items.RenderCreate('item.type.Date', function(files, item, data, attributes)
{
    let field = data('field');
    let value = item.Fn('value', field.Get('name'));

    return html.Render('setting', {
        value,
        setting: {
            type: 'DATE',
            format: 'yyyy-MM-dd',
            placeholder: field.Get('name').replaceAll('-', ' ')
        },
        onChange: (value) =>
        {
            item.Fn('save.set', field.Get('name'), value);
        }
    });
});