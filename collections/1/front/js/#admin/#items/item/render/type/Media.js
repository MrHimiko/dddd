collections.items.RenderCreate('item.type.Media', function(files, item, data, attributes)
{
    let field = data('field');
    let value = item.Fn('value', field.Get('name'));

    key = field.Get('settings')['key'];

    if(!key)
    {
        key = item.Get('Collection').Get('storage').key;
    }

    key = mdVars.Fn('process', key, {item: item.data});

    return storage.Render('upload.image', {
        value,
        key: key ? (key + '') : null,
        onChange: (target, value) =>
        {
            item.Fn('save.set', field.Get('name'), value);
        }
    });
});