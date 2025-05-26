mdSources.FunctionCreate('item.run', function(addon, item, properties = {}, filters = [], sort = '',  data = {}, callback = null)
{
    properties = JSON.parse(JSON.stringify(properties));
    filters = JSON.parse(JSON.stringify(filters));
    sort = mdVars.Fn('process', sort, data);

    $.each(properties, function(key, value)
    {
        properties[key] = mdVars.Fn('process', value, data);
    });

    $.each(filters, function(key, field)
    {
        filters[key].value = mdVars.Fn('process', field.value, data);
    });
    
    let object = JSON.stringify({id: item.Get('id'), properties, filters, sort});

    mdAjax.Fn('get').get({data: encodeURIComponent(object)}, null).url('/api/md.sources/run').run(null, function(response)
    {
        callback ? callback(response.out.data) : null;
    },
    function()
    {
        callback ? callback(null) : null;
    });
});