collections.items.FunctionCreate('save', function(addon, prompt = true, callback)
{
    let active = addon.GetTemp('active', {})
    let share = collections.GetTemp('share', false);

    this.init = () =>
    {
        if(!Object.keys(active).length)
        {
            return callback();
        }

        this.each();
    };

    this.each = () =>
    {
        let processed = false;

        $.each(active, (id, item) =>
        {
            delete active[item.Get('id')];
           
            this.process(item, () =>
            {
                this.each();
            });

            processed = true;
            return false;
        });

        if(!processed)
        {
            callback();
        }
    };

    this.process = (item, then) =>
    {
        if(!item.Fn('save.get'))
        {
            return then();
        }

        if(share)
        {
            item.Fn('json.export');
            return then();
        }

        if(prompt)
        {
            this.prompt(item, then);
        }
        else
        {
            this.normal(item, then);
        }
    };

    this.prompt = (item, then) =>
    {
        html.Fn('prompt', 'Save Changes', 'Do you wish to save changes that you\'ve made?', null, 
        () => 
        {
            console.log('1');
            item.Fn('save.process', () =>
            {
                if(item.Get('parent'))
                {
                    item.Get('Parent').Replace('children');
                }
                else
                {
                    item.Get('Collection').Replace('items');
                }

                then();
            }, 
            (response) =>
            {
                popup.notification(response.message);
            });
        }, 
        () =>
        {
            item.Fn('save.clear');
            then();
        });
    };

    this.normal = (item, then) =>
    {
        item.Fn('save.process', () =>
        {
            if(item.Get('parent'))
            {
                item.Get('Parent').Replace('children');
            }
            else
            {
                item.Get('Collection').Replace('items');
            }

            then();
        }, 
        (response) =>
        {
            popup.notification(response.message);
        });
    };

    return this.init();
});