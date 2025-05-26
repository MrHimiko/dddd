$(document).on('click', '[dh-id][dh-layer]', function(event)
{
    if(event.target.nodeName !== 'svg' || !$(event.target).hasClass('dh-children'))
    {
        return;
    }

    let toggles = components.layers.GetSave('toggles', {});

    if($(this).hasClass('closed'))
    {
        delete toggles[$(this).attr('dh-id')];
        $(this).removeClass('closed');
    }
    else
    {
        toggles[$(this).attr('dh-id')] = 1;
        $(this).addClass('closed');
    }

    components.layers.SetSave('toggles', toggles);
    event.stopPropagation();
});