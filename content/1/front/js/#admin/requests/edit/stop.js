edit.OnRequest('stop', function(edit, request)
{
    let tab = tabs.ItemGet('content');

    if(tab.Get('active'))
    {
        tab.Set('active', true);
    }
});