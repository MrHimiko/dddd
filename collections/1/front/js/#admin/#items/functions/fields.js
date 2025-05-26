collections.items.FunctionCreate('fields', function(addon, item)
{
    item.fields = {};

    $.each(item, (key, value) =>
    {
        if(!['fields', 'id', 'order', 'type', 'collection', 'parent', 'name', 'slug', 'client', 'children', 'updated', 'created', 'published', 'seo', 'schedule'].includes(key))
        {
            item.fields[key] = value;
            delete item[key];
        }
    });
});