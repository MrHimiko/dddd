collections.FunctionCreate('create', function(addon, data = {}, then = null, fail = null)
{
    if(!('name' in data))
    {
        mdBugs.ItemAdd({message: 'Please provide name when creating collection.'});
        return false;
    }

    collections.ActionSend('collection', data, function(response)
    {
        let collection = collections.ItemAdd(response.out.collection);
        let tab = collections.tabs.ItemAdd(response.out.tab);

        if(then) { then(response, collection, tab); }
    }, 
    function(response)
    {
        if(fail) { fail(response); }
    });
});