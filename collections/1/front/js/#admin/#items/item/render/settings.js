collections.items.RenderCreate('item.settings', function(files, item, data, attributes)
{
    attributes['class'] = 'dh-scrollbar';
    
    let tab = data('tab');
    let save = item.Fn('save.get');
    let share = collections.GetTemp('share');
    let key = mdVars.Fn('process', item.Get('Collection').Get('storage').key, {item: item.data});

    if(!tab)
    {
        tab = item.Get('Collection').Get('Tab');
    }

    let publish_button = `                        
        <div class="row s3">
            <span>Published</span>
        </div>
        <div class="row s9 end">
            ${html.Render('toggle', {
                checked: (save && 'published' in save) ? save['published'] : item.Get('published'),
                onToggle: (target, value) =>
                {
                    item.Fn('save.set', 'published', value);
                }
            }, {style: 'width: auto'})}
        </div>
    `;

    let scheduling = `                
    <block for="html.group">
        <div class="name">Scheduling</div>
        <div class="description">Set a date range for when this item will be accessible to the user.</div>
        <div class="dh-grid">
            <div class="row s6">
                ${html.Render('date', {
                    attributes: {
                        placeholder: 'From',
                        value: (save && 'schedule.from' in save) ? save['schedule.from'] : item.Get('schedule').from
                    },
                    onChange: (target, value) =>
                    {
                        item.Fn('save.set', 'schedule.from', value ? value : 0);
                    }
                })}
            </div>
            <div class="row s6">
                ${html.Render('date', {
                    attributes: {
                        placeholder: 'To',
                        value: (save && 'schedule.to' in save) ? save['schedule.to'] : item.Get('schedule').to
                    },
                    onChange: (target, value) =>
                    {
                        item.Fn('save.set', 'schedule.to', value ? value : 0);
                    }
                })}
            </div>
        </div>
    </block>`;
    

    if (!$dh.client().permissions.includes("collections.publish") && !$dh.client().permissions.includes("*")) {
        publish_button = "";
        scheduling = "";
    }

    return `
        <div class="actions">
            <div class="left" bind-click="save|collections.items" bind-item="${item.Get('id', true)}">
                ${dh.icon('arrow-left', '18', 'common')}
                Go back
            </div>

            <div class="right">
                ${!share ? html.Render('dropdown', {
                    html: () =>
                    {
                        return html.Render('button', {
                            icon: 'settings',
                            attributes: {
                                'modal-hover': 'Additional Settings',
                            }
                        }, {class: 'icon'})
                    },
                    select: () =>
                    {
                        return [
                            {title: 'Import JSON', value: 'import'},
                            {title: 'Export JSON', value: 'export'},
                        ]
                    },
                    onSelect: (target, selected) =>
                    {
                        if(selected.value === 'import')
                        {
                            item.Fn('json.import');
                        }
                        else if(selected.value === 'export')
                        {
                            item.Fn('json.export');
                        }
                    }
                }) : ''}

                ${$dh.client().permissions.includes("collections.developer") || $dh.client().permissions.includes("*") ? 
                    html.Render('button', {
                        icon: 'trash',
                        attributes: {
                            'bind-click': 'remove|collections.items',
                            'bind-item': item.Get('id'),
                            'bind-confirm': 'Are you sure you want to remove item?',
                            'modal-hover': 'Remove Item',
                        },
                        class: 'icon'
                    }) : ''
                }

                ${!share ? html.Render('button', {
                    icon: 'duplicate',
                    attributes: {
                        'bind-click': 'duplicate|collections.items',
                        'bind-item': item.Get('id'),
                        'bind-confirm': 'Are you sure you want to duplicate item?',
                        'modal-hover': 'Duplicate Item',
                    }
                }, {class: 'icon'}) : ''}

                ${html.Render('button', {
                    title: 'Preview',
                    attributes: {
                        'bind-click': 'save|collections.items',
                        'bind-item': item.Get('id', true),
                        'data-preview': true,
                        'save': true
                    }
                }, {class: 'silver'})}

                ${html.Render('button', {
                    title: 'Finish Editing',
                    attributes: {
                        'bind-click': 'save|collections.items',
                        'bind-item': item.Get('id', true),
                        'save': true
                    }
                })}
            </div>
        </div>

        <h2 class="dh-ellipsis1" dh-updater="collection.item.name.${item.Get('id')}">
            ${item.Get('name')}
        </h2>

        ${item.Get('Collection').Render('tabs', {tab, item})}

        <div class="settings">
            <div class="sections dh-scrollbar">
                ${item.Get('Collection').Render('sections', {tab, item})}
            </div>

            <div class="information dh-scrollbar">
                <block for="html.group">
                    <div class="name">Information</div>
                    <div class="dh-grid">
                        <div class="row s3">
                            <span>Author</span>
                        </div>
                        <div class="row s9 end">
                            ${item.Get('client') ? (item.Get('client')['first.name'] + ' ' + item.Get('client')['last.name']) : 'Guest'}
                        </div>

                        <div class="row s3">
                            <span>Updated</span>
                        </div>
                        <div class="row s9 end">
                            ${item.Get('updated').split('.')[0]}
                        </div>

                        <div class="row s3">
                            <span>Created</span>
                        </div>
                        <div class="row s9 end">
                            ${item.Get('created').split('.')[0]}
                        </div>

                        ${publish_button}

                        <div class="row s3">
                            <span>ID</span>
                        </div>
                        <div class="row s9 end">
                            <span dh-clipboard="${item.Get('id', true)}" class="dh-blue">#${item.Get('id', true)}</span>
                        </div>
                    </div>
                </block>

                ${scheduling}

                <block for="html.group">
                    <div class="name">SEO</div>
                    <div class="dh-grid">
                        <div class="row">
                            <span>Title</span>
                        </div>
                        <div class="row">
                            ${html.Render('input', {
                                attributes: {
                                    placeholder: 'Meta Title',
                                    value: (save && 'seo.title' in save) ? save['seo.title'] : item.Get('seo').title
                                },
                                onChange: (target, value) =>
                                {
                                    item.Fn('save.set', 'seo.title', value);
                                }
                            })}
                        </div>
                        <div class="row">
                            <span>Description</span>
                        </div>
                        <div class="row">
                            ${html.Render('textarea', {
                                value: (save && 'seo.description' in save) ? save['seo.description'] : item.Get('seo').description,
                                attributes: {
                                    placeholder: 'Meta Description'
                                },
                                onChange: (target, value) =>
                                {
                                    item.Fn('save.set', 'seo.description', value);
                                }
                            })}
                        </div>
                        <div class="row">
                            <span>Cover</span>
                        </div>
                        <div class="row">
                            ${storage.Render('upload.image', {
                                value: (save && 'seo.cover' in save) ? save['seo.cover'] : item.Get('seo').cover,
                                key: key ? (key + '') : null,
                                onChange: (target, value) =>
                                {
                                    item.Fn('save.set', 'seo.cover', value);
                                }
                            })}
                        </div>
                    </div>
                </block>
            </div>
        </div>  
    `;
});