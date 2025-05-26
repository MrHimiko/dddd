content.OnReady(function() 
{
    content.ItemAdd({
        id: 'form',
        name: 'Form',
        order: 20,
        condition: function(item, tag)
        {
            return tag.Get('name') === 'form';
        },
        html: function (item, tag) 
        {
            let method = tag.Fn('attributes.get.object', 'method').value;
            let action = tag.Fn('attributes.get.object', 'action').value;
            let form = tag.Fn('attributes.get.object', 'dh-form').value;
            let page = tag.Fn('attributes.get.object', 'dh-page').value;

            return `
                <div class="row s3">
                    <span>Form</span>
                </div>

                <div class="row s9" style="height: 30px; background: var(--dh-bg-2); border-radius: 8px;">
                    ${admin.Fetch('forms.forms', {}, function(data) 
                    {
                        return html.Render('input', {
                            attributes: {
                                value: form ? form : 0
                            },
                            select: () =>
                            {
                                let list = [
                                    {group: '', title: 'None', value: 0}
                                ];

                                $.each(data.forms, function(index, form)
                                {
                                    list.push({group: '', title: form.name, value: form.id});
                                });

                                return list;
                            },
                            onSelect: (target, item) =>
                            {
                                tag.Fn('attributes.set.key', 'dh-form', item.value ? item.value : null);
                                tag.Fn('update.attributes');
                            }
                        })
                    })}
                </div>

                <div class="row s3">
                    <span>Success redirect</span>
                </div>

                <div class="row s9">
                    ${html.Render('input', {
                        attributes: {
                            placeholder: 'Select page',
                            value: page,
                        },
                        select: () =>
                        {
                            return pages.Fn('list');
                        },
                        onSelect: (target, item) =>
                        {
                            tag.Fn('attributes.set.key', 'dh-page', item.value ? item.value : null);
                            tag.Fn('update.attributes');
                        }
                    })}
                </div>

                <div class="row s3">
                    <span>Method</span>
                </div>

                <div class="row s9">
                    ${html.Render('input', {
                        attributes: {
                            value: method ? method : 'GET'
                        },
                        select: () =>
                        {
                            return [
                                {group: '', title: 'None', value: 0},
                                {group: '', title: 'GET', value: 'GET'},
                                {group: '', title: 'POST', value: 'POST'},
                                {group: '', title: 'PUT', value: 'PUT'},
                                {group: '', title: 'DELETE', value: 'DELETE'},
                            ];
                        },
                        onSelect: (target, item) =>
                        {
                            tag.Fn('attributes.set.key', 'method', item.value ? item.value : null);
                            tag.Fn('update.attributes');
                        }
                    })}
                </div>

                <div class="row s3">
                    <span>Action</span>
                </div>

                <div class="row s9">
                    ${html.Render('input', {
                        attributes: {
                            placeholder: 'https://',
                            value: action,
                        },
                        onChange: (target, value) =>
                        {
                            tag.Fn('attributes.set.key', 'action', value ? value : null);
                            tag.Fn('update.attributes');
                        }
                    })}
                </div>
            `;
        }
    });

    content.ItemAdd({
        id: 'form.builder',
        name: 'Builder',
        order: 20,
        condition: function(item, tag)
        {
            return false;
        },
        html: function (item, tag) 
        {
            let content;

            try
            {
                content = JSON.parse(tag.Fn('text.get'));
            }
            catch(error) {}

            if(!content || typeof content !== 'object' || !('type' in content) || !('value' in content))
            {
                content = {type: 'fields', value: []};
            }

            return `
                <div class="row">
                    ${elements.Render('form', {
                        config: {
                            type: {
                                label: 'Type',
                                labelInline: true,
                                type: 'SELECT',
                                values: () => 
                                {
                                    return [
                                        {title: 'Fields', value: 'fields', description: 'Create advanced form using visual form builder.'},
                                        {title: 'JSON', value: 'json', description: 'Manually provide JSON configuration.'},
                                        {title: 'Function', value: 'function', description: 'Call a file function that returns JSON with callback options enabled.'},
                                    ]
                                },
                                configure: (event) => 
                                {
                                    event.config.fields.hidden = event.values.type !== 'fields';
                                    event.config.json.hidden = event.values.type !== 'json';
                                    event.config.function.hidden = event.values.type !== 'function';
                                },
                                whenChanged: (event) => 
                                {
                                    event.config.fields.hidden = event.value !== 'fields';
                                    event.config.json.hidden = event.value !== 'json';
                                    event.config.function.hidden = event.value !== 'function';

                                    event.reload();
                                }
                            },
                            hr: {
                                type: 'LINE'
                            },
                            fields: {
                                label: 'Fields',
                                type: 'REPEATER',
                                config: {
                                    name: {
                                        width: 6,
                                        type: 'INPUT',
                                        placeholder: 'Name',
                                        label: 'Name'
                                    },
                                    type: {
                                        width: 6,
                                        placeholder: 'Select Type',
                                        label: 'Type',
                                        value: 'input',
                                        type: 'SELECT',
                                        values: () => 
                                        {
                                            return elements.Fn('list');
                                        },
                                        configure: (data) => 
                                        {
                                            let element = elements.ItemGet(data.values.type);

                                            if(element)
                                            {
                                                return $.extend({
                                                    line: {
                                                        type: 'LINE'
                                                    },
                                                }, element.Get('config'));
                                            }
                                        }
                                    },
                                    label: {
                                        width: 6,
                                        type: 'INPUT',
                                        placeholder: 'Label',
                                        label: 'Label',
                                        preview: false,
                                    },
                                    width: {
                                        width: 6,
                                        type: 'SELECT',
                                        value: 12,
                                        values: () => 
                                        {
                                            return [
                                                {title: '25%', value: 3},
                                                {title: '50%', value: 6},
                                                {title: '75%', value: 9},
                                                {title: '100%', value: 12},
                                            ]
                                        },
                                        label: 'Width',
                                    },
                                    description: {
                                        width: 12,
                                        type: 'TEXTAREA',
                                        placeholder: 'Description',
                                        label: 'Description',
                                        preview: false,
                                    },
                                },
                                style: '',
                                onEdit: () => {},
                                onRemove: () => {},
                                whenChanged: (event) => 
                                {
                                    event.values.json = JSON.stringify(event.values.fields);
                                }
                            },
                            json: {
                                label: 'JSON',
                                type: 'TEXTAREA',
                                hidden: true
                            },
                            function: {
                                label: 'Function',
                                placeholder: 'Select Function',
                                type: 'SELECT',
                                values: () => 
                                {
                                    let items = [];

                                    $.each(files.ItemsGet(), (index, item) => 
                                    {
                                        if(item.Get('extension') === 'function')
                                        {
                                            items.push({title: item.Get('name').replaceAll('-', ' '), value: item.Get('name')});
                                        }
                                    });

                                    return items;
                                },
                                hidden: true
                            }
                        },
                        values: {
                            type: content.type,
                            fields: content.type === 'fields' ? content.value : [],
                            json: content.type === 'json' ? JSON.stringify(content.value) : null,
                            function: content.type === 'function' ? content.value : null,
                        },
                        onChange: (event) => 
                        {
                            setTimeout(() => 
                            {
                                let type = event.values.type;
                                let value;

                                switch(type)
                                {
                                    case 'fields':
                                        value = event.values.fields;
                                        break;
                                    case 'json':
                                        value = event.values.json;
                                        break;
                                    case 'function':
                                        value = event.values.function;
                                        break;
                                }

                                tag.Fn('text.set', JSON.stringify({type, value}));
                                tag.Fn('update.text');
                            });
                        }
                    })}
                </div>
            `;

            return `
                <div class="row">
                    ${elements.Render('repeater', {
                        config: {
                            name: {
                                width: 6,
                                type: 'INPUT',
                                placeholder: 'Name',
                                label: 'Name'
                            },
                            label: {
                                width: 6,
                                type: 'INPUT',
                                placeholder: 'Label',
                                label: 'Label',
                                preview: false,
                            },
                            type: {
                                width: 6,
                                placeholder: 'Select Type',
                                label: 'Type',
                                type: 'SELECT',
                                values: () => 
                                {
                                    return elements.Fn('list');
                                }
                            },
                            description: {
                                width: 12,
                                type: 'TEXTAREA',
                                placeholder: 'Description',
                                label: 'Description',
                                preview: false,
                            },
                            
                        },
                        values: Array.isArray(values) ? values : [],
                        onEdit: () => {},
                        onRemove: () => {},
                        onAdd: (event) => 
                        {
                            event.item.name = 'Name';
                            event.item.type = 'Input';
                        },
                        onChange: (event) => 
                        {
                            tag.Fn('text.set', JSON.stringify(event.values));
                            tag.Fn('update.text');
                        }
                    })}
                </div>

                <div class="row">
                    ${elements.Render('textarea', {
                        value: JSON.stringify(values),
                        onChange: (event) => 
                        {
                            // tag.Fn('text.set', JSON.stringify(event.values));
                            // tag.Fn('update.text');
                        }
                    })}
                </div>
            `;
        }
    });
});