collections.tabs.RenderCreate('item.html', function(files, item, data, attributes)
{
    return `
        <span dh-updater="collection.tab.name.${item.Get('id')}">${item.Get('name')}</span>
    `;
});