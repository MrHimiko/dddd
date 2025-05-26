collections.fields.RenderCreate('item.type.Select', function(files, item, data, attributes)
{
    let options = item.Get('settings')['options'];

    html.form.ItemsAdd({
        group: 'Options',
        title: 'Options',
        description: 'Define up to 50 select options separated by new line.',
        type: 'column',
        html: function()
        {
            return html.Render('textarea', {
                action: ['field.select.options|collections', item.Get('id')],
                value: options ? options.join('\n') : '',
                attributes: {
                   placeholder: 'Option 1'
                }
            });
        }
    });
});