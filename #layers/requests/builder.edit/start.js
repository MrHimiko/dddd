edit.OnRequest('start', function(edit, request)
{
    /* Check if Tags */
    if(request.value.Get('addon') !== 'builder.components.tags') { return; }

    /* Get Tab */
    let tab = tabs.ItemGet('layers');

    /* Open Tab */
    if(!tab.Get('active')) { tab.Fn('open'); }

    /* Item */
    let tag = request.value.Get('item');

    /* Get Component */
    let activeComponent = components.layers.GetTemp('component');

    /* Component */
    let component = tag.Get('Component');

    /* Symbol */
    if(request.value.Get('symbol'))
    {
        component = request.value.Get('Symbol').Get('Component');
    }

    if(activeComponent && activeComponent.Get('id') === component.Get('id'))
    {
        /* Same Component */
    }
    else
    {
        components.layers.SetTemp('component', component);
        tab.Set('active', true);
    }

    /* Active */
    components.layers.Fn('dom.active', tag.Get('id'), request.value.Get('symbol'));
});