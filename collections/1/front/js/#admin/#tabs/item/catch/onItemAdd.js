collections.tabs.OnItemAdd(function(addon, item, type)
{
    if(type !== 'multiple')
    {
        item.Push('html', {animation: 'fade'}, {
            'bind-click': 'settings|collections',
            'data-collection': item.Get('collection'),
            'data-tab': item.Get('id')
        });
    }

    item.Get('Collection').FieldAdd('tabs', item);
});