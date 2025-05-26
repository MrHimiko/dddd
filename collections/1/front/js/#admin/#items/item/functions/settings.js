collections.items.FunctionCreate('item.settings', function(addon, item, tab)
{
    let modals = addon.GetTemp('modals', {});
    let active = addon.GetTemp('active', {});

    this.init = () =>
    {
        this.clear();
        this.modal();

        addon.SetTemp('modals', modals);
        addon.SetTemp('active', active);

        /* Preview */
        preview.Fn('set', null, 'collection.' + item.Get('collection'), $.extend({id: item.Get('id'), slug: item.Get('slug'), name: item.Get('name')}, item.Get('fields')));
    };

    this.clear = () =>
    {
        if(item.Get('parent'))
        {
            return;
        }

        $.each(addon.ItemsGet(), (index, item) =>
        {
            if(item.Get('parent'))
            {
                item.Remove();
            }
        });
    };

    this.modal = () =>
    {
        mdModal.Fn('template.sidebar', item.Render('settings', {tab}), 'right', 'calc(100vw - 250px)', false, (config) =>
        {
            config.id = 'collections.items.settings.' + item.Get('parent');

            if(item.Get('parent'))
            {
                config.overlay = {opacity: 0.3, closeable: false};
            }
    
            config.onOpen = () =>
            {
                modals[item.Get('parent')] = true;
                active[item.Get('id')] = item;
    
                collections.Fn('sidebar', false);
            }
    
            config.onClose = () =>
            {
                delete modals[item.Get('parent')];
                delete active[item.Get('id')];
    
                if(!Object.keys(modals).length)
                {
                    collections.Fn('sidebar', true);
                }
            }
        });
    }

    return this;
});