mdSources.FunctionCreate('list', function(addon)
{
    let list = [];

    $.each(addon.ItemsGet(), function(id, item)
    {
        list.push({
            value: id,
            title: item.Get('title'),
            group: item.Get('folder'), 
        });
    });

    return list;
});