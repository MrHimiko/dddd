content.OnReady(function() 
{
    content.ItemAdd({
        id: 'option',
        name: 'Option',
        order: 20,
        condition: function(item, tag)
        {
            return tag.Get('name') === 'option';
        },
        html: function (item, tag) 
        {
            let value = tag.Fn('attributes.get.object', 'value').value;

            return `
                <div class="row s3">
                    <span>Value</span>
                </div>

                <div class="row s9">
                    ${html.Render('input', {
                        attributes: {
                            value,
                        },
                        onChange: (target, value) =>
                        {
                            tag.Fn('attributes.set.key', 'value', value ? value : null);
                            tag.Fn('update.attributes');
                        }
                    })}
                </div>
            `;
        }
    });
});