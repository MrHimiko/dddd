collections.RenderCreate('collection', function(addon, data)
{
    let collection = data('collection');

    this.init = () =>
    {
        return collection ? this.collection() : this.empty();
    };

    this.empty = () =>
    {
        return `
            <div class="dh-content-1000">
                <div class="dh-ptb40">
                    ${html.Render('heading', {
                        title: 'Collections',
                        description: 'Create and store content in a structured format, such as articles, products, events, or blog posts, and then dynamically display this content on different pages of the website.',
                        tabs: true
                    })}
            
                    ${html.Render('empty', {
                        icon: dh.icon('app-collections', 20, 'common'),
                        title: 'Collections',
                        description: 'Select existing or create new collection to get started.',
                        button: `
                            <div class="dh-flex col2 gap10">

                                ${$dh.client().permissions.includes("collections.developer") || $dh.client().permissions.includes("*") ? 
                                    html.Render('button', {
                                        title: 'Create Collection',
                                        attributes: {
                                            'bind-click': 'create|collections',
                                            'data-name': ''
                                        }
                                    }) : ''
                                }

                                ${1 === 2 ? html.Render('button', {
                                    title: 'Find Global Collection',
                                    attributes: {
                                        'bind-click': 'global|collections'
                                    }
                                }) : ''}
                            </div>
                        `
                    })}
                </div>
            </div>
        `;
    };

    this.collection = () =>
    {
        return `
            ${collection.Render('heading')}
            ${collection.Render('items', {fetch: true})}
            ${collection.Render('pagination')}
        `;
    };

    return this.init();
});