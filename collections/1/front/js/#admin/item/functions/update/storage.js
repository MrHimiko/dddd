collections.FunctionCreate('item.update.storage', function(addon, item, key, then = null, fail = null)
{
    collections.ActionSend('collection', {type: 'put', id: item.Get('id'), storage: {key}}, null, (response) =>
    {
        if(then) { then(response); }
    }, 
    (response) =>
    {
        if(fail) { fail(response); }
        popup.notification(response.message);
    });
});