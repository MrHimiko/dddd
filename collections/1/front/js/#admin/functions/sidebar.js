collections.FunctionCreate('sidebar', function(addon, open = true, then = null)
{
    let target = collections.RenderTarget('sidebar');

    if(open && target.hasClass('closed'))
    {
        target.removeClass('closed');
    }

    if(!open && !target.hasClass('closed'))
    {
        target.addClass('closed');
    }

    setTimeout(() => 
    {
        if(then) { then(); }
    }, 500);
});