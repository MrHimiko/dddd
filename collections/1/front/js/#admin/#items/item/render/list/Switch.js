collections.items.RenderCreate('item.list.Switch', function(files, item, data, attributes)
{
    let field = data('field');
    let value = item.Get('fields')[field.Get('name')];

    return value ? '<div class="dh-success">Yes</div>' : '<div class="dh-warning">No</div>';
});