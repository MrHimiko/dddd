tabs.OnReady((tabs) =>
{
    tabs.ItemAdd({
        id: 'advanced',
        name: 'Advanced',
        order: 230,
        position: 'right',
        tabs: ['designer', 'content', 'advanced', 'interactions'],
        html: function()
        {
            if ( !$dh.client().permissions.includes("builder.developer") && !$dh.client().permissions.includes("*") ) return { top: '', bottom: designer.Render('no-permission' ) };

            let tag = edit.Fn('get.tag');
            return {
                top: '', 
                bottom: tag ? advanced.Render('items', {tag}) : advanced.Render('empty')
            };
        }
    });
});