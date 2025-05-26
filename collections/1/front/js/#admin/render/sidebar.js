collections.RenderCreate('sidebar', function(addon, data)
{
    html.sidebar.ItemAdd({
        id: 'collections',
        title: 'Collections',
        tabs: ['collections'],
        action: function()
        {
            if ( $dh.client().permissions.includes("collections.developer") || $dh.client().permissions.includes("*") ) {
                return `<div bind-click="create|collections" data-name="">${dh.icon('plus', 16, 'common')}</div>`;
            }
            return '';
        },
        search: function()
        {
            return html.Render('input', 
            {
                prefix: dh.icon('search', null, 'common', {style: 'margin-left: 7px'}),
                attributes: {
                    placeholder: 'Search Collections',
                    style: 'padding-left: 25px',
                    'dh-search': 'collections'
                }
            })
        },
        html: function()
        {
            return `
                <div id="collection-items-sidebar">
                    <items for="collections" data-group="main" type="prepend" field="html"></items>
                </div>
            `;
        }
    });

    return html.sidebar.Render('main', {id: 'collections'});
});