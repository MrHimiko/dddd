collections.fields.RenderCreate('item.settings', function(files, item, data, attributes)
{
    html.form.ItemsClear();
    html.form.ItemsAdd({
        group: '',
        title: 'Name',
        description: 'Field name. Can not be changed.',
        html: function()
        {
            return html.Render('input', {
                attributes: {
                    value: item.Get('name'),
                    disabled: true,
                }
            });
        }
    }, {
        group: '',
        title: 'Type',
        description: 'Field type. Can not be changed.',
        html: function()
        {
            return html.Render('input', {
                attributes: {
                    value: item.Get('Type').Get('name'),
                    disabled: true,
                }
            });
        }
    });

    item.Render('type.' + item.Get('Type').Get('name'));

    html.form.ItemsAdd({
        group: 'Settings',
        title: 'Width',
        description: 'Customize field width.',
        html: function()
        {
            return html.Render('select', {
                action: ['field|collections', item.Get('id'), 'width'],
                options: {
                    3: '25%',
                    6: '50%',
                    9: '75%',
                    12: '100%',
                },
                attributes: {
                    value: item.Get('width')
                }
            });
        }
    }, {
        group: 'Settings',
        title: 'List',
        description: 'Enable or disable field item listing.',
        html: function()
        {
            return html.Render('toggle', {
                action: ['field|collections', item.Get('id'), 'list'],
                checked: item.Get('list')

            });
        }
    });


    return html.form.Render('main', {}, {class: 'flex'}) + `
        <div class="dh-mt20 dh-tar">${html.Render('button', {
            title: 'Save',
            attributes: {
                'modal-close': true
            }
        }, {class: 'success'})}</div>
    `
});