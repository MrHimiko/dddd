collections.RenderCreate('item.settings', function(files, item, data, attributes)
{


        attributes['class'] = 'dh-scrollbar';
    

        let tab = data('tab') ? data('tab') : item.Get('Tab');

        this.init = () =>
        {
            let html = '';

            if (!$dh.client().permissions.includes("collections.developer") && !$dh.client().permissions.includes("*")) {
                return builder.Render('element.empty', {
                    'image': dh.icon('no-permission', 100),
                    'description': 'You dont have permission to edit collection settings.'
                });
            }

            html += this.actions();
            html += this.name();
            html += this.tabs();

            html += `
                <div class="settings">
                    ${this.sections()}
                    ${this.informations()}
                </div>
            `;

            return html;
        };



        this.actions = () => 
        {
            return `
                <div class="actions">
                    <div class="left" modal-close="true">
                        ${dh.icon('arrow-left', '18', 'common')}
                        Go back
                    </div>

                    <div class="right">
                        ${html.Render('button', {
                            icon: 'trash',
                            attributes: {
                                'modal-hover': 'Remove Collection',
                                'bind-click': 'remove|collections',
                                'bind-item': item.Get('id'),
                                'bind-confirm': 'Are you sure you want to remove collection?'
                            }
                        }, {class: 'icon'})}

                        ${html.Render('button', {
                            title: 'Finish Editing',
                            attributes: {
                                'bind-click': 'items.reload|collections',
                                'bind-item': item.Get('id'),
                                'modal-close': true
                            }
                        })}
                    </div>
                </div>
            `;
        };

        this.name = () => 
        {
            return `
                <h2 class="dh-ellipsis1" dh-updater="collection.name.${item.Get('id')}">
                    ${item.Get('name')}
                </h2>
            `;
        };




        this.tabs = () =>
        {
            return item.Render('tabs', {tab});
        };

        this.sections = () =>
        {
            let sections = '';

            if(tab)
            {
                sections =  `
                    ${tab.Render('sections')}
            
                    ${html.Render('button', {
                        title: 'Add new section',
                        attributes: {
                            'bind-click': 'create|collections.tabs.sections',
                            'data-name': '',
                            'data-tab': tab.Get('id')
                        }   
                    }, {class: 'brand-opacity'})}
                `;
            }
            else
            {
                sections = html.Render('empty', {
                    icon: dh.icon('app-collections', 20, 'common'),
                    title: 'Tabs',
                    description: 'Create first tab to get started.',
                    button: html.Render('button', {
                        title: 'Create',
                        attributes: {
                            'bind-click': 'create|collections.tabs',
                            'data-name': '',
                            'data-collection': item.Get('id')
                        }
                    })
                }, {class: 'bg2'});
            }

            return `
                <div class="sections dh-scrollbar">
                    ${sections}
                </div>
            `;
        };

        this.informations = () =>
        {
            let items = [];

            /* Tab Settings */
            if(tab)
            {
                items.push(`
                    <block for="html.group">
                        <div class="name">Tab</div>
                        <div class="dh-grid">
                            <div class="row">
                                ${html.Render('input', {
                                    action: ['tab|collections', tab.Get('id'), 'name'],
                                    attributes: {
                                        placeholder: 'Name',
                                        value: tab.Get('name')
                                    },
                                    onChange: (target, value) =>
                                    {
                                        dh.updater('collection.tab.name.' + tab.Get('id'), value);
                                    }
                                })}
                            </div>
                            <div class="row s3">
                                <span>Actions</span>
                            </div>
                            <div class="row s9 end">
                                ${html.Render('button', {
                                    icon: 'trash',
                                    attributes: {
                                        'bind-click': 'remove|collections.tabs',
                                        'bind-item': tab.Get('id'),
                                        'bind-confirm': 'Are you sure you want to remove tab. This will remove all tab sections and fields.',
                                        'modal-hover': 'Remove Tab',
                                        
                                    }
                                }, {style: 'width: 30px'})}
                            </div>
                        </div>
                    </block>
                `);
            }




    
            /* Collection Settings */
            items.push(`
                <block for="html.group">
                    <div class="name">Collection</div>
                    <div class="dh-grid">
                        <div class="row">
                            <span>Name</span>
                        </div>
                        <div class="row">
                            ${html.Render('input', {
                                action: ['collection|collections', item.Get('id'), 'name'],
                                attributes: {
                                    placeholder: 'Name',
                                    value: item.Get('name')
                                },
                                onChange: (target, value) =>
                                {
                                    dh.updater('collection.name.' + item.Get('id'), value);
                                }
                            })}
                        </div>

                        <div class="row">
                            <span>Description</span>
                        </div>
                        <div class="row">
                            ${html.Render('textarea', {
                                action: ['collection|collections', item.Get('id'), 'description'],
                                value: item.Get('description'),
                                attributes: {
                                    placeholder: 'Description',
                                },
                            })}
                        </div>
                            
                        <div class="row">

                        </div>


                    </div>
                </block>
            `);
            
            items.push(admin.Fetch('sitemap', {}, (response) => {
                return  `
                <block for="html.group">

                    <div class="name">Sitemap</div>
                    <div class="dh-grid">
                        <div class="row"> 
                            <span style="text-transform: none;"> For single-page collections like Blogs, adding pages to the sitemap is crucial for search engines like Google to discover and index them effectively. </span>
                        </div>
                        <div>
                            ${html.Render('toggle', {
                                checked: response.sitemap.includes('@collection.' + item.Get('id')),
                                onToggle: (target, value) =>
                                {
                                    seo.Fn('sitemap.toggle.item', '@collection.' + item.Get('id'));
                                }
                            }, {class: ''})}
                        </div>
                    </div>
                </div>`;
            }));


            items = this.variable(items);
            items = //this.share(items);
            items = this.nest(items);
            items = // this.global(items);
            items = this.storage(items);
            items = this.split(items);
            items = this.ownership(items);

            return `
                <div class="information dh-scrollbar">
                    ${items.join('')}
                </div>
            `;
        };

        this.variable = (items) =>
        {
            let variable = item.Get('variable');

            items.push(`
                <block for="html.group">
                    <div class="name">Variable</div>
                    <div class="description">Store collections items in global variable. Items will be cached and globally available across your website.</div>
                    <div class="dh-grid">
                        <div class="row" id="dh-collection-variable" style="display: ${variable.enabled ? 'none' : 'block'}">
                            ${html.Render('button', {
                                title: 'Configure',
                                onClick: (target, value) =>
                                {
                                    $('#dh-collection-variable-settings').show();
                                    $('#dh-collection-variable').hide();

                                    item.Fn('update.variable', true, 'array');
                                }
                            }, {class: 'w100'})}
                        </div>
                        <div class="row" id="dh-collection-variable-settings" style="display: ${variable.enabled ? 'block' : 'none'}">
                            <div class="dh-grid">
                                <div class="row">
                                    <span>Format</span>
                                </div>
                                <div class="row">
                                    ${html.Render('input', {
                                        attributes: {
                                            value: variable.format
                                        },
                                        select: () =>
                                        {
                                            return [
                                                {title: 'Array', value: 'array', description: 'Items will be cached as an array.'},
                                                {title: 'Object (ID)', value: 'object-id', description: 'Items will be cached as object, in which items ID will be used for object keys'},
                                                {title: 'Object (Slug)', value: 'object-slug', description: 'Items will be cached as object, in which items slug will be used for object keys.'},
                                            ];
                                        },
                                        onSelect: (target, selected) =>
                                        {
                                            item.Fn('update.variable', true, selected.value);
                                        }
                                    })}
                                </div>
                                <div class="row">
                                    ${html.Render('button', {
                                        title: 'Unset',
                                        tooltip: 'Unset Collection Variable',
                                        onClick: () =>
                                        {
                                            item.Fn('update.variable', false, 'array');

                                            $('#dh-collection-variable-settings').hide();
                                            $('#dh-collection-variable').show();
                                        }
                                    }, {class: 'border dh-flex jcfe'})}    
                                </div>
                            </div>
                        </div>
                    </div>
                </block>
            `);

            return items;
        };

        this.share = (items) =>
        {
            let domain = $dh.domain().link;

            items.push(`
                <block for="html.group">
                    <div class="name">Share</div>
                    <div class="description">Publicly share collection making it visible to non-registered users.</div>
                    <div class="dh-grid">
                        <div class="row" id="collection-share-toggle" style="display: ${item.Get('share') ? 'none' : 'block'}">
                            ${html.Render('button', {
                                title: 'Configure',
                                onClick: (target, value) =>
                                {
                                    $('#collection-share').show().find('input').focus();
                                    $('#collection-share-toggle').hide();
                                }
                            }, {class: 'w100'})}
                        </div>
                        <div class="row" id="collection-share" style="display: ${item.Get('share') ? 'block' : 'none'}">
                            <div class="dh-grid">
                                <div class="row">
                                    <span>Slug</span>
                                </div>
                                <div class="row">
                                    ${html.Render('input', {
                                        action: ['collection|collections', item.Get('id'), 'share'],
                                        attributes: {
                                            id: 'collection-share-input',
                                            placeholder: 'my-awesome-collection',
                                            value: item.Get('share')
                                        },
                                        suffix: html.Render('button', {icon: 'link'}, 
                                        {
                                            id: 'collection-share-link',
                                            style: 'pointer-events: auto',
                                            'modal-hover': 'Copy Link',
                                            'dh-clipboard': `${domain}/collections/${item.Get('share')}`
                                        }),
                                        onInput: (target, value) =>
                                        {
                                            target.val(dh.slug(value));
                                        },
                                        onChange: (target, value) =>
                                        {
                                            $('#collection-share-link').attr('dh-clipboard', `${domain}/collections/${dh.slug(value)}`);

                                            if(!value)
                                            {
                                                $('#collection-share').hide();
                                                $('#collection-share-toggle').show();
                                            }
                                            else
                                            {
                                                $('#collection-share').show();
                                                $('#collection-share-toggle').hide();
                                            }
                                        }
                                    })}
                                </div>

                                <div class="row">
                                    ${html.Render('button', {
                                        title: 'Unset',
                                        tooltip: 'Unshare collection.',
                                        onClick: () =>
                                        {
                                            $('#collection-share-input').val('').trigger('change');
                                        }
                                    }, {class: 'border dh-flex jcfe'})}    
                                </div>
                            </div>
                        </div>
                    </div>
                </block>
            `);

            return items;
        };

        this.nest = (items) =>
        {
            items.push(`
                <block for="html.group">
                    <div class="name">Nest</div>
                    <div class="description">Allow creating (nesting) sub-items as children for each individual item.</div>
                    <div class="dh-grid">
                        <div class="row" id="dh-collection-nest-toggle" style="display: ${item.Get('nest') ? 'none' : 'block'}">
                            ${html.Render('button', {
                                title: 'Configure',
                                onClick: (target, value) =>
                                {
                                    item.Fn('update.nest', true);

                                    $('#dh-collection-nest-toggle').hide();
                                    $('#dh-collection-nest-settings').show();
                                }
                            }, {class: 'w100'})}
                        </div>
                        <div class="row" id="dh-collection-nest-settings" style="display: ${item.Get('nest') ? 'block' : 'none'}">
                            ${html.Render('button', {
                                title: 'Unset',
                                tooltip: 'Unset Collection Nest',
                                onClick: () =>
                                {
                                    item.Fn('update.nest', false);

                                    $('#dh-collection-nest-toggle').show();
                                    $('#dh-collection-nest-settings').hide();
                                }
                            }, {class: 'border dh-flex jcfe'})}    
                        </div>
                    </div>
                </block>
            `);

            return items;
        };

        this.global = (items) =>
        {
            let global = item.Get('global');

            items.push(`
                <block for="html.group">
                    <div class="name">Global</div>
                    <div class="description">If enabled, other websites will be able to see and display collection items on their websites.</div>
                    <div class="dh-grid">
                        <div class="row" id="dh-collection-global" style="display: ${global.enabled ? 'none' : 'block'}">
                            ${html.Render('button', {
                                title: 'Configure',
                                onClick: (target, value) =>
                                {
                                    $('#dh-collection-global-settings').show();
                                    $('#dh-collection-global').hide();

                                    item.Fn('update.global', true, null);
                                }
                            }, {class: 'w100'})}
                        </div>
                        <div class="row" id="dh-collection-global-settings" style="display: ${global.enabled ? 'block' : 'none'}">
                            <div class="dh-grid">
                                <div class="row">
                                    <span>Password</span>
                                </div>
                                <div class="row">
                                    ${html.Render('input', {
                                        attributes: {
                                            placeholder: 'Password',
                                            value: global.password ? '**********' : ''
                                        },
                                        onChange: (target, value) =>
                                        {
                                            if(value)
                                            {
                                                target.val('**********');
                                            }

                                            item.Fn('update.global', true, value);
                                        }
                                    })}
                                </div>
                                <div class="row">
                                    ${html.Render('button', {
                                        title: 'Unset',
                                        tooltip: 'Unset Collection Global',
                                        onClick: () =>
                                        {
                                            item.Fn('update.global', false, null);

                                            $('#dh-collection-global-settings').hide();
                                            $('#dh-collection-global').show();
                                        }
                                    }, {class: 'border dh-flex jcfe'})}    
                                </div>
                            </div>
                        </div>
                    </div>
                </block>
            `);

            return items;
        };

        this.storage = (items) =>
        {
            let storage = item.Get('storage');

            items.push(`
                <block for="html.group">
                    <div class="name">Storage</div>
                    <div class="description">When activated, storage uploads will be grouped by key, and the media popup will exclusively display uploaded assets associated with the selected key.</div>
                    <div class="dh-grid">
                        <div class="row" id="dh-collection-storage" style="display: ${storage.key ? 'none' : 'block'}">
                            ${html.Render('button', {
                                title: 'Configure',
                                onClick: (target, value) =>
                                {
                                    $('#dh-collection-storage-settings').show();
                                    $('#dh-collection-storage').hide();
                                }
                            }, {class: 'w100'})}
                        </div>
                        <div class="row" id="dh-collection-storage-settings" style="display: ${storage.key ? 'block' : 'none'}">
                            <div class="dh-grid">
                                <div class="row">
                                    <span>Key</span>
                                </div>
                                <div class="row">
                                    ${html.Render('input', {
                                        attributes: {
                                            placeholder: '$item->get(\'id\')',
                                            value: storage.key
                                        },
                                        onChange: (target, value) =>
                                        {
                                            item.Fn('update.storage', value ? value : null);
                                        }
                                    })}
                                </div>
                                <div class="row">
                                    ${html.Render('button', {
                                        title: 'Unset',
                                        tooltip: 'Unset Collection Variable',
                                        onClick: () =>
                                        {
                                            item.Fn('update.storage', null);

                                            $('#dh-collection-storage-settings').hide();
                                            $('#dh-collection-storage').show();
                                        }
                                    }, {class: 'border dh-flex jcfe'})}    
                                </div>
                            </div>
                        </div>
                    </div>
                </block>
            `);

            return items;
        };

        this.split = (items) =>
        {
            items.push(`
                <block for="html.group">
                    <div class="name">Split</div>
                    <div class="description">When enabled, organization admins will have the ability to view and modify only their own collection items, with the exception of the collection creator.</div>
                    <div class="dh-grid">
                        <div class="row" id="dh-collection-split-toggle" style="display: ${item.Get('split') ? 'none' : 'block'}">
                            ${html.Render('button', {
                                title: 'Configure',
                                onClick: (target, value) =>
                                {
                                    item.Fn('update.split', 'client');

                                    $('#dh-collection-split-toggle').hide();
                                    $('#dh-collection-split-settings').show();
                                }
                            }, {class: 'w100'})}
                        </div>
                        <div class="row" id="dh-collection-split-settings" style="display: ${item.Get('split') ? 'block' : 'none'}">
                            ${html.Render('button', {
                                title: 'Unset',
                                tooltip: 'Unset Collection Nest',
                                onClick: () =>
                                {
                                    item.Fn('update.split', null);

                                    $('#dh-collection-split-toggle').show();
                                    $('#dh-collection-split-settings').hide();
                                }
                            }, {class: 'border dh-flex jcfe'})}    
                        </div>
                    </div>
                </block>
            `);

            return items;
        };

        this.ownership = (items) =>
        {
            items.push(`
                <block for="html.group">
                    <div class="name">Ownership</div>
                    <div class="description">Claim ownership of this collection, ensuring that others won't be able to modify or delete it.</div>
                    <div class="dh-grid">
                        <div class="row" id="dh-collection-ownership-toggle" style="display: ${item.Get('client') ? 'none' : 'block'}">
                            ${html.Render('button', {
                                title: 'Claim',
                                onClick: (target, value) =>
                                {
                                    item.Fn('update.client', $dh.client().id);

                                    $('#dh-collection-ownership-toggle').hide();
                                    $('#dh-collection-ownership-settings').show();
                                }
                            }, {class: 'w100'})}
                        </div>
                        <div class="row" id="dh-collection-ownership-settings" style="display: ${item.Get('client') ? 'block' : 'none'}">
                            ${html.Render('button', {
                                title: 'Unset',
                                tooltip: 'Unclaim ownership of this collection',
                                onClick: () =>
                                {
                                    item.Fn('update.client', null);

                                    $('#dh-collection-ownership-toggle').show();
                                    $('#dh-collection-ownership-settings').hide();
                                }
                            }, {class: 'border dh-flex jcfe'})}    
                        </div>
                    </div>
                </block>
            `);

            return items;
        };

        return this.init();

   
});