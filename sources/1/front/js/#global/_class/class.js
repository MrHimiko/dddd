mdSources.SetReload(false);

mdSources.FieldAdd('title');
mdSources.FieldAdd('folder');
mdSources.FieldAdd('description');

mdSources.FieldAdd('properties', null, (value) =>
{
    return Object.keys(value).length ? value : null;
});

mdSources.FieldAdd('sort', null, (value) =>
{
    return Object.keys(value).length ? value : null;
});

mdSources.FieldAdd('fields', null, (value) =>
{
    return Object.keys(value).length ? value : null;
});

mdSources.FieldAdd('operators', null, (value) =>
{
    return Object.keys(value).length ? value : null;
});

$dh.sources = function()
{
    return mdSources.ItemsRaw();
};

$dh.source = function(id, properties = {}, filters = [], sort = '', data = {}, callback = null)
{
    let source = mdSources.ItemGet(id);

    if(!source)
    {
        return callback ? callback([]) : [];
    }

    source.Fn('run', properties, filters, sort, data, callback);
};