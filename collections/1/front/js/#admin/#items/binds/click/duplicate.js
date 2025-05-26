collections.items.BindClick('duplicate', function(addon, event, target, item)
{
    let fields = item.Get('fields');

    fields.name = item.Get('name') + ' - Copy';
    fields.parent = item.Get('parent');
    fields.collection = item.Get('collection');

    addon.Fn('create', fields, function(response, item)
    {
        if(!item.Get('parent'))
        {
            item.Get('Collection').Replace('items');
            item.Fn('settings');
        }
        else
        {
            item.Get('Parent').Replace('children');
        }
    }, 
    function(response)
    {
        popup.notification(response.message);
    });
});