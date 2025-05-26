collections.items.RenderCreate('item.type.HTML Editor', function(files, item, data, attributes)
{
    let field = data('field');
    let value = item.Fn('value', field.Get('name'));
    
    return html.Render('trumbowyg', {
        value: value,
        onInput: (html) => 
        {
            item.Fn('save.set', field.Get('name'), html);
        }
    });
});