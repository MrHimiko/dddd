collections.tabs.FunctionCreate('create', function(addon, data = {}, then = null, fail = null)
{
    if(!('name' in data) || !('collection' in data))
    {
        mdBugs.ItemAdd({message: 'Please provide name & collection when creating tab.'});
        return false;
    }

    collections.ActionSend('tab', data, (response) =>
    {
        let item = collections.tabs.ItemAdd(response.out.tab);

        if(then) { then(response, item); }
    }, 
    (response) =>
    {
        if(fail) { fail(response); }
    });
});