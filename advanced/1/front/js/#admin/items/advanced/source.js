advanced.OnReady(function() 
{
    advanced.ItemAdd({
        id: 'source',
        name: 'Source',
        order: 100,
        html: (item, tag) =>
        {
            return `
                <div class="row">
                    ${mdSources.Render('main', {
                        source: tag.Get('source'),
                        onSave: (source) =>
                        {
                            tag.Fn('update.source', {source})
                        },
                        variable: () => { return tag.Get('data'); }
                    })}
                </div>
            `;
        }
    });
});