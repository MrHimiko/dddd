collections.tabs.RenderCreate('item.sections', function(files, tab, data, attributes)
{
    let content = '';
    let item = data('item');
    let save = item ? item.Fn('save.get') : null
    let general = '';
    let nest = '';

    tab.Get('sections[]').forEach((section) =>
    {
        content += section.Render('html', {item}, {
            class: item ? 'item' : ''
        });
    });

    if(item && (tab.Get('id') + '').includes('nest.'))
    {   
        nest = `
            <item class="item" for="collections.tabs.sections" field="html">
                <div class="dh-flex jcsb">
                    <h3></h3>
                    ${html.Render('button', {
                        title: 'Add new item',
                        attributes: {
                            'bind-click': 'create|collections.items',
                            'data-collection': item.Get('collection'),
                            'data-parent': item.Get('id'),
                            'data-name': '',
                        }
                    })}
                </div>

                <items for="collections.fields" field="html" class="fields">
                    <item for="collections.items" style="grid-column: span 12" field="html" class="i6c195252">
                        ${item.Render('children', {fetch: true})}
                    </item>
                </items>
            </item>
        `;
    }

    if(item && tab.Get('id') === item.Get('Collection').Get('Tab').Get('id'))
    {
        general = `
            <item class="item" for="collections.tabs.sections" field="html">
                <h3>Basic</h3>

                <items for="collections.fields" field="html" class="fields">
                    <item for="collections.items" style="grid-column: span 6" field="html" class="i6c195252">
                        <label>
                            Name
                        </label>
                        
                        ${html.Render('input', {
                            attributes: {
                                placeholder: 'Item name',
                                value: (save && 'name' in save) ? save['name'] : item.Get('name'),
                            },
                            onChange: (target, value) =>
                            {
                                dh.updater('collection.item.name.' + item.Get('id'), value);
                                item.Fn('save.set', 'name', value);
                            }
                        })}
                    </item>

                    <item for="collections.items" style="grid-column: span 6" field="html" class="i6c195252">
                        <label>
                            Slug
                        </label>
                        
                        ${html.Render('input', {
                            attributes: {
                                placeholder: 'Item slug',
                                value: (save && 'slug' in save) ? save['slug'] : item.Get('slug'),
                            },
                            onChange: (target, value) =>
                            {
                                item.Fn('save.set', 'slug', value);
                            }
                        })}
                    </item>
                </items>
            </item>
        `;
    }

    return `
        <items for="collections.tabs.sections" field="html" data-collection="${tab.Get('collection')}">${general}${nest}${content}</items>
    `;
});