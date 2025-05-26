mdSources.RenderCreate('key', function(addon, data)
{
    let source = addon.GetTemp('source');
    let item = 'id' in source ? addon.ItemGet(source.id) : null;

    if(!item)
    {
        return '';
    }

    return `
        <p>Key</p>
        <div>
            ${html.Render('input', {
                onChange: (target, value) =>
                {
                    source.key = value;
                },
                attributes: {
                    value: 'key' in source ? (source.key ? source.key : 'value') : 'value'
                }
            })}
        </div>  
    `;
});