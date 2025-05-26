collections.items.RenderCreate('item.html', function(files, item, data, attributes)
{
    let field = data('field');

    attributes['style'] = 'grid-column: span ' + field.Get('width');

    return `
        <label>
            ${dh.sanitize(field.Get('name').replaceAll('-', ' '))}
        </label>
        
        ${item.Render('type.' + field.Get('Type').Get('name'), {field})}
    `;
});