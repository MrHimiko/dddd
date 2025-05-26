mdSources.RenderCreate('sort', function(addon, data)
{
    let source = addon.GetTemp('source');
    let item = 'id' in source ? addon.ItemGet(source.id) : null;

    if(!item || !item.Get('sort'))
    {
        return '';
    }

    let list = [];

    $.each(item.Get('sort'), (value, title) =>
    {
        list.push({group: 'Sort', title, value});
    });

    return `
        <p>Sort</p>
        <div>
            ${html.Render('input', {
                select: () =>
                {   
                    return list;
                },
                onChange: (target, value) =>
                {
                    source.sort = value ? value : null;
                },
                attributes: {
                    placeholder: 'Sort by',
                    value: source.sort
                }
            })}
        </div>  
    `;
});