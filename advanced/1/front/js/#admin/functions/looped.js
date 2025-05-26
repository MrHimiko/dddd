advanced.FunctionCreate('looped', function(addon, tag)
{
    let symbol = tag.Get('edit').symbol;
    let targets;
    let looped = [];

    if(symbol)
    {
        targets = $(`main [dh-id="${tag.Get('id')}"][dh-symbol="${symbol}"]`); 
    }
    else
    {
        targets = $(`main [dh-id="${tag.Get('id')}"]:not([dh-symbol])`); 
    }

    $.each(targets, function()
    {
        let loop = $(this).attr('dh-loop');

        if(symbol)
        {
            loop = symbol + '-' + loop;
        }

        if(!looped.includes(loop))
        {
            looped.push(loop);
        }
    });

    return looped
});