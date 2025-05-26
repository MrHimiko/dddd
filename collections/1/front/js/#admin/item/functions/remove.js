collections.FunctionCreate('item.remove', function(addon, item, then = null, fail = null)
{
    collections.ActionSend('collection', {type: 'delete', id: item.Get('id')}, function(response)
    {
        if(then) { then(response); }
    }, 
    function(response)
    {
        if(fail) { fail(response); }
    });
});