collections.tabs.sections.FunctionCreate('sortable', function(addon)
{
    mdLibraries.Fn('load', ['sortablejs'], () =>
    {
        let target = $('items[for="collections.tabs.sections"]');

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
                        let section = addon.ItemGet($(this).attr('data-id'));

                        section.Fn('reorder', index);
                    });
                },
            });
        });
    });
});