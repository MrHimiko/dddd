collections.BindClick('create', function(addon, event, target)
{
    let name = target.attr('data-name');

    addon.Fn('create', {name}, (response, collection) =>
    {
        /* Render Collection */
        collections.Render('collection', {collection}, {}, true, true);

        /* Remove Active Class */
        $('.i404a5ac0').removeClass('active');

        /* Set Active on Sidebar */
        collection.TargetItem('html').addClass('active');

        /* Trigger Settings */
        collection.Fn('settings');
    }, 
    (response) =>
    {
        popup.notification(response.message);
    });
});