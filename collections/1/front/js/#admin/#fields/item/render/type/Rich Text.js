collections.fields.RenderCreate('item.type.Rich Text', function(files, item, data, attributes)
{
    return;
    
    html.form.ItemsAdd({
        group: 'Options',
        title: 'Long Text',
        description: 'Make field suitable for longer text.',
        type: 'column',
        html: function()
        {
            return html.Render('toggle', {
                attributes: {
                   
                }
            });
        }
    });
});