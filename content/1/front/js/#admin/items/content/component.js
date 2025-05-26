content.OnReady(function() 
{
    content.ItemAdd({
        id: 'component',
        name: 'Component',
        order: 20,
        condition: function (content, tag) 
        {
            return tag.Get('name') === 'component' || tag.Get('symbol');
        },
        html: function (content, tag) 
        {
            let instance = '';
            let lock = '';
            let variables = '';
            let symbol = tag.Get('Symbol');

            if(symbol)
            {
                let properties = tag.Get('properties');

                if(!symbol.Get('variables'))
                {
                    instance = `
                        <div class="row s3">
                            <span>Instance</span>
                        </div>

                        <div class="row s4"></div>
                        <div class="row s5">
                            ${html.Render('options', {
                                selected: !('instance' in properties) || properties.instance === true,
                                options: [
                                    {icon: 'check', tooltip: 'Yes', value: true},
                                    {icon: 'close', tooltip: 'No', value: false},
                                ],
                                onClick: (target, option) =>
                                {
                                    tag.Fn('update.properties.instance', {instance: option.value});
                                }
                            })}
                        </div>
                    `;

                    lock = `
                        <div class="row s3">
                            <span>Lock</span>
                        </div>

                        <div class="row s4"></div>
                        <div class="row s5">
                            ${html.Render('options', {
                                selected: ('lock' in properties) && properties.lock,
                                options: [
                                    {icon: 'check', tooltip: 'Yes', value: true},
                                    {icon: 'close', tooltip: 'No', value: false},
                                ],
                                onClick: (target, option) =>
                                {
                                    tag.Fn('update.properties.lock', {lock: option.value});
                                }
                            })}
                        </div>
                    `;
                }
                
                if(symbol.Get('variables'))
                {
                    variables = `
                        <div class="row dh-tar">
                            ${html.Render('button', {
                                title: 'Edit content',
                                onClick: () =>
                                {
                                    let data;

                                    try 
                                    {
                                        data = JSON.parse(tag.Fn('text.get'));
                                    }
                                    catch(error)
                                    {
                                        data = {};
                                    }

                                    mdVars.Fn('dynamic.open', symbol.Get('variables'), data, null, (dynamic) =>
                                    {
                                        if(dynamic.changes.includes('config'))
                                        {
                                            tag.Get('Symbol').Fn('update.variables', {variables: dynamic.config});
                                        }

                                        tag.Fn('text.set', JSON.stringify(dynamic.data));
                                        tag.Fn('update.text');
                                    });
                                }
                            })}
                        </div>
                    `;
                }
            }


            let selectComp = `
                <div class="row">
                    ${html.Render('input', {
                        selected: tag.Get('name'),
                        attributes: {
                            value: tag.Get('symbol'),
                            placeholder: 'Select component',
                        },
                        select: function() 
                        {
                            let list = [
                                {title: 'None', value: 0},
                            ];

                            $.each(components.ItemsGet(), (index, component) =>
                            {
                                if(!component.Get('page'))
                                {
                                    list.push({title: component.Get('name'), value: component.Get('id')});
                                }
                            });

                            return list;
                        },
                        onModal: (target, modal, options) =>
                        {
                            options.attributes = (item, attributes) =>
                            {
                                attributes['class'] = 'dh-component-preview';
                                attributes['data-component'] = item.value;
                            }
                        },
                        onSelect: (target, option) =>
                        {
                            tag.Fn('update.symbol', {symbol: option.value ? option.value : null});
                            content.Replace('html');
                        }
                    })}
                </div>`;

            if ( !$dh.client().permissions.includes("builder.developer") && !$dh.client().permissions.includes("*") ) {selectComp = ''};

            return `
                ${selectComp}
                ${instance}
                ${lock}
                ${variables}
            `;
        }
    });
});