
mdSources.RenderCreate('save', function(addon, data)
{
    let source = addon.GetTemp('source');
    let item = 'id' in source ? addon.ItemGet(source.id) : null;

    if(!item)
    {
        return '';
    }

    return `
        <div class="dh-flex gap10 jcfe">
            ${html.Render('button', {
                title: 'Disconnect',
                onClick: () =>
                {
                    addon.SetTemp('source', {});

                    $('#md-sources-select').val('');

                    mdSources.Render('properties', {}, {}, true, true);
                    mdSources.Render('filters', {}, {}, true, true);
                    mdSources.Render('sort', {}, {}, true, true);
                    mdSources.Render('repeat', {}, {}, true, true);
                    mdSources.Render('key', {}, {}, true, true);
                    mdSources.Render('save', {}, {}, true, true);

                    data('onSave')(null);
                }
            }, {class: 'border'})}
            ${html.Render('button', {
                title: 'Save',
                onClick: () =>
                {
                    data('onSave')(source);
                }
            })}
        </div>
    `;
});