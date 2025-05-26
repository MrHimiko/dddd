components.layers.FunctionCreate('draggable', function(layers)
{
    this.init = () =>
    {
        /* Check if Initialized */
        if(window.draggableLayers === true) { return; } window.draggableLayers = true;

        /* Variables */
        let draggable = this;
        let drag = null;
        let drop = null;
        let position = null;

        interact('block[for="builder.components.layers"] [dh-id]').draggable(
        {
            cursor: false,
            listeners:
            {
                start(event)
                {
                    /* Get Drag Tag */
                    drag = components.tags.ItemGet($(event.target).attr('dh-id')); if(!drag) { return; }

                    /* Dragged Class */
                    $(event.target).addClass('dragged');
                    components.layers.RenderTarget().addClass('dragged');

                    /* Outline */
                    outline.Fn('hide', true);

                    /* Reset Drop */
                    drop = null;
                },
                move(event)
                {
                    /* Drag */
                    if(!drag) { return; }

                    /* Get Drop Tag */
                    let dropTag = draggable.drop(event); if(dropTag) { drop = dropTag; } if(!drop) { return; }

                    /* Not Same Component */
                    if(drop.Get('component') !== drag.Get('component')) { return; }

                    /* Position */
                    position = draggable.position(drag, drop);

                    /* Clone */
                    draggable.clone(drop, position);
                },
                end(event)
                {
                    /* Drag */
                    if(!drag) { return; }

                    /* Dragged Class */
                    $(event.target).removeClass('dragged');
                    components.layers.RenderTarget().removeClass('dragged');

                    /* Move */
                    draggable.move(drag, drop, position);

                    /* Outline */
                    outline.Fn('show', true);

                    /* Clone */
                    $('#dh-draggable-clone').remove();
                }
            }
        });
    };

    this.drop = (event) =>
    {
        /* Get Target */
        let target = dh.getPoint(event.client.x, event.client.y);

        /* Skip Dragged */
        if($(target).hasClass('dragged')) { return; }

        /* Get Id */
        let id = $(target).attr('dh-id'); if(!id) { return; }
        let order = $(target).attr('dh-order'); if(!order) { return; }

        /* Get Tag */
        let tag = components.tags.ItemGet(id);

        tag.data.target = $(target);

        return tag;
    };

    this.position = (drag, drop) =>
    {
        let position = dh.offset(drop.data.target.find('>span'), 25).insert;

        if(position === 'inside')
        {
            let nest = drop.Get('Block').Get('nest');

            if(!nest.includes(drag.Get('name')) && !nest.includes('*'))
            {
                position = 'before';
            }
        }

        return position;
    };

    this.clone = (drop, position) =>
    {
        if(!$(`#dh-draggable-clone.${position}`).length)
        {
            $('#dh-draggable-clone').remove();
            $('body').append(`<div id="dh-draggable-clone" class="${position} z-index">${position}</div>`);
        }

        $('#dh-draggable-clone').css('width', drop.data.target.outerWidth());
        $('#dh-draggable-clone').css('height', drop.data.target.outerHeight());
        $('#dh-draggable-clone').css('left', drop.data.target.offset().left);
        $('#dh-draggable-clone').css('top', drop.data.target.offset().top);
    };

    this.move = (drag, drop, position) =>
    {
        if(!drop)
        {
            return;
        }
        
        if(position === 'before')
        {
            drag.Fn('update.parent', {parent: drop.Get('parent') ? drop.Get('parent') : 0, order: drop.Get('order') - 1});
        }
        else if(position === 'after')
        {
            drag.Fn('update.parent', {parent: drop.Get('parent') ? drop.Get('parent') : 0, order: drop.Get('order') + 1});
        }
        else if(position === 'inside')
        {
            drag.Fn('update.parent', {parent: drop.Get('id'), order: drop.Fn('find.order.max') + 1});
        }
    };

    return this;
});