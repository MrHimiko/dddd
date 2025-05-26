content.OnReady(function() 
{
    content.ItemAdd({
        id: 'section',
        name: 'Section',
        order: 20,
        condition: function(item, tag)
        {
            return tag.Get('name') === 'section';
        },
        html: function (item, tag) 
        {
            let properties = tag.Get('properties');

            return `
                <div class="row s3">
                    <span>Lazy Load</span>
                </div>

                <div class="row s4"></div>
                <div class="row s5">
                    ${html.Render('options', {
                        selected: ('lazy' in properties) && properties.lazy,
                        options: [
                            {icon: 'check', tooltip: 'Yes', value: true},
                            {icon: 'close', tooltip: 'No', value: false},
                        ],
                        onClick: (target, option) =>
                        {
                            tag.Fn('update.properties.lazy', {lazy: option.value});
                        }
                    })}
                </div>

                <div class="row s3">
                    <span>Lock</span>
                </div>

                <div class="row s4"></div>
                <div class="row s5">
                    ${html.Render('options', {
                        selected: ('lock' in properties) && properties.lock,
                        options: [
                            {icon: 'check', tooltip: 'Yes', value: true},
                            {icon: 'close', tooltip: 'No', value: false},
                        ],
                        onClick: (target, option) =>
                        {
                            tag.Fn('update.properties.lock', {lock: option.value});
                        }
                    })}
                </div>
            `;
        }
    });
});