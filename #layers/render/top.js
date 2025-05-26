components.layers.RenderCreate('top', function()
{
    let component = components.layers.GetTemp('component');

    if(!component)
    {
        return `
            <h3>Layers</h3>
        `;
    }

    return `<h3>Layers</h3> `;
});