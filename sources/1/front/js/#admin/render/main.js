mdSources.RenderCreate('main', function(addon, data)
{
    let source = data('source', {});

    addon.SetTemp('source', source ? source : {});    

    return `
        ${html.Render('input', {
            select: () =>
            {
                return mdSources.Fn('list');
            },
            onSelect: (target, item) =>
            {
                addon.SetTemp('source', {
                    id: item.value,
                    properties: {},
                    filters: [],
                    sort: null,
                    repeat: true,
                    key: null
                });

                mdSources.Render('properties', {variable: data('variable')}, {}, true, true);
                mdSources.Render('filters', {variable: data('variable')}, {}, true, true);
                mdSources.Render('sort', {}, {}, true, true);
                mdSources.Render('repeat', {}, {}, true, true);
                mdSources.Render('key', {}, {}, true, true);
                mdSources.Render('save', {onSave: data('onSave')}, {}, true, true);
            },
            attributes: {
                placeholder: 'Select source',
                value: source ? source.id : null,
                id: 'md-sources-select'
            }
        })}
        <div>
            ${mdSources.Render('properties', {variable: data('variable')})}
            ${mdSources.Render('filters', {variable: data('variable')})}
            ${mdSources.Render('sort')}
            ${mdSources.Render('repeat')}
            ${mdSources.Render('key')}
            ${mdSources.Render('save', {onSave: data('onSave')})}
        </div>
    `;
});