collections.tabs.sections.OnItemRemove(function(addon, item)
{
    item.Get('Tab').FieldRemove('sections', item);
});