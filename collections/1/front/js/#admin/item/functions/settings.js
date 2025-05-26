collections.FunctionCreate('item.settings', function(addon, item, tab = null)
{
    mdModal.Fn('template.sidebar', item.Render('settings', {tab}), 'right', 'calc(100vw - 250px)', true, (config) =>
    {
        config.id = 'collection.settings';
    });

    collections.fields.Fn('sortable');
    collections.tabs.sections.Fn('sortable');
});