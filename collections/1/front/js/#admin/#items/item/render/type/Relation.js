collections.items.RenderCreate('item.type.Relation', function(items, item, data, attributes)
{
    attributes['style'] = 'min-height: 100px';

    let field = data('field');

    let collection = collections.ItemGet(field.Get('settings')['collection']);
    let value = item.Fn('value', field.Get('name'));

    if(!collection)
    {
        return 'Please configure relation collection.';
    }

    return collection.Render('relation.list', {
        values: value,
        onChange: (values) =>
        {
            item.Fn('save.set', field.Get('name'), values);
        }
    });
});