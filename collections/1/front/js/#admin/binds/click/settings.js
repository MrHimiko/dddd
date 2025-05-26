collections.BindClick('settings', function(addon, event, target)
{
    event.preventDefault();

    let collection = collections.ItemGet(target.attr('data-collection'));
    let tab = collections.tabs.ItemGet(target.attr('data-tab'))

    collection.Fn('settings', tab);
});