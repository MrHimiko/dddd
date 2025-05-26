collections.tabs.FunctionCreate('item.remove', function(addon, item, then = null, fail = null)
{
    collections.ActionSend('tab', {type: 'delete', id: item.Get('id')}, (response) =>
    {
        item.Remove();
        
        if(then) { then(response); }
    }, 
    (response) =>
    {
        if(fail) { fail(response); }
    });
});