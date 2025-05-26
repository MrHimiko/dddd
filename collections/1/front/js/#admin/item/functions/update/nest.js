collections.FunctionCreate('item.update.nest', function(addon, item, nest, then = null, fail = null)
{
    item.Set('nest', !!nest);
    
    collections.ActionSend('collection', {type: 'put', id: item.Get('id'), nest: !!nest}, null, (response) =>
    {
        if(then) { then(response); }
    }, 
    (response) =>
    {
        if(fail) { fail(response); }
        popup.notification(response.message);
    });
});