advanced.OnReady(() =>
{
    advanced.ItemAdd({
        id: 'conditions',
        name: 'Conditions',
        order: 400,
        html: function (item, tag) 
        {
            let visibility = tag.Get('conditions').visibility;
  
            return `
                <div class="row">
                    ${mdOperators.Render('listing', 
                    {
                        label: 'Visibility Condition',
                        items: Array.isArray(visibility) ? visibility : [],
                        onChange: function(items)
                        {
                            tag.Fn('update.conditions', {visibility: items});
                        },
                        variable: () => { return tag.Get('data'); },
                    })}
                </div>
            `;
        }
    });
});