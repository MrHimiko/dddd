mdActions.OnReady(() => 
{
    return;
    
    mdActions.ItemAdd({
        id: 'collections.create',
        group: 'Collections',
        name: 'Create',
        icon: 'https://global.divhunt.com/13c1a27fc562bc29e119efe8f85a4eb7_542.svg',
        description: 'Create new collection item.',
        config: () => 
        {
            return {
                collection: {
                    label: 'Collectione',
                    type: 'SOURCE',
                    values: () => 
                    {
                        return [
                            {title: 'Add', value: 'add'},
                            {title: 'Remove', value: 'remove'},
                            {title: 'Toggle', value: 'toggle'}
                        ]
                    },
                }
            };
        },
        code: (data, resolve, reject) => 
        {
            switch(data.values.type)
            {
                case 'add':
                    data.target.addClass(data.values.value);
                    break;
                case 'remove': 
                    data.target.removeClass(data.values.value);
                    break;
                case 'toggle':
                    data.target.toggleClass(data.values.value);
                    break;
            }

            resolve();
        }
    });
});
