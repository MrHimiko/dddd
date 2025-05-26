collections.BindClick('items.reload', function(addon, event, target, item)
{
    $('#collection-items').html(item.Render('items', {}, {}, false));
});