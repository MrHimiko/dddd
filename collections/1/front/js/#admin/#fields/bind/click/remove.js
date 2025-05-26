collections.fields.BindClick('remove', function(addon, event, target, item)
{
    item.Fn('remove', null, (response) =>
    {
        popup.notification(response.message);
    });
});