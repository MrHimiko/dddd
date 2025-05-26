$(document).on('dblclick', '[dh-id][dh-layer]', function(event)
{
    /* Prevent if !Mouse Left */
    if(!dh.keyOnly('mouseLeft')) { return; }

    /* Prevent if Mouse Left Hold */
    if(dh.key('mouseLeft', 250)) { return; }
    
    /* Get Loop */
    let loop = $(this).attr('dh-loop'); if(loop) { return; }

    /* Id */
    let id = $(this).attr('dh-id');

    /* Target */
    let target = $(`[dh-id="${id}"][dh-loop]`); if(!target.length) { return; }

    /* Area */
    area.Fn('move', $(target).first());

    /* Prevent Default */
    event.stopPropagation();
});