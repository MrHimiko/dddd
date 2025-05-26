collections.items.FunctionCreate('selected', function(addon, collection, type)
{
    let selected = collections.GetTemp('selected', {});

    if(!Object.keys(selected).length)
    {
        return;
    }

    this.init = () =>
    {
        switch(type)
        {
            case 'publish':
                this.publish();
                break;
            case 'unpublish':
                this.unpublish();
                break;
            case 'delete':
                this.process(Object.keys(selected), '/api/collections/item', 'delete', null, (id) =>
                {
                    selected[id].Remove();
                });
                break;
        }
    };

    this.publish = () =>
    {
        let ids = [];

        $.each(selected, (index, item) =>
        {
            if(!item.Get('published'))
            {
                ids.push(item.Get('id'));
            }
        });

        this.process(ids, '/api/collections/item', 'put', (post) =>
        {
            post.published = true;
        }, 
        (id) =>
        {
            selected[id].Set('published', true);
        });
    };

    this.unpublish = () =>
    {
        let ids = [];

        $.each(selected, (index, item) =>
        {
            if(item.Get('published'))
            {
                ids.push(item.Get('id'));
            }
        });

        this.process(ids, '/api/collections/item', 'put', (post) =>
        {
            post.published = false;
        }, 
        (id) =>
        {
            selected[id].Set('published', false);
        });
    };

    this.process = (ids, url, type = 'post', callback = null, then = null) =>
    {
        let total = ids.length;
        let success = 0;
        let fail = 0;

        mdModal.ItemAdd({
            id: 'dh-collections-items-selected',
            overlay: {opacity: 0.7, closeable: false},
            closeable: false,
            html: () =>
            {
                return '<h2 id="dh-collections-items-selected">'+this.text(total, success, fail)+'</h2>';
            }
        });
        
        $.each(ids, (index, id) =>
        {
            let post = {id};

            if(callback)
            {
                callback(post);
            }

            setTimeout(() =>
            {
                mdAjax.Fn(type).url(url).post(post).run(null, (response) =>
                {
                    success++;
                    
                    if(then)
                    {
                        then(id);
                    }
                    
                    this.done(total, success, fail);
                }, 
                (response) =>
                {
                    fail++;

                    console.log('====== ERROR START ======');
                    console.log(response.message);
                    console.log('====== ERROR END ======');
    
                    this.done(total, success, fail);
                });
            }, index * 50);
        });
    };

    this.text = (total, success, fail) =>
    {
        return `${success} out of ${total} processed. Failed: ${fail} ${fail ? 'Please check console for errors.' : ''}`;
    };

    this.done = (total, success, fail) =>
    {
        $('#dh-collections-items-selected').text(this.text(total, success, fail));

        if(total !== (success + fail))
        {
            return;
        }

        setTimeout(() =>
        {
            mdModal.ItemGet('dh-collections-items-selected', (modal) =>
            {
                modal.Remove({animation: true});
            });
        }, 1500);

        this.reload();

        if(success === total)
        {
            $('#dh-collections-items-selected').css('color', 'var(--dh-green10)');
        }
        else
        {
            $('#dh-collections-items-selected').css('color', 'var(--dh-red10)');
        }
    };

    this.reload = () =>
    {
        collections.Render('collection', {collection, items: false}, {}, true, true);
    };

    return this.init();
});