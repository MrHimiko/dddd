collections.items.FunctionCreate('create', function(addon, data = {}, then = null, fail = null)
{
    if(!('name' in data) || !('collection' in data))
    {
        mdBugs.ItemAdd({message: 'Please provide name & collection when creating item.'});
        return false;
    }

    collections.ActionSend('item', data, function(response)
    {
        collections.items.Fn('fields', response.out.item);

        let item = collections.items.ItemAdd(response.out.item);

        if(then) { then(response, item); }
    }, 
    function(response)
    {
        if(fail) { fail(response); }
    });
});