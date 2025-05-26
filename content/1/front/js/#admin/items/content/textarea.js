content.OnReady(function() 
{
    content.ItemAdd({
        id: 'textarea',
        name: 'Textarea',
        order: 20,
        condition: function(item, tag)
        {
            return tag.Get('name') === 'textarea';
        },
        html: function (item, tag) 
        {
            let name = tag.Fn('attributes.get.object', 'name').value;
            let placeholder = tag.Fn('attributes.get.object', 'placeholder').value;
            let required = tag.Fn('attributes.get.object', 'required').value;

            return `
                <div class="row s3">
                    <span>Name</span>
                </div>

                <div class="row s9">
                    ${html.Render('input', {
                        attributes: {
                            value: name,
                        },
                        onChange: (target, value) =>
                        {
                            tag.Fn('attributes.set.key', 'name', value ? value : null);
                            tag.Fn('update.attributes');
                        }
                    })}
                </div>
                
                <div class="row s3">
                    <span>Placeholder</span>
                </div>

                <div class="row s9">
                    ${html.Render('input', {
                        attributes: {
                            value: placeholder,
                        },
                        onChange: (target, value) =>
                        {
                            tag.Fn('attributes.set.key', 'placeholder', value ? value : null);
                            tag.Fn('update.attributes');
                        }
                    })}
                </div>

                <div class="row s3">
                    <span>Required</span>
                </div>

                <div class="row s4"></div>
                <div class="row s5">
                    ${html.Render('options', {
                        selected: !!required,
                        options: [
                            {icon: 'check', tooltip: 'Yes', value: true},
                            {icon: 'close', tooltip: 'No', value: false},
                        ],
                        onClick: (target, option) =>
                        {
                            if(!option.value)
                            {
                                tag.Fn('attributes.set.key', 'required', null);
                                tag.Fn('update.attributes');
                            }
                            else
                            {
                                tag.Fn('attributes.set.key', 'required', 'true');
                                tag.Fn('update.attributes');
                            }
                        }
                    })}
                </div>
            `;
        }
    });
});