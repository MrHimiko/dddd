collections.RenderCreate('item.html', function(files, item, data, attributes)
{
    if(item.Get('active'))
    {
        attributes['class'] = 'active';
    }

    attributes['search-id'] = 'collections';
    attributes['search-value'] = item.Get('name');
    attributes['bind-click'] = 'active|collections';

    let name = item.Get('name').split('/');

    if(name.length > 1)
    {
        name.shift(); 
    }

    name = name.join('/');

    return `
        <div class="active">
            <div class="left"> 
                ${dh.icon('app-collections', 18, 'common')}
                <span dh-updater="collection.name.${item.Get('id')}" class="dh-ellipsis1">${dh.sanitize(name)}</span>
            </div>
            <div class="right" bind-click="settings|collections" data-collection="${item.Get('id', true)}">
                ${$dh.client().permissions.includes("collections.developer") || $dh.client().permissions.includes("*") ? 
                    dh.icon('settings', 14, 'common') : ''
                }
            </div>
        </div>
    `;
});