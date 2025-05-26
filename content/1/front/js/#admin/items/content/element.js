content.OnReady(function() 
{
    content.ItemAdd({
        id: 'element',
        name: 'Element',
        order: 20,
        condition: function(item, tag)
        {
            return false;
        },
        html: function (item, tag) 
        {
            let configuration = {};

            try
            {
                configuration = JSON.parse(tag.Fn('text.get'));

                if(!configuration || typeof configuration !== 'object')
                {
                    configuration = {};
                }
            }
            catch(error) {}


            return `
                <div class="row">
                    ${elements.Render('form', {
                        config: {
                            type: {
                                label: 'Type',
                                labelInline: true,
                                type: 'SELECT',
                                placeholder: 'Select Type',
                                values: () => 
                                {
                                    return elements.Fn('list');
                                },
                                configure: (event) => 
                                {
                                    let element = elements.ItemGet(event.values.type);

                                    if(element)
                                    {
                                        return $.extend({
                                            line: {
                                                type: 'LINE'
                                            },
                                        }, element.Get('config'));
                                    }
                                },
                                whenChanged: (event) => 
                                {
                                    
                                }
                            },
                        },
                        values: $.extend(configuration.config, {type: configuration.type}),
                        onChange: (event) => 
                        {
                            tag.Fn('text.set', JSON.stringify({
                                type: event.values.type,
                                config: event.values
                            }));
                            
                            tag.Fn('update.text');
                        }
                    })}
                </div>
            `;
        }
    });
});