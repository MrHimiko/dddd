collections.OnItemAdd(function(addon, item)
{
    let group = item.Get('name').split('/');

    if(group.length > 1)
    {
        item.Set('group', group[0].toLowerCase());

        if(!$('#collection-items-sidebar').find('items[data-group="'+group[0].toLowerCase()+'"]').length)
        {
            $('#collection-items-sidebar').append(`
                <div class="group" style="padding-top: 10px; margin-top: 10px; border-top: 1px solid var(--dh-scheme-1-border);">
                    <div class="name" style="font-size: 12px; margin-bottom: 5px;">${group[0]}</div>
                    <items for="collections" data-group="${group[0].toLowerCase()}" type="prepend" field="html"></items>
                </div>
            `);
        }

        item.Push('html');
    }
    else
    {
        item.Set('group', 'main');
        item.Push('html');
    }

    if(item.Get('nest'))
    {
        collections.tabs.ItemsAdd({
            id: 'nest.' + item.Get('id'),
            collection: item.Get('id'),
            name: item.Get('name') + ' (Children)'
        });
    }
});