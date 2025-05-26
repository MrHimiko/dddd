content.OnReady(function() 
{
    content.ItemAdd({
        id: 'content',
        name: 'Content',
        order: 30,
        condition: function (item, tag) 
        {
            return tag.Get('Block').Get('text');
        },
        html: function (content, tag) 
        {
            let embed = '';

            if(tag.Get('name') === 'embed')
            {
                embed = `
                    <div class="row">
                        ${html.Render('button', {
                            title: 'Open Code Editor',
                            onClick: () =>
                            {
                                tag.Fn('modal.embed');
                            }
                        }, {class: 'w100'})}
                    </div>
                `;
            }
            else if(tag.Get('name') === 'rich-text')
            {
                embed = `
                    <div class="row">
                        ${html.Render('button', {
                            title: 'Open Rich-Text Editor',
                            onClick: () =>
                            {
                                tag.Fn('modal.rich-text');
                            }
                        }, {class: 'w100'})}
                    </div>
                `;
            }

            return `
                <div class="row">
                    ${html.Render('textarea', {
                        value: tag.Fn('text.get'),
                        attributes: {
                            placeholder: tag.Fn('text.main.get'),
                            style: 'height: 150px;'
                        },
                        onChange: (target, value) =>
                        {
                            tag.Fn('text.set', value);
                            tag.Fn('update.text');
                        },
                        variable: () => { return tag.Get('data'); },
                    })}
                </div>



                ${embed}
            `;
        }
    });
});