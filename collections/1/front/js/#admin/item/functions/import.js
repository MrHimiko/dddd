collections.FunctionCreate('item.import', function(addon, item, tab = null)
{
    return mdModal.Fn('template.middle', item.Render('import'), 'Import CSV File', $(window).width() - 200, (config) =>
    {
        config.overlay.closeable = false;
    });
});