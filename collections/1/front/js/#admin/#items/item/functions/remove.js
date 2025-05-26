collections.items.FunctionCreate('item.remove', function(addon, item, then = null, fail = null)
{
    collections.ActionSend('item', {type: 'delete', id: item.Get('id')}, function(response)
    {
        item.Remove({animation: 'fade'});

        if(then) { then(response); }
    }, 
    function(response)
    {
        if(fail) { fail(response); }
    });
});