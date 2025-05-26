advanced.OnReady(function() 
{
    advanced.ItemAdd({
        id: 'loop',
        name: 'Loop',
        order: 0,
        actions: function(item, tag)
        {
            let looped = advanced.Fn('looped', tag);

            return html.Render('input', {
                attributes: {
                    value: tag.Get('edit').identifier
                },
                select: () =>
                {
                    let list = [];

                    looped.forEach(function(value, index)
                    {   
                        list.push({title: index + 1, value})
                    });

                    return list;
                },
                onSelect: (target, item) =>
                {
                    let identifier = item.value.split('-');

                    if(identifier.length === 2)
                    {
                        edit.Fn('start', tag, 'builder.components.tags', identifier[1], identifier[0]);
                    }
                    else if(identifier.length === 1)
                    {
                        edit.Fn('start', tag, 'builder.components.tags', identifier[0]);
                    }
                }
            }, {class: 'h25', style: 'position: absolute; right: 15px; width: 75px'});
        },
        condition: function (item, tag) 
        {
            let looped = advanced.Fn('looped', tag);

            return looped.length > 1;
        },
        html: function (advanced, tag) 
        {
            return '';
        }
    });
});