collections.RenderCreate('item.pagination', function(addon, item, data, attributes)
{
    return `
        ${html.Render('button', {
            title: 'Prev',
            onClick: () => 
            {
                let page = addon.GetTemp('page.' + item.Get('id'), 1);
                let filters = addon.GetTemp('filters.' + item.Get('id'), []);

                if(page >= 2)
                {
                    page = page - 1;

                    addon.SetTemp('page.' + item.Get('id'), page);
                    item.Replace('pagination');

                    $('#collection-items').html(item.Render('items', {page, filters, fetch: true}, {}, false));
                }
            }
        }, {class: 'silver'})}

        <span>${addon.GetTemp('page.' + item.Get('id'), 1)}</span>

        ${html.Render('button', {
            title: 'Next',
            onClick: () =>
            {
                let page = addon.GetTemp('page.' + item.Get('id'), 1);
                let filters = addon.GetTemp('filters.' + item.Get('id'), []);

                page = page + 1;

                addon.SetTemp('page.' + item.Get('id'), page);
                item.Replace('pagination');

                $('#collection-items').html(item.Render('items', {page, filters, fetch: true}, {}, false));
            }
        }, {class: 'silver'})}
    `;         
});