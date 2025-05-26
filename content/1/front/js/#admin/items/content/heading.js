content.OnReady(function() 
{
    if ( !$dh.client().permissions.includes("builder.developer") && !$dh.client().permissions.includes("*") ) {return};
    content.ItemAdd({
        id: 'heading',
        name: 'Heading',
        order: 20,
        condition: function (item, tag) 
        {
            return ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag.Get('name'));
        },
        html: function (content, tag) 
        {
            return `
                <div class="row s3">
                    <span>Convert</span>
                </div>

                <div class="row s9">
                    ${html.Render('options', {
                        selected: tag.Get('name'),
                        options: [
                            {title: 'H1', tooltip: 'Heading 1', value: 'h1'},
                            {title: 'H2', tooltip: 'Heading 2', value: 'h2'},
                            {title: 'H3', tooltip: 'Heading 3', value: 'h3'},
                            {title: 'H4', tooltip: 'Heading 4', value: 'h4'},
                            {title: 'H5', tooltip: 'Heading 5', value: 'h5'},
                            {title: 'H6', tooltip: 'Heading 6', value: 'h6'},
                        ],
                        onClick: (target, option) =>
                        {
                            tag.Fn('update.name', {name: option.value});
                        }
                    })}
                </div>
            `;
        }
    });
});