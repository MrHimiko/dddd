collections.BindClick('remove', function(addon, event, target, item)
{
    item.Fn('remove', () =>
    {
        item.Remove();

        /* Render Empty */
        collections.Render('collection', {}, {}, true, true);

        /* Remove Active Class */
        $('.i404a5ac0').removeClass('active');

        /* Close Settings if Opened */
        mdModal.ItemGet('collection.settings', (item) =>
        {
            item.Remove({animation: true});
        });
    }, 
    (response) =>
    {
        popup.notification(response.message);
    });
});