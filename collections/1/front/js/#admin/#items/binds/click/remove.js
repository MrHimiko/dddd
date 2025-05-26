collections.items.BindClick('remove', function(addon, event, target, item)
{
    item.Fn('remove', () =>
    {
        mdModal.ItemGet('collections.items.settings.' + item.Get('parent'), (modal) =>
        {
            modal.Remove();
        });

        if(!item.Get('parent'))
        {
            item.Get('Collection').Replace('items');
        }
        else
        {
            item.Get('Parent').Replace('children');
        }
    }, 
    (response) =>
    {
        popup.notification(response.message);
    });
});