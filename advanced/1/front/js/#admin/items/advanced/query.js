advanced.OnReady(function() 
{
    advanced.ItemAdd({
        id: 'query',
        name: 'Query Parameters',
        order: 200,
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
            let query = tag.Fn('attributes.get.object', 'dh-query').value;
            let attrs = dh.query('?' + (query ? query : ''));
            let items = [];

            $.each(attrs, (key, value) =>
            {
                items.push({key, value});
            });

            return `
                <div class="row">
                    ${html.Render('listing', {
                        icon: dh.icon('sliders', 16, 'builder'),
                        label: 'Parameters',
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
                            let query = {};

                            items.forEach((item) =>
                            {
                                if(item.key && item.value)
                                {
                                    query[item.key] = item.value;
                                }
                            });

                            tag.Fn('attributes.set.key', 'dh-query', (Object.keys(query).length ? $.param(query) : null));
                            tag.Fn('update.attributes');
                        },
                    })}
                </div>
            `;
        }
    });
});