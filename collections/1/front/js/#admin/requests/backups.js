backups.OnRequest('include', (addon, request) => 
{
    request.value.push({title: 'Collections', value: 'collections', description: 'Include only collections (collections, fields, tabs, tab sections and items).'});
});