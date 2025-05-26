collections.tabs.sections.FunctionCreate('create', function(addon, data = {}, then = null, fail = null)
{
    if(!('name' in data) || !('tab' in data) || !('collection' in data))
    {
        mdBugs.ItemAdd({message: 'Please provide name & tab & collection when creating section.'});
        return false;
    }

    collections.ActionSend('tab.section', data, function(response)
    {
        let section = collections.tabs.sections.ItemAdd(response.out.section);

        if(then) { then(response, section); }
    }, 
    function(response)
    {
        if(fail) { fail(response); }
    });
});