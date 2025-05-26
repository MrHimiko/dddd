components.layers.RenderCreate('main', function()
{
    let component = components.layers.GetTemp('component');

    if(!component)
    {
        return builder.Render('element.empty', {
            'image_url': 'https://global.divhunt.com/71a2af0a7955789a6563a9cc26ff7784_10721.png',
            'description': 'No selected element.'
        });
    }

    return component.Fn('render.layers');
});

