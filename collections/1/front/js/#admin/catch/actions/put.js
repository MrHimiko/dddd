/* Collection */
collections.OnAction('put.collection.then', (addon, response, data) =>
{
    addon.ItemAdd(response.out.collection, false);
});

/* Tab */
collections.OnAction('put.tab.then', (addon, response, data) =>
{
    addon.tabs.ItemAdd(response.out.tab, false);
});

/* Section */
collections.OnAction('put.tab.section.then', (addon, response, data) =>
{
    addon.tabs.sections.ItemAdd(response.out.section, false);
});