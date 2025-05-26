collections.fields.OnItemAdd(function(addon, item)
{
    item.Push('html', {animation: 'fade'});

    item.Get('Section').FieldAdd('fields', item);
    item.Get('Collection').FieldAdd('fields', item);
});