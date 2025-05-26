components.layers.FunctionCreate('dom.active', function(layers, id = null, symbol = null)
{
    this.target = $('block[for="builder.components.layers"]');

    if(symbol)
    {
        this.active = this.target.find(`[dh-id="${id}"][dh-symbol="${symbol}"]`);
    }
    else
    {
        this.active = this.target.find(`[dh-id="${id}"]`);
    }

    this.init = () =>
    {
        if(id === null)
        {
            return this.removeActive();
        }

        if(!this.target.length || !this.active.length)
        {
            return;
        }

        this.removeActive();
        this.setActive();
        this.scroll();
        this.closed();
    };

    this.removeActive = () =>
    {
        this.target.find('[dh-id].active').removeClass('active');
    };

    this.setActive = () =>
    {
        this.active.addClass('active');
    };

    this.scroll = () =>
    {
        let scrollable = this.target.parent();

        let scroll = scrollable.scrollTop();
        let height = scrollable.height();

        let offset = this.active.offset().top;

        if(offset > height || offset < 0)
        {
            scrollable[0].scrollTo({
                top: (offset + scroll - height / 2),
                behavior: 'smooth'
            });
        }
    };

    this.closed = () =>
    {
        this.target.find(`[dh-id].opened`).removeClass('opened');

        let toggles = components.layers.GetSave('toggles', {});

        $.each(this.active.parents('[dh-id]'), function()
        {
            delete toggles[$(this).attr('dh-id')];

            $(this).addClass('opened');
            $(this).removeClass('closed');
        });

        components.layers.SetSave('toggles', toggles);
    };

    return this;
});