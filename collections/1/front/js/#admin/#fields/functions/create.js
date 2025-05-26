collections.fields.FunctionCreate('create', function(addon, data = {}, then = null, fail = null)
{
    if(!('name' in data) || !('section' in data) || !('field_type' in data))
    {
        mdBugs.ItemAdd({message: 'Please provide name & section & type when creating field.'});
        return false;
    }

    collections.ActionSend('field', data, function(response)
    {
        let field = collections.fields.ItemAdd(response.out.field);

        if(then) { then(response, field); }
    }, 
    function(response)
    {
        if(fail) { fail(response); }
    });
});