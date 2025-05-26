content.OnReady(function() 
{
    content.ItemAdd({
        id: 'button',
        name: 'Button',
        order: 20,
        condition: function(item, tag)
        {
            return tag.Get('name') === 'button';
        },
        html: function (item, tag) 
        {
            let type = tag.Fn('attributes.get.object', 'type').value;

            return `
                <div class="row s3">
                    <span>Type</span>
                </div>

                <div class="row s9">
                    ${html.Render('input', {
                        attributes: {
                            value: type ? type : 0
                        },
                        select: () =>
                        {
                            return [
                                {group: '', title: 'None', value: 0},
                                {group: '', title: 'Button', value: 'button'},
                                {group: '', title: 'Submit', value: 'submit'},
                            ];
                        },
                        onSelect: (target, item) =>
                        {
                            tag.Fn('attributes.set.key', 'type', item.value ? item.value : null);
                            tag.Fn('update.attributes');
                        }
                    })}
                </div>
            `;
        }
    });
});