collections.items.FunctionCreate('item.save.set', function(addon, item, key, value)
{
    let save = item.Get('save');

    if(!save || typeof save !== 'object')
    {
        save = {};
    }

    save[key] = value;
    item.Set('save', save);
});