collections.OnItemSet(function(addon, key, value, item)
{
    if(key === 'active')
    {
        item.Replace('html');
    }
    else if(key === 'nest')
    {
        if(value)
        {
            collections.tabs.ItemsAdd({
                id: 'nest.' + item.Get('id'),
                collection: item.Get('id'),
                name: item.Get('name') + ' (Children)'
            });
        }
        else
        {
            collections.tabs.ItemGet('nest.' + item.Get('id'), (item) =>
            {
                item.Remove();
            });
        }
    }
});