tabs.OnReady((tabs) =>
{
    tabs.ItemAdd({
        id: 'content',
        name: 'Settings',
        order: 230,
        position: 'right',
        tabs: ['designer', 'content', 'advanced', 'interactions'],
        html: function()
        {
            let tag = edit.Fn('get.tag');

            return {
                top: '', 
                bottom: tag ? content.Render('items') : content.Render('empty')
            };
        }
    });
});