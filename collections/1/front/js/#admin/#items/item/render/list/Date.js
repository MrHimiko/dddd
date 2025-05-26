collections.items.RenderCreate('item.list.Date', function(files, item, data, attributes)
{
    let field = data('field');
    let value = item.Get('fields')[field.Get('name')];

    return value ? dh.sanitize(value) : '-';
});