$(document).on('page/ready', function(event, addon)
{

    if(!$dh.client()['admin'] || (!$dh.client().permissions.includes("collections.view") && !$dh.client().permissions.includes("*")))
    {
        return;
    }

    html.navbar.ItemAdd({
        position: 'left',
        name: 'Collections',
        active: addon.GetName() === 'collections',
        href: function (item, attributes, application)
        {
            if(item.Get('active'))
            {
                return builder.Route('builder');
            }

            return collections.Route('home');
        },
        html: function (item, attributes, application)
        {
            return dh.icon('app-collections', 18, 'common');
        }
    });

    if(addon.GetName() === 'admin')
    {
        html.sidebar.menu.ItemsAdd({
            type: 'admin',
            order: -1,
            group: 'Applications',
            title: 'Collections',
            icon: 'app-collections',
            href: collections.Route('home')
        });
    }
});