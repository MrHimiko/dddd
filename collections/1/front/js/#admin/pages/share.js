collections.PageAdd('share', '/:slug', function(addon, page, vars)
{

    if (!$dh.client().permissions.includes("collections.view") && !$dh.client().permissions.includes("*")) {
        admin.PageGet('access-denied').Load();
        return;
    }


    page.SetShare(true);
    
    addon.Ready();
    addon.SetTemp('share', true);
    
    collections.Fetch('field.types', {}, (data) =>
    {
        collections.fields.types.ItemsArrayAdd(data.types);
    });

    return `
        <div class="dh-flex">
            <div class="max dh-scrollbar" style="height: calc(100vh - 44px)">
                ${collections.Fetch('collection', {slug: vars.slug}, (data) =>
                {
                    let collection = collections.ItemGet(data.collection);

                    collections.tabs.ItemsArrayAdd(data.tabs);
                    collections.tabs.sections.ItemsArrayAdd(data.sections);
                    collections.fields.ItemsArrayAdd(data.fields);

                    collection.Set('active', true);

                    return `
                        ${collections.Render('collection', {collection, share: true})}
                    `;
                })}
            </div>  
        </div>
    `;
});