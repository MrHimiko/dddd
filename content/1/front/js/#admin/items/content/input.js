content.OnReady(function() 
{
    content.ItemAdd({
        id: 'input',
        name: 'Input',
        order: 20,
        condition: function(item, tag)
        {
            return tag.Get('name') === 'input';
        },
        html: function (item, tag) 
        {
            let type = tag.Fn('attributes.get.object', 'type').value;
            let name = tag.Fn('attributes.get.object', 'name').value;
            let placeholder = tag.Fn('attributes.get.object', 'placeholder').value;
            let value = tag.Fn('attributes.get.object', 'value').value;
            let required = tag.Fn('attributes.get.object', 'required').value;
            let autocomplete = tag.Fn('attributes.get.object', 'autocomplete').value;

            return `
                <div class="row s3">
                    <span>Type</span>
                </div>

                <div class="row s9">
                    ${html.Render('input', {
                        attributes: {
                            value: type ? type : 'text'
                        },
                        select: () =>
                        {
                            return [
                                {group: '', title: 'None', value: 0},
                                {group: '', title: 'Plain Text', value: 'text'},
                                {group: '', title: 'Email', value: 'email'},
                                {group: '', title: 'Phone', value: 'tel'},
                                {group: '', title: 'Link', value: 'url'},
                                {group: '', title: 'File', value: 'file'},
                                {group: '', title: 'Radio', value: 'radio'},
                                {group: '', title: 'Checkbox', value: 'checkbox'},
                                {group: '', title: 'Password', value: 'password'},
                                {group: '', title: 'Date', value: 'date'},
                                {group: '', title: 'Date & Time', value: 'datetime-local'},
                                {group: '', title: 'Hidden', value: 'hidden'},
                            ];
                        },
                        variable: () => { return tag.Get('data'); },
                        onSelect: (target, item) =>
                        {
                            tag.Fn('attributes.set.key', 'type', item.value ? item.value : null);
                            tag.Fn('update.attributes');
                        }
                    })}
                </div>

                <div class="row s3">
                    <span>Name</span>
                </div>

                <div class="row s9">
                    ${html.Render('input', {
                        attributes: {
                            value: name,
                            placeholder: 'Name',
                        },
                        variable: () => { return tag.Get('data'); },
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
                            placeholder: 'Placeholder',
                        },
                        variable: () => { return tag.Get('data'); },
                        onChange: (target, value) =>
                        {
                            tag.Fn('attributes.set.key', 'placeholder', value ? value : null);
                            tag.Fn('update.attributes');
                        }
                    })}
                </div>

                <div class="row s3">
                    <span>Value</span>
                </div>

                <div class="row s9">
                    ${html.Render('input', {
                        attributes: {
                            value,
                            placeholder: 'Value',
                        },
                        variable: () => { return tag.Get('data'); },
                        onChange: (target, value) =>
                        {
                            tag.Fn('attributes.set.key', 'value', value ? value : null);
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
                    <span>Autocomplete</span>
                </div>

                <div class="row s4"></div>
                <div class="row s5">
                    ${html.Render('options', {
                        selected: autocomplete === 'OFF' ? 'OFF' : 'ON',
                        options: [
                            {icon: 'check', tooltip: 'Yes', value: 'ON'},
                            {icon: 'close', tooltip: 'No', value: 'OFF'},
                        ],
                        onClick: (target, option) =>
                        {
                            tag.Fn('attributes.set.key', 'autocomplete', option.value === 'ON' ? null : 'OFF');
                            tag.Fn('update.attributes');
                        }
                    })}
                </div>
            `;
        }
    });
});