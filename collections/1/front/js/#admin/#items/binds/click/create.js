collections.items.BindClick('create', function(addon, event, target)
{
    let collection = target.attr('data-collection');
    let parent = target.attr('data-parent');
    let name = target.attr('data-name');

    addon.Fn('create', {name, parent, collection}, function(response, item)
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