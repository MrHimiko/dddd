edit.OnRequest('stop', function(edit, request)
{
    let tab = tabs.ItemGet('advanced');

    if(tab.Get('active'))
    {
        tab.Set('active', true);
    }
});