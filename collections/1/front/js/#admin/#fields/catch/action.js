/* Field */
collections.OnAction('put.field.then', (addon, response) =>
{
    let item = addon.fields.ItemAdd(response.out.field, false);

    item.Replace('html');
});