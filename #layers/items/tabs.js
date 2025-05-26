tabs.OnReady(function(tabs)
{
    tabs.ItemAdd({
        id: 'layers',
        name: 'Layers',
        order: 500,
        default: true,
        position: 'left',
        tabs: ['pages', 'components', 'layers'],
        html: function()
        {
            return {
                top: '',
                bottom: components.layers.Render('main'),
            }
        }
    });
});