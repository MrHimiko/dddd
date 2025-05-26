mdSources.RenderCreate('repeat', function(addon, data)
{
    let source = addon.GetTemp('source');
    let item = 'id' in source ? addon.ItemGet(source.id) : null;

    if(!item)
    {
        return '';
    }

    return `
        <p>Repeat</p>
        <div>
            ${html.Render('input', {
                select: () =>
                {   
                    return [
                        {title: 'Yes', value: true, description: 'The element will be repeated as many times as there are items returned from the selected source.'},
                        {title: 'No', value: false, description: 'The element will be repeated only once, always returning the variables (items, count) that include all the items returned from the source.'}
                    ];
                },
                onSelect: (target, select) =>
                {
                    source.repeat = select.value;
                },
                attributes: {
                    value: 'repeat' in source ? source.repeat : true
                }
            })}
        </div>  
    `;
});