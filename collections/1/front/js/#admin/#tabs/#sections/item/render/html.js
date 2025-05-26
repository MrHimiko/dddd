collections.tabs.sections.RenderCreate('item.html', function(files, section, data, attributes)
{
    let item = data('item')
    let fields = '';
    let create = '';
 
    section.Get('fields[]').forEach((field) =>
    {
        fields += item ? item.Render('html', {field}) : field.Render('html');
    });

    if(!item)
    {
        create = html.Render('button', {
            title: 'Add new field',
            attributes: {
                'bind-click': 'create|collections.fields',
                'data-section': section.Get('id'),
            }
        }, {class: 'silver w100'});
    }

    return `
        <div class="top">
            <h3>
                <span class="reorder" style="${item ? 'display: none' : ''}">
                    ${dh.icon('6-dots', 16, 'common')}
                </span>

                <span style="font-weight: 500; font-size: 12px; margin-right: 10px;"> Section title: </span>

                ${item ? section.Get('name') : 
                    html.Render('input', {
                        action: ['tab.section|collections', section.Get('id'), 'name'],
                        attributes: {
                            value: section.Get('name')
                        }
                    })
                }
            </h3>
            ${item ? '' : html.Render('button', {
                icon: 'trash',
                attributes: {
                    'bind-click': 'remove|collections.tabs.sections',
                    'bind-item': section.Get('id'),
                    'bind-confirm': 'Are you sure you want to remove section? All fields will be removed as well.'
                }
            }, {class: 'icon'})}
        </div>

        <items for="collections.fields" field="html" data-section="${section.Get('id', true)}" class="fields">${fields}</items>
        ${create}
    `;
});