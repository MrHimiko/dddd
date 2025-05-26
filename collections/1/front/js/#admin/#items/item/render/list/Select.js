collections.items.RenderCreate('item.list.Select', function(files, item, data, attributes)
{
    let field = data('field');
    let options = field.Get('settings').options;
    let value = item.Get('fields')[field.Get('name')];

    if(!Array.isArray(options))
    {
        return '-';
    }

    if(options.includes(value))
    {
        return dh.sanitize(value);
    }

    return '-';
});