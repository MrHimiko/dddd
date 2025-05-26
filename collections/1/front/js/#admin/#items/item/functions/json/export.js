collections.items.FunctionCreate('item.json.export', function(addon, item)
{
    let save = item.Fn('save.get');

    if(!save)
    {
        save = {};
    }

    this.init = () =>
    {
        this.data();
        this.download();

        item.Fn('save.clear');
    };

    this.data = () =>
    {
        ['name', 'slug', 'published'].forEach((key) =>
        {
            if(!(key in save))
            {
                save[key] = item.Get(key);
            }
        });
    
        ['title', 'description', 'cover'].forEach((key) =>
        {
            if(!('seo.' + key in save))
            {
                save['seo.' + key] = item.Get('seo')[key];
            }
        });
    
        $.each(item.Get('fields'), (key, value) =>
        {
            if(!(key in save))
            {
                save[key] = value;
            }
        });
    };
  
    this.download = () =>
    {
        let blob = new Blob([JSON.stringify(save)], { type: 'application/json' });
        let url = URL.createObjectURL(blob);

        let a = document.createElement('a');

        a.href = url;
        a.download = item.Get('slug') + '.json';

        a.click();

        URL.revokeObjectURL(url);
    };

    return this.init();
});