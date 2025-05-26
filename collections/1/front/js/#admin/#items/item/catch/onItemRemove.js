collections.items.OnItemRemove(function(addon, item)
{
    item.Get('Collection').FieldRemove('items', item);
});