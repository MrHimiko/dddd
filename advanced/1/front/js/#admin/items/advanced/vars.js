advanced.OnReady(function() 
{
    advanced.ItemAdd({
        id: 'vars',
        name: 'Route Variables',
        order: 300,
        condition: (item, tag) =>
        {
            if(tag.Get('name') !== 'a')
            {
                return false;
            }

            return pages.ItemGet(tag.Fn('attributes.get.object', 'page-id').value);
        },
        html: (item, tag) =>
        {
            let vars = tag.Fn('attributes.get.object', 'dh-vars').value;
            let page = pages.ItemGet(tag.Fn('attributes.get.object', 'page-id').value);
            let attrs = dh.query('?' + (vars ? vars : ''));
            let items = [];

            page.Get('route').split('/').forEach(function(value)
            {
                if(value[0] === ':' && !(value.substring(1) in attrs))
                {
                    attrs[value.substring(1)] = '';
                }
            });

            $.each(attrs, (key, value) =>
            {
                items.push({key, value});
            });

            return `
                <div class="row">
                    ${html.Render('listing', {
                        icon: dh.icon('sliders', 16, 'builder'),
                        label: 'Variables',
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
                                return html.Render('input', {
                                    attributes: {
                                        value,
                                        placeholder: 'Value',
                                    },
                                    variable: () => { return tag.Get('data'); }
                                });
                            }
                        },
                        items,
                        onChange: (items) =>
                        {
                            let vars = {};

                            items.forEach((item) =>
                            {
                                if(item.key && item.value)
                                {
                                    vars[item.key] = item.value;
                                }
                            });

                            tag.Fn('attributes.set.key', 'dh-vars', (Object.keys(vars).length ? $.param(vars) : null));
                            tag.Fn('update.attributes');
                        },
                    })}
                </div>
            `;
        }
    });
});