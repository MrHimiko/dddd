content.RenderCreate('items', function(addon, data)
{
    let html = '';

    $.each(content.ItemsGet(), function(index, item)
    {
        let condition = item.Get('condition');

        if(condition && !condition(item, edit.Fn('get.tag')))
        {
            return true;
        }

        html += item.Render('html');
    });

    return html;
});
