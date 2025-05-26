collections.items.BindClick('settings', function(addon, event, target)
{
    if($(event.target).hasClass('select-single') || $(event.target).parents('.select-single').length)
    {
        return;
    }

    if($(event.target).hasClass('settings-prevent') || $(event.target).parents('.settings-prevent').length)
    {
        return;
    }

    let tab = collections.tabs.ItemGet(target.attr('data-tab'));
    let item = collections.items.ItemGet(target.attr('data-item'));

    if(target.attr('data-internal'))
    {
        return item.Fn('settings', tab);
    }

    collections.items.Fn('save', true, () =>
    {
        item.Fn('settings', tab);
    });
});