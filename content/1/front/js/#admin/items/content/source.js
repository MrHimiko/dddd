content.OnReady(function() 
{
    content.ItemAdd({
        id: 'source',
        name: 'Source',
        order: 20,
        condition: function(item, tag)
        {
            return tag.Get('name') === 'source';
        },
        html: function (item, tag) 
        {
            let src = tag.Fn('attributes.get.object', 'src').value;

            return `
                <div class="row s3">
                    <span>Source</span>
                </div>

                <div class="row s9">
                    ${html.Render('input', {
                        attributes: {
                            placeholder: 'https://',
                            value: src,
                        },
                        onChange: (target, value) =>
                        {
                            tag.Fn('attributes.set.key', 'src', value ? value : null);
                            tag.Fn('update.attributes');
                        }
                    })}
                </div>
            `;
        }
    });
});