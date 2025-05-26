collections.items.RenderCreate('item.list.Text', function(files, item, data, attributes)
{
    let field = data('field');
    let value = item.Get('fields')[field.Get('name')];

    if(!value)
    {
        return '-';
    }

    return '<span style="max-width: 400px" class="dh-ellipsis1">' + (value ? dh.sanitize(value) : '') + '</span>';
});