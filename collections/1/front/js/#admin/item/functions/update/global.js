collections.FunctionCreate('item.update.global', function(addon, item, enabled, password, then = null, fail = null)
{
    collections.ActionSend('collection', {type: 'put', id: item.Get('id'), global: {enabled, password}}, null, (response) =>
    {
        if(then) { then(response); }
    }, 
    (response) =>
    {
        if(fail) { fail(response); }
        popup.notification(response.message);
    });
});