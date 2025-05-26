collections.items.RenderCreate('item.type.Rich Text', function(files, item, data, attributes)
{
    let field = data('field');
    let value = item.Fn('value', field.Get('name'));
    
    return html.Render('richText', {
        blocks: value,
        onChange: (blocks) => 
        {
            item.Fn('save.set', field.Get('name'), blocks);
        }
    });
});