collections.FunctionCreate('item.update.client', function(addon, item, client, then = null, fail = null)
{
    item.Set('client', client);
    
    collections.ActionSend('collection', {type: 'put', id: item.Get('id'), client}, null, (response) =>
    {
        if(then) { then(response); }
    }, 
    (response) =>
    {
        if(fail) { fail(response); }
        popup.notification(response.message);
    });
});