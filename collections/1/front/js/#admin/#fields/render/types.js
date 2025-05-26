collections.fields.RenderCreate('types', function(fields, data, attributes)
{
    let name = data('name', '', true);
    let section = data('section', 0);

    let types = '';

    $.each(fields.types.ItemsGet(), (index, item) =>
    {
        types = types + `
            <div modal-close bind-click="create|collections.fields" data-name="" data-section="${section}" data-type="${item.Get('id')}">
                <div class="icon">
                    <img src="${dh.sanitize(item.Get('icon').file)}">
                </div>

                <div class="information">
                    <h4>${item.Get('name', true)}</h4>
                    <p>${item.Get('description', true)}</p>
                </div>
            </div>  
        `;
    });

    return types;
});