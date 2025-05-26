collections.items.BindClick('save', function(addon, event, target, item)
{
    let previewMode = target.attr('data-preview');

    collections.items.Fn('save', !!!target.attr('save'), () =>
    {
        mdModal.ItemGet('collections.items.settings.' + item.Get('parent'), (modal) =>
        {
            modal.Remove({animation: true});
        });

        if(previewMode)
        {
            item.Fn('settings');

            let prompt = addon.GetSave('preview', false);
    
            if(prompt)
            {
                return preview.Fn('open');
            }
        
            html.Fn('prompt', 'Preview Mode', 'Preview functionality depends on the correct configuration of the page linked to this collection source. It will exclusively operate when the page URL includes the dynamic property ":slug.".', {}, function()
            {
                addon.SetSave('preview', true);
                preview.Fn('open');
            });
        }
    });
});
