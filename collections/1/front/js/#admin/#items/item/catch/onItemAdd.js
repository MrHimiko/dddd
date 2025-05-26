collections.items.OnItemAdd(function(addon, item)
{
    item.Get('Collection').FieldAdd('items', item);
});