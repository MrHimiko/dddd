collections.FunctionCreate('global', function(addon, search = null)
{
    let fetch = {global: true, tabs: false, sections: false, fields: false};

    if(search)
    {
        fetch['search'] = search;
    }

    addon.Fetch('collections', fetch, (data) => 
    {
        mdModal.Fn('template.middle', addon.Render('global', {collections: data.collections, search}), 'Find Global Collections', 720);
    });
});