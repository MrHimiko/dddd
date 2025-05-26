collections.fields.RenderCreate('item.type.Repeater', function(files, item, data, attributes)
{
    html.form.ItemsAdd({
        group: 'Options',
        title: 'Fields',
        description: 'Set up repeater fields. Each item that you add in repeater will have this fields.',
        html: function()
        {
            return html.Render('button', {
                title: 'Configure',
                onClick: () => 
                {
                    const settings = item.Get('settings');

                    mdVars.Fn('dynamic.open', settings['config'], null, null, function(dynamic)
                    {
                        collections.ActionSend('field.repeater.config', {type: 'PUT', id: item.Get('id'), value: JSON.stringify(dynamic.config)}, function(response)
                        {
                            item.Set('settings', $.extend(settings, {config: dynamic.config}));
                        });

                    }, 'config', 'modal', 'Field', ['COMPONENT', 'BLOCKS']);
                }
            })
        }
    });
});

