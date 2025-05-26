content.OnReady(function() 
{
    content.ItemAdd({
        id: 'settings',
        name: 'Settings',
        order: 10,
        actions: (item, tag, data) =>
        {
            let show = data('show', []);
            let settings = {
                ID: tag.Fn('attributes.get.object', 'id').value,
                Class: tag.Fn('attributes.get.object', 'class').value,
                Visibility: tag.Fn('attributes.get.object', 'hidden').value
            };

            if((settings.ID && settings.Class && settings.Visibility) || show.length >= 3)
            {
                return '';
            }

            let items = [];

            $.each(settings, (key, value) =>
            {
                if(!value && !show.includes(key.toLowerCase())) 
                {
                    items.push(
                        html.Render('button', {
                            title: '+' + key,
                            onClick: () => {
                                html.Fn('group.open', 'content-settings');

                                let show = data('show', []);
                                show.push(key.toLowerCase());
                
                                item.Replace('html', {show});
                            }
                        }, {class: 'mark'})
                    ); 
                }
            });

            return items.join('');
        },
        html: function (item, tag, data) 
        {
            let show = data('show', []);
            
            let id = tag.Fn('attributes.get.object', 'id').value;
            let cls = tag.Fn('attributes.get.object', 'class').value;
            let visibility = tag.Fn('attributes.get.object', 'hidden').value;

            let settings = [];

            if(id || show.includes('id'))
            {
                settings.push(`
                    <div class="row s3">
                        <span>ID</span>
                    </div>

                    <div class="row s9">
                        ${html.Render('input', {
                            attributes: {
                                value: id,
                                placeholder: 'identifier',
                                autocomplete: 'off'
                            },
                            onChange: (target, value) =>
                            {
                                tag.Fn('attributes.set.key', 'id', value ? value : null);
                                tag.Fn('update.attributes');
                            },
                            variable: () => { return tag.Get('data'); }
                        })}
                    </div>
                `);
            }

            if(cls || show.includes('class'))
            {
                settings.push(`
                    <div class="row s3">
                        <span>Class</span>
                    </div>

                    <div class="row s9">
                        ${html.Render('input', {
                            attributes: {
                                value: cls,
                                placeholder: 'class-name',
                                autocomplete: 'off'
                            },
                            onChange: (target, value) =>
                            {
                                tag.Fn('attributes.set.key', 'class', value ? value : null);
                                tag.Fn('update.attributes');
                            },
                            variable: () => { return tag.Get('data'); }
                        })}
                    </div>
                `);
            }

            if(visibility || show.includes('visibility'))
            {
                settings.push(`
                    <div class="row s3">
                        <span>Visibility</span>
                    </div>

                    <div class="row s4"></div>
                    <div class="row s5">
                        ${html.Render('options', {
                            selected: !!!visibility,
                            options: [
                                {icon: 'overflow-visible|builder', tooltip: 'Show', value: true},
                                {icon: 'overflow-hidden|builder', tooltip: 'Hide', value: false},
                            ],
                            onClick: (target, option) =>
                            {
                                if(option.value)
                                {
                                    tag.Fn('attributes.set.key', 'hidden', null);
                                    tag.Fn('update.attributes');
                                }
                                else
                                {
                                    tag.Fn('attributes.set.key', 'hidden', 'true');
                                    tag.Fn('update.attributes');
                                }
                            }
                        })}
                    </div>
                `);
            }
            
            return settings.join('');
        }
    });
});