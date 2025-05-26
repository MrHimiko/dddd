collections.BindClick('import', function(addon, event, target)
{
    let collection = collections.ItemGet(target.attr('data-collection'));

    collection.Fn('import');
});