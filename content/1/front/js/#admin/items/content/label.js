content.OnReady(function() 
{
    content.ItemAdd({
        id: 'label',
        name: 'Label',
        order: 20,
        condition: function(item, tag)
        {
            return tag.Get('name') === 'label';
        },
        html: function (item, tag) 
        {
            let forText = tag.Fn('attributes.get.object', 'for').value;

            return `
                <div class="row s3">
                    <span>For</span>
                </div>

                <div class="row s9">
                    ${html.Render('input', {
                        attributes: {
                            value: forText,
                        },
                        onChange: (target, value) =>
                        {
                            tag.Fn('attributes.set.key', 'for', value ? value : null);
                            tag.Fn('update.attributes');
                        }
                    })}
                </div>
            `;
        }
    });
});