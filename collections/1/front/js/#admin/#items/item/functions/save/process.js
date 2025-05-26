collections.items.FunctionCreate('item.save.process', function(addon, item, then = null, fail = null)
{
    let save = item.Fn('save.get');

    if(!save)
    {
        return;
    }

    save.id = item.Get('id');
    save.type = 'PUT';

    collections.ActionSend('item', save, function(response)
    {
        addon.Fn('fields', response.out.item);
        addon.ItemAdd(response.out.item, false);

        item.Fn('save.clear');

        if(then) { then(response, item); }
    }, 
    function(response)
    {
        if(fail) { fail(response); }
    });
});