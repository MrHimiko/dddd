collections.BindClick('filters', function(addon, event, target)
{
    let collection = collections.ItemGet(target.attr('data-collection'));

    return mdModal.Fn('template.middle', collection.Render('filters'), 'Filters', 560, (config) =>
    {
        config.overlay.closeable = false;
    });
});