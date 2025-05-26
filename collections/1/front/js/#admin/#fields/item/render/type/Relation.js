collections.fields.RenderCreate('item.type.Relation', function(files, item, data, attributes)
{
    html.form.ItemsAdd({
        group: 'Options',
        title: 'Collection',
        description: 'Choose relation collection.',
        html: function()
        {
            return html.Render('input', {
                action: ['field.relation.collection|collections', item.Get('id')],
                select: () => 
                {
                    return collections.Fn('list')
                },
                attributes: {
                    value: item.Get('settings')['collection'],
                    placeholder: 'Select Collection'
                }
            });
        }
    });

    html.form.ItemsAdd({
        group: 'Options',
        title: 'Type',
        description: 'Choose relation type.',
        html: function()
        {
            return html.Render('input', {
                action: ['field.relation.type|collections', item.Get('id')],
                attributes: {
                    value: item.Get('settings')['type'] === 'multiple' ? 'multiple' : 'single'
                },
                select: () =>
                {
                    return [
                        {title: 'Single', value: 'single', description: 'Returns single item, if more items are selected, random item will be chosen at each request.'},
                        {title: 'Multiple', value: 'multiple', description: 'Returns multiple items in array.'}
                    ];
                }
            });
        }
    });
});