collections.tabs.OnItemRemove(function(addon, item)
{
    item.Push('html', {animation: 'fade'});

    item.Get('Collection').FieldRemove('tabs', item);
});