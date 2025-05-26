collections.items.FunctionCreate('item.save.clear', function(addon, item, key, value)
{
    item.Set('save', null);
});