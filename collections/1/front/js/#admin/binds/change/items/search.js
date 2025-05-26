collections.BindChange('items.search', function(addon, event, target, item)
{   
    let value = target.val();
    let filters = addon.GetTemp('filters.' + item.Get('id'), []);

    item.Replace('items', {fetch: true, search: value, filters});
});