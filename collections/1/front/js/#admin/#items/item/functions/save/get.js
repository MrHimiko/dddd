collections.items.FunctionCreate('item.save.get', function(addon, item, key, value)
{
    let save = item.Get('save');

    if(!save || !Object.keys(save).length)
    {
        return null;
    }

    return save;
});