edit.OnRequest('start',  function(edit, request)
{
    if(request.value.Get('addon') !== 'builder.components.tags') { return; }

    let tab = tabs.ItemGet('advanced');

    if(tab.Get('active'))
    {
        tab.Set('active', true);
    }
});