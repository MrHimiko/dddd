collections.OnAction('put.item.slug.then', (addon, response, data, target) =>
{
    target.val(response.out.item.slug);
    collections.items.ItemGet(response.out.item.id).Set('name', response.out.item.slug);
});

collections.OnAction('put.item.name.then', (addon, response) =>
{
    collections.items.ItemGet(response.out.item.id).Set('name', response.out.item.name);
});