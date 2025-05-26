advanced.RenderCreate('items', function(addon, data)
{
    let html = '';
    let tag = data('tag');

    $.each(advanced.ItemsGet(), function(index, item)
    {
        let condition = item.Get('condition');
        let actions = item.Get('actions');

        if(condition && !condition(item, tag))
        {
            return true;
        }

        html += `
            <block for="html.group" data-id="${item.Get('id')}" style="order: ${item.Get('order')}">
                <div class="name">
                    ${item.Get('name')}
                    ${actions ? `<div class="actions">${actions(item, tag)}</div>` : ''}
                </div>
                <div class="dh-grid">${item.Get('html')(item, tag)}</div>
            </block>
        `;
    });

    return html;
});
