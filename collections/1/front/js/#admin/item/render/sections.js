
collections.RenderCreate('item.sections', function(files, collection, data, attributes)
{
    let tab = data('tab');
    let item = data('item');

    if(!item)
    {
        return `
            ${tab.Render('sections', {}, {}, false, false)}
    
            ${html.Render('button', {
                title: 'Add new section',
                attributes: {
                    'bind-click': 'create|collections.tabs.sections',
                    'data-name': '',
                    'data-tab': tab.Get('id')
                }   
            }, {class: 'brand-opacity'})}
        `;
    }

    return tab.Render('sections', {item}, {}, false, false);
});