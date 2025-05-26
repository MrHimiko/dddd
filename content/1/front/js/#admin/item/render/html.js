content.RenderCreate('item.html', function(addon, item, data, attributes)
{
    let tag = edit.Fn('get.tag');
    let actions = item.Get('actions');

    attributes['style'] = `order: ${item.Get('order')}`;

    if(!tag)
    {
        return '';
    }

    return `
        <block for="html.group" ${html.Fn('group', 'content-' + item.Get('id'))}>
            <div class="name">
                ${item.Get('name')}
                ${actions ? `<div class="actions">${actions(item, tag, data)}</div>` : ''}
            </div>
            <div class="dh-grid">${item.Get('html')(item, tag, data)}</div>
        </block>
    `;
});