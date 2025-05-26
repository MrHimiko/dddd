collections.RenderCreate('item.heading', function(addon, item, data, attributes)
{
    let share = addon.GetTemp('share');
    let search = data('search', '');

    let filters = addon.GetTemp('filters.' + item.Get('id'), []);

    return `
        <div class="left">
            <h3 dh-updater="collection.name.${item.Get('id')}">
                ${item.Get('name', true)} 
                <div dh-clipboard="${item.Get('id', true)}" class="dh-blue">#${item.Get('id', true)}</div>
            </h3>
            <p>${item.Get('count')} Items</p>
        </div>

        <div class="right">
            ${html.Render('input', {
                attributes: {
                    placeholder: 'Search items',
                    value: search,
                    'bind-change': 'items.search|collections',
                    'bind-item': item.Get('id')
                }
            })}

            ${html.Render('button', {
                title: 'Filters (' + filters.length + ')',
                attributes: {
                    'bind-click': 'filters|collections',
                    'data-collection': item.Get('id'),
                }
            }, {class: 'border'})}

            ${!share ? html.Render('dropdown', {
                select: () =>
                {
                    return [
                        {title: 'Publish', value: 'publish', description: 'Publish selected items.'},
                        {title: 'Unpublish', value: 'unpublish', description: 'Unpublish selected items.'},
                        {title: 'Delete', value: 'delete', description: 'Delete selected items.'}
                    ];
                },
                onSelect: (target, selected) =>
                {
                    collections.items.Fn('selected', item, selected.value);
                },
                html: () =>
                {
                    return html.Render('button', {
                        title: 'Selected (0)',
                    }, {class: 'border', id: 'dh-collections-items-select', style: 'display: none'})
                }
            }) : ''}

            ${!share && ($dh.client().permissions.includes("collections.developer") || $dh.client().permissions.includes("collections.writer") || $dh.client().permissions.includes("*")) ? 
                html.Render('button', {
                    title: 'Import',
                    attributes: {
                        'bind-click': 'import|collections',
                        'data-collection': item.Get('id'),
                    }
                }, {class: 'border'}) : ''
            }
              
              
            ${!share ? html.Render('button', {
                title: 'Export',
                href: `/api/collections/items.csv?id=${item.Get('id')}&download=true`,
                attributes: {
                    download: true,
                    target: '_BLANK'
                }
            }, {class: 'border'}) : ''}



            ${!share && ($dh.client().permissions.includes("collections.developer") || $dh.client().permissions.includes("collections.writer") || $dh.client().permissions.includes("*")) ? 
                html.Render('button', {
                    title: 'Add new item',
                    attributes: {
                        'bind-click': 'create|collections.items',
                        'data-collection': item.Get('id'),
                        'data-name': ''
                    }
                }) : ''
            }
              
        </div>
    `;
});