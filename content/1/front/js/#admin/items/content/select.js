content.OnReady(function() 
{
    content.ItemAdd({
        id: 'select',
        name: 'Select',
        order: 20,
        condition: function(item, tag)
        {
            return tag.Get('name') === 'select';
        },
        html: function (item, tag) 
        {
            let name = tag.Fn('attributes.get.object', 'name').value;
            let required = tag.Fn('attributes.get.object', 'required').value;
            let multiple = tag.Fn('attributes.get.object', 'multiple').value;

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

                <div class="row s3">
                    <span>Multiple</span>
                </div>

                <div class="row s4"></div>
                <div class="row s5">
                    ${html.Render('options', {
                        selected: !!multiple,
                        options: [
                            {icon: 'check', tooltip: 'Yes', value: true},
                            {icon: 'close', tooltip: 'No', value: false},
                        ],
                        onClick: (target, option) =>
                        {
                            if(!option.value)
                            {
                                tag.Fn('attributes.set.key', 'multiple', null);
                                tag.Fn('update.attributes');
                            }
                            else
                            {
                                tag.Fn('attributes.set.key', 'multiple', 'true');
                                tag.Fn('update.attributes');
                            }
                        }
                    })}
                </div>
            `;
        }
    });
});