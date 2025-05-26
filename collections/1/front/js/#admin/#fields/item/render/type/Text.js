collections.fields.RenderCreate('item.type.Text', function(files, item, data, attributes)
{
    html.form.ItemsAdd({
        group: 'Options',
        title: 'Long Text',
        description: 'Make field suitable for longer text.',
        type: 'column',
        html: function()
        {
            return html.Render('toggle', {
                action: ['field.text.long|collections', item.Get('id')],
                checked: !!item.Get('settings')['long'],
            });
        }
    });
});