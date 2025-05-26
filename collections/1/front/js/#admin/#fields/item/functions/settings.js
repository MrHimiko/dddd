collections.fields.FunctionCreate('item.settings', function(addon, item)
{
    mdModal.Fn('template.middle', item.Render('settings'), 'Field Settings', 560);
});