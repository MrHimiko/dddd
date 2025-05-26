collections.fields.FunctionCreate('item.reorder', function(addon, item, order, then = null, fail = null)
{
    if(item.Get('order') === order)
    {
        if(then) { then(response); }
        return;
    }

    collections.ActionSend('field', {type: 'put', id: item.Get('id'), order}, function(response)
    {
        item.Set('order', order);
        if(then) { then(response); }
    }, 
    function(response)
    {
        if(fail) { fail(response); }
    });
});