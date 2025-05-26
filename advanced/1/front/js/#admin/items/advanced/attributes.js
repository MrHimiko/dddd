advanced.OnReady(function() 
{
    advanced.ItemAdd({
        id: 'attributes',
        name: 'Attributes',
        order: 250,
        html: (item, tag) =>
        {
            let attributes = tag.Fn('attributes.get.objects');
            let items = [];

            $.each(attributes, (key, attribute) =>
            {
                if(!['page-id', 'dh-vars', 'dh-query'].includes(key))
                {
                    items.push({key, value: attribute.value});
                }
            });
 
            return `
                <div class="row">
                    ${html.Render('listing', {
                        icon: dh.icon('sliders', 16, 'builder'),
                        label: 'Attributes',
                        keys: {
                            key: function(value)
                            {
                                return html.Render('input', {
                                    attributes: {
                                        value,
                                        placeholder: 'Key'
                                    }
                                });
                            },
                            value: function(value)
                            {
                                return html.Render('textarea', {
                                    value,
                                    attributes: {
                                        placeholder: 'Value',
                                        style: 'height: 150px;',
                                    },
                                    variable: () => { return tag.Get('data'); }
                                });
                            }
                        },
                        items,
                        onChange: (items) =>
                        {
                            let newAttributes = {};
                            let oldAttributes = tag.Fn('attributes.get.objects');

                            items.forEach((item) =>
                            {
                                if(item.key && item.value)
                                {
                                    newAttributes[item.key] = item.value;
                                }
                            });

                            $.each(oldAttributes, (key, attribute) =>
                            {
                                if(['page-id', 'dh-vars', 'dh-query'].includes(key))
                                {
                                    newAttributes[key] = attribute.value;
                                }
                            });

                            tag.Fn('attributes.set', (Object.keys(newAttributes).length ? newAttributes : null));
                            tag.Fn('update.attributes');
                        },
                        onModal: (target, modal) =>
                        {
                            modal.width = 350;
                        },
                    })}
                </div>
            `;
        }
    });
});