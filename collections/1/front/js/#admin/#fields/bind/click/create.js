collections.fields.BindClick('create', function(addon, event, target)
{
    let section = parseInt(target.attr('data-section'));
    let type = target.attr('data-type');
    let name = target.attr('data-name');

    if(!type || !name)
    {
        return mdModal.Fn('template.middle', addon.Render('types', {section}), 'Add new field', 560);
    }
   
    addon.Fn('create', {name, section, field_type: type}, function(response, field)
    {
        field.Fn('settings');
    }, 
    function(response)
    {
        popup.notification(response.message);
    });
});