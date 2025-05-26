collections.tabs.sections.OnItemAdd(function(addon, item, type)
{
    if(type !== 'multiple')
    {
        item.Push('html', {animation: 'fade'});

        collections.fields.Fn('sortable');
    }

    item.Get('Tab').FieldAdd('sections', item);
});