collections.tabs.sections.BindClick('create', function(addon, event, target)
{
    let name = target.attr('data-name');
    let tab = target.attr('data-tab');
    let collection = target.attr('data-collection');

    addon.Fn('create', {name, tab, collection}, function(response, section)
    {
        console.log(tab);
    }, 
    function(response)
    {
        popup.notification(response.message);
    });
});