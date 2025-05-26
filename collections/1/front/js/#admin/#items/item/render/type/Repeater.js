collections.items.RenderCreate('item.type.Repeater', function(files, item, data, attributes)
{
    let field = data('field');
    let value = item.Fn('value', field.Get('name'));
    let config = field.Get('settings')['config'];

    config = JSON.stringify(config);
    config = mdVars.Fn('process', config, {item: item.data});
    config = JSON.parse(config);

    return html.Render('settings', {
        label: 'none',
        values: {items: value},
        settings: {
            items: {
                type: 'REPEATER',
                settings: config
            }
        },
        onChange: (value) =>
        {
            item.Fn('save.set', field.Get('name'), value.items);
        }
    });
});