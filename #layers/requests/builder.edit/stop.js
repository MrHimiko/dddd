edit.OnRequest('stop', function(edit, request)
{
    /* Check if Tags */
    if(request.value.Get('addon') !== 'builder.components.tags') { return; }

    /* Get Tab */
    let tab = tabs.ItemGet('layers');

    if(tab.Get('active'))
    {
        /* Active */
        components.layers.Fn('dom.active', null);
    }
});