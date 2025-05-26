collections.FunctionCreate('item.update.variable', function(addon, item, enabled, format, then = null, fail = null)
{
    collections.ActionSend('collection', {type: 'put', id: item.Get('id'), variable: {enabled, format}}, null, (response) =>
    {
        if(then) { then(response); }
    }, 
    (response) =>
    {
        if(fail) { fail(response); }
        popup.notification(response.message);
    });
});