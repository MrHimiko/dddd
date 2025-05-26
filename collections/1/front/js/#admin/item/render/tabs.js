collections.RenderCreate('item.tabs', function(collections, collection, data, attributes)
{
    attributes['class'] = 'dh-scrollbar';
    
    let item = data('item');
    let tab = data('tab');
    let tabs = '';
    let create = '';
    let nest = '';

    $.each(collection.Get('tabs'), (index, value) =>
    {
        let active = tab && tab.Get('id') === value.Get('id') ? 'active' : '';

        if(!item && (value.Get('id') + '').includes('nest.'))
        {
            return true;
        }

        if(item)
        {
            tabs += value.Render('html', {}, {
                class: active,
                'bind-click': 'settings|collections.items',
                'data-item': item.Get('id'),
                'data-tab': value.Get('id'),
                'data-internal': true
            });
        }
        else
        {
            tabs += value.Render('html', {}, {
                class: active,
                'bind-click': 'settings|collections',
                'data-collection': collection.Get('id'),
                'data-tab': value.Get('id'),
                'data-internal': true
            });
        }
    });

    if(!item)
    {
        create = `<div bind-click="create|collections.tabs" data-name="" data-collection="${collection.Get('id', true)}" class="create">${dh.icon('plus', 16, 'common')} Add new tab</div>`;
    }

    return `
        <items for="collections.tabs" field="html" data-collection="${collection.Get('id', true)}">${tabs}</items>
        ${nest}
        ${create}
    `;
});