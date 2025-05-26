collections.tabs.BindClick('remove', function(addon, event, target, item)
{
    item.Fn('remove', (response) =>
    {
        item.Get('Collection').Fn('settings');
    }, 
    (response) =>
    {
        popup.notification(response.message);
    });
});