collections.fields.FunctionCreate('sortable', function(addon)
{
    mdLibraries.Fn('load', ['sortablejs'], () =>
    {
        let target = $('items[for="collections.fields"]');

        $.each(target, function()
        {
            new Sortable($(this)[0], 
            {
                animation: 150,
                ghostClass: '',
                handle: '.reorder',
                onEnd: (event) =>
                {
                    $.each($(this).find('> item'), function(index, item)
                    {
                        let field = addon.ItemGet($(this).attr('data-id'));

                        field.Fn('reorder', index);
                    });
                },
            });
        });
    });
});