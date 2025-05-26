collections.items.RenderCreate('item.list.Media', function(files, item, data, attributes)
{
    let field = data('field');
    let value = item.Get('fields')[field.Get('name')].file;

    if(!value)
    {
        return '<div class="dh-warning">Not Set</div>';
    }

    else if(value.endsWith('.png') || value.endsWith('.jpg') || value.endsWith('.jpeg') || value.endsWith('.svg'))
    {
        return `<img style="width: 60px; height: 30px; object-fit: contain; border: 1px solid var(--dh-border-1); border-radius: 4px; background: var(--dh-bg-1);" src="${value}">`
    }

    return '<div class="dh-success">Set</div>';
});