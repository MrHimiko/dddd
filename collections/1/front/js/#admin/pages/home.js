collections.PageAdd('home', '/', function(addon, page, vars)
{
    if (!$dh.client().permissions.includes("collections.view") && !$dh.client().permissions.includes("*")) {
        admin.PageGet('access-denied').Load();
        return;
    }

    let active = collections.GetSave('active');

    if($dh.query('id'))
    {
        active = $dh.query('id');
    }

    addon.Ready();

    collections.Fetch('field.types', {}, (data) =>
    {
        collections.fields.types.ItemsArrayAdd(data.types);
    });

    collections.Fetch('collections', {}, (data) =>
    {
        collections.ItemsArrayAdd(data.collections);
        collections.tabs.ItemsArrayAdd(data.tabs);
        collections.tabs.sections.ItemsArrayAdd(data.sections);
        collections.fields.ItemsArrayAdd(data.fields);

        if(active)
        {
            active = collections.ItemGet(active);

            if(active)
            {
                collections.Render('collection', {collection: active}, {}, true, true);
                active.TargetItem('html').addClass('active');
            }
            else
            {
                collections.Render('collection', {}, {}, true, true);
                collections.SetSave('active', null);
            }
        }
    });

    return `
        ${html.navbar.Render('main')}
        
        <div class="dh-scrollbar" style="height: calc(100vh - 44px)">
            <div class="dh-flex">
                ${collections.Render('sidebar')}
                <div class="max dh-scrollbar" style="height: calc(100vh - 44px)">
                    ${collections.Render('collection', {}, {style: active ? 'display: none' : ''})}
                </div>  
            </div>
        </div>
    `;
});