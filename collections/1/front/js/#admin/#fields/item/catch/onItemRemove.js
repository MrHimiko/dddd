collections.fields.OnItemRemove(function(addon, item)
{
    item.Get('Section').FieldRemove('fields', item);
    item.Get('Collection').FieldRemove('fields', item);
});