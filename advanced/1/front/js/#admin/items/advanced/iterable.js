advanced.OnReady(() =>
{
    advanced.ItemAdd({
        id: 'iterable',
        name: 'Iterable',
        order: 200,
        condition: (item, tag) =>
        {
            return !tag.Get('source');
        },
        html: function (item, tag) 
        {
            let iterable = dh.command(tag.Get('iterable'));

            return `
                <div class="row s3">
                    <span modal-hover="Provide array to iterate.">Data</span>
                </div>
                <div class="row s9">
                    ${html.Render('input', {
                        attributes: {
                            value: iterable.name,
                            placeholder: "$blog->get('categories')",
                            id: 'dh-iterable-data',
                            autocomplete: 'off'
                        },
                        onChange: (target, value) =>
                        {
                            iterable.name = value;
                            tag.Fn('update.iterable', {iterable: iterable.toString()});
                        },
                        variable: () => { return tag.Get('data'); }
                    })}
                </div>

                <div class="row s3">
                    <span modal-hover="Set a key for each iterated element.">Key</span>
                </div>
                <div class="row s9">
                    ${html.Render('input', {
                        attributes: {
                            value: 'key' in iterable.options ? iterable.options.key[0] : 'value',
                            placeholder: "iterable",
                            id: 'dh-iterable-key',
                            autocomplete: 'off'
                        },
                        onChange: (target, value) =>
                        {
                            if(value)
                            {
                                iterable.options.key = [dh.slug(value)];
                            }
                            else
                            {
                                delete iterable.options['key'];
                            }

                            tag.Fn('update.iterable', {iterable: iterable.toString()});
                        }
                    })}
                </div>
            `;
        }
    });
});