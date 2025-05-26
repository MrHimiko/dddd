collections.items.FunctionCreate('item.duplicate', function(addon, item, then = null, fail = null)
{
    collections.ActionSend('item.duplicate', {id: item.Get('id')}, function(response)
    {
        let item = collections.items.ItemAdd(response.out.item);

        if(then) { then(response, item); }
    }, 
    function(response)
    {
        if(fail) { fail(response); }
    });
});