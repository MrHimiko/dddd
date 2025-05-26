collections.RenderCreate('item.import', function(files, item, data, attributes)
{
    attributes.class = 'dh-scrollbar';

    let csv = data('csv', []);

    let connections = data('connections', []);
    let items = data('items', {});

    this.init = () => 
    {
        if(!csv.length)
        {
            return this.file();
        }

        if(!connections.length)
        {
            return this.connection();
        }

        if(!Object.keys(items).length)
        {
            return this.table();
        }

        return this.importing();
    };

    this.file = () =>
    {
        return `
            ${html.Render('button', {
                title: 'Select CSV File',
                onClick: (target) =>
                {
                    target.parent().next().click();
                }
            }, {class: 'w100'})}

            <input style="display: none" id="dh-collections-import" bind-change="import|collections" data-collection="${item.Get('id', true)}" type="file" name="csvFile" id="csvFile" accept=".csv">
        `;
    }; 

    this.connection = () =>
    {
        let listing = html.Render('listing', {
            label: 'Connections',
            keys: {
                key: (value) =>
                {
                    return html.Render('input', {
                        attributes: {
                            value,
                            placeholder: 'CSV Key'
                        },
                        select: () =>
                        {
                            let list = [];

                            csv[0].forEach((key, index) => 
                            {
                                list.push({title: key, value: key});
                            });

                            return list;
                        }
                    });
                },
                field: (value) =>
                {
                    return html.Render('input', {
                        attributes: {
                            value,
                            placeholder: 'Collection Key'
                        },
                        select: () =>
                        {
                            let list = [];

                            if(!this.connectionExist('field', 'name'))
                            {
                                list.push({title: 'name', value: 'name'});
                            }

                            if(!this.connectionExist('field', 'slug'))
                            {
                                list.push({title: 'slug', value: 'slug'});
                            }

                            $.each(item.Get('fields'), (id, field) =>
                            {
                                if(!this.connectionExist('field', field.Get('name')))
                                {
                                    list.push({title: field.Get('name') + ' | ' + field.Get('Type').Get('name'), value: field.Get('name')});
                                }
                            });


                            return list;
                        }
                    });
                }
            },
            items: connections,
            onChange: (items) =>
            {
                connections = items;
            }
        }, {class: 'background'});

        return `
            <div class="dh-grid">
                <div class="row">
                    <span>Please make connection between CSV file fields and collection fields.</span>
                </div>

                <div class="row">
                    ${listing}
                </div>

                <div class="row">
                    ${html.Render('button', {
                        title: 'Finish',
                        onClick: (target) =>
                        {
                            if(!this.connectionExist('field', 'name'))
                            {
                                return popup.notification('Name connection must be configured.');
                            }

                            item.Replace('import', {
                                csv,
                                connections
                            });
                        }
                    }, {class: 'w100'})}
                </div>
            </div>
        `;
    };

    this.connectionExist = (type, name) =>
    {
        let exist = false;

        connections.forEach((connection) =>
        {
            if(connection[type] === name)
            {
                exist = true;
                return false;
            }
        });

        return exist;
    };

    this.table = () => 
    {
        let keys = {};
        let rows = [];

        connections.forEach((connection) =>
        {   
            if(connection.key && connection.field)
            {
                keys[connection.field] = {
                    callback: (row) =>
                    {
                        return html.Render('input', {
                            attributes: {
                                value: row[connection.field]
                            },
                            onInput: (target, value) =>
                            {
                                row[connection.field] = value;
                            }
                        });
                    }
                };

                csv[0].forEach((key, i) =>
                {
                    if(key === connection.key)
                    {
                        keys[connection.field].index = i;
                    }
                });
            }
        });

        csv.forEach((row, i) =>
        {
            if(i < 1)
            {
                return true;
            }

            let rowData = {};
            $.each(keys, (key, value) =>
            {
                rowData[key] = row[value.index];
            });

            

            rows.push(rowData);
        });
    
        return `
            <div style="max-width: 100%">
                ${html.Render('button', {
                    title: 'Import Items',
                    onClick: () =>
                    {
                        if(!Object.keys(items).length)
                        {
                            return popup.notification('Please select items to import.');
                        }

                        item.Replace('import', {
                            csv,
                            connections,
                            items
                        });
                    }
                }, {class: 'dh-mb30'})}

                ${html.Render('table', {
                    keys, 
                    rows,
                    onSelect: (row, index, selected) =>
                    {
                        if(selected)
                        {
                            items[index] = row;
                        }
                        else
                        {
                            delete items[index];
                        }
                    }
                }, {class: 'h-auto', style: 'max-height: 60vh'})}
            </div>
        `;
    };

    this.importing = () =>
    {
        let total = Object.keys(items).length;
        let imported = 0;
        let failed = 0;
        let text = () =>
        {
            return `${imported} out of ${total} imported. Failed: ${failed} ${failed ? 'Please check console for errors.' : ''}`;
        };
        let done = () =>
        {
            if(total !== (imported + failed))
            {
                return;
            }

            item.Replace('items');

            if(imported === total)
            {
                $('#dh-collections-importing').css('color', 'var(--dh-green10)');
            }
            else
            {
                $('#dh-collections-importing').css('color', 'var(--dh-red10)');
            }
        };
        
        $.each(items, (index, value) =>
        {
            value.collection = item.Get('id');

            setTimeout(() =>
            {
                mdAjax.Fn('post').url('/api/collections/item').post(value).run(null, (response) =>
                {
                    collections.items.ItemAdd(response.out.item);
                    
                    imported++;
                    $('#dh-collections-importing').text(text());
    
                    done();
                }, 
                (response) =>
                {
                    failed++;
                    $('#dh-collections-importing').text(text());

                    console.log('====== ERROR START ======');
                    console.log(response.message);
                    console.log('====== ERROR END ======');
    
                    done();
                });
            }, index * 50);
        });

        return `
            <div class="dh-tac">
                <h1>Import Started</h1>
                <p id="dh-collections-importing" style="color: var(--dh-text-1); font-weight: 700">${text()}</p>
            </div>
        `;
    };

    return this.init();
});