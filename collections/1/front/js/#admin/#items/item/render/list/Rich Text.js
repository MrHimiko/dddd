collections.items.RenderCreate('item.list.Rich Text', function(files, item, data, attributes)
{
    let field = data('field');
    let value = item.Get('fields')[field.Get('name')];

    return value ? '<div class="dh-success">Set</div>' : '<div class="dh-warning">Not Set</div>';
});