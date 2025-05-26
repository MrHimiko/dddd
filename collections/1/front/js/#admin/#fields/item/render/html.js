collections.fields.RenderCreate('item.html', function(files, item, data, attributes)
{
    attributes['style'] = 'grid-column: span ' + item.Get('width');

    return `
        <div class="reorder">
            ${dh.icon('6-dots', 16, 'common')}
        </div>
        
        ${item.Get('name', true)}

        <div class="actions">
            ${dh.icon('pen', 16, 'common', {
                'bind-click': 'settings|collections.fields',
                'bind-item': item.Get('id')
            })}
            ${dh.icon('trash', 16, 'common', {
                'bind-click': 'remove|collections.fields',
                'bind-item': item.Get('id'),
                'bind-confirm': 'Are you sure you want to remove field?'
            })}
        </div>
    `;
});