collections.items.FunctionCreate('item.value', function(addon, item, field)
{
    let value = item.Get('fields')[field];
    let save = item.Fn('save.get');

    if(save && field in save)
    {
        value = save[field];
    }
    
    return value;
});