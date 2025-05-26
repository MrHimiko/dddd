collections.items.RenderCreate('item.list.Relation', function(addon, item, data, attributes)
{
    let field = data('field');
    let value = item.Get('fields')[field.Get('name')];
    let settings = field.Get('settings');

    if(!settings || typeof settings !== 'object' || !('type' in settings) || !('collection' in settings) || !settings.collection)
    {
        return '-';
    }

    if(!Array.isArray(value))
    {
        return '-';
    }

    let ids = addon.GetTemp('relation.' + settings.collection, []);

    value.forEach((id) => 
    {
        ids.push(value);
    });

    addon.SetTemp('relation.' + settings.collection, ids);

    dh.debounce(() => 
    {
        let ids = addon.GetTemp('relation.' + settings.collection, []);

        addon.SetTemp('relation.' + settings.collection, []);
        
        collections.Fetch('items', {id: settings.collection, ids: ids.join(','), limit: 500}, (data) =>
        {
            data.items.forEach((item) => 
            {
                $(`.relation-${item.id}`).html(item.name);
            });
        });

    }, 100, 'collection.relation.' + settings.collection);

    let html = '';

    value.forEach((id) => 
    {
        html += `<span class="relation-${id}" style="margin-right: 2px; background: var(--dh-scheme-3); border-radius: 12px; padding: 0 10px;"></span>`;
    });

    return html ? html : '-';
});