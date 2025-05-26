collections.tabs.BindClick('create', function(addon, event, target)
{
    let name = target.attr('data-name');
    let collection = target.attr('data-collection');

    addon.Fn('create', {name, collection}, (response, tab) =>
    {
        /* Open Settings With Tab */
        tab.Get('Collection').Fn('settings', tab);
    }, 
    (response) =>
    {
        popup.notification(response.message);
    });
});