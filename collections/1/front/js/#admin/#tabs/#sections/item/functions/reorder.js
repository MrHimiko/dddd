collections.tabs.sections.FunctionCreate('item.reorder', function(addon, item, order, then = null, fail = null)
{
    if(item.Get('order') === order)
    {
        if(then) { then(response); }
        return;
    }

    collections.ActionSend('tab.section', {type: 'put', id: item.Get('id'), order: order}, function(response)
    {
        item.Set('order', order);
        if(then) { then(response); }
    }, 
    function(response)
    {
        if(fail) { fail(response); }
    });
});