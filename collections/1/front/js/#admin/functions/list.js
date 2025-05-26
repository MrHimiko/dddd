collections.FunctionCreate('list', function(addon)
{
    let list = [];

    $.each(addon.ItemsGet(), (index, item) =>
    {
        list.push({title: item.Get('name'), value: item.Get('id')});
    });

    return list;
});