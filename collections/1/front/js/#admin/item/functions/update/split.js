collections.FunctionCreate('item.update.split', function(addon, item, split, then = null, fail = null)
{
    item.Set('split', split);
    
    collections.ActionSend('collection', {type: 'put', id: item.Get('id'), split}, null, (response) =>
    {
        if(then) { then(response); }
    }, 
    (response) =>
    {
        if(fail) { fail(response); }
        popup.notification(response.message);
    });
});