mdSources.RenderCreate('exclude_current', function(addon, data)
{
    let source = addon.GetTemp('source');
    let item = 'id' in source ? addon.ItemGet(source.id) : null;

    console.log(source);

    if(!item || !source)
    {
        return '';
    }

    if (!source.id.startsWith("collection.")) {return '';}

    return `
        <div style="display:flex; align-items:center; justify-content:space-between"> 
            <p style="font-weight:400; font-size:12px">Exclude current item</p>
            <div>
                ${html.Render('toggle', {
                        checked: 'exclude_current' in source ? source.exclude_current : true,
                        onToggle: (target, value) =>
                        {
                            source.exclude_current = value;
                        }
                    }, {class: 'silver small'})
                }
            </div>  
        </div>
    `;
});