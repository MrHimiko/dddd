collections.fields.RenderCreate('item.type.Media', function(files, item, data, attributes)
{
    html.form.ItemsAdd({
        group: 'Options',
        title: 'Storage Key',
        description: 'When activated, storage uploads will be grouped by key, and the media popup will exclusively display uploaded assets associated with the selected key.',
        type: 'column',
        html: function()
        {
            return html.Render('input', {
                action: ['field.media.key|collections', item.Get('id')],
                attributes: {
                    value: item.Get('settings')['key']
                }
            });
        }
    });
});