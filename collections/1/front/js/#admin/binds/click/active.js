collections.BindClick('active', function(addon, event, target, item)
{
    if(target.hasClass('active'))
    {
        target.removeClass('active');
        addon.SetSave('active', null);

        /* Render Empty */
        return collections.Render('collection', {}, {}, true, true);
    }

    /* Remove Active Class */
    $('.i404a5ac0').removeClass('active');

    target.addClass('active');
    addon.SetSave('active', item.Get('id'));
    
    return collections.Render('collection', {collection: item}, {}, true, true);
});