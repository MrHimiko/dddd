collections.RenderCreate('global', function(addon, data)
{
    this.init = () =>
    {
        return `
            ${this.search()}
            ${this.table()}
        `;
    };

    this.search = () => 
    {
        return html.Render('input', {
            attributes: {
                value: data('search', ''),
                placeholder: 'Search by Name...'
            },
            onChange: (target, value) => 
            {
                if(value)
                {
                    return addon.Render('global', {search: value}, {}, true, true);
                }

                addon.Render('global', {}, {}, true, true);
            }
        });
    };

    this.table = () =>
    {
        return html.Render('table', {
            keys: {
                name: {},
                items: {
                    callback: (row) =>
                    {
                        return row.count
                    }
                },
                password: {
                    callback: (row) =>
                    {
                        return row.global.password ? 'Protected' : '-'
                    }
                },
                action: {
                    callback: (row) =>
                    {
                        return html.Render('button', {
                            title: 'Add',
                            onClick: () =>
                            {
                                console.log(row);
                            }
                        }, {class: 'silver'});
                    }
                }
            },
            rows: data('collections', [])
        })
    };

    return this.init();
});