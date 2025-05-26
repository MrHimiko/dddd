collections.items.BindClick('json.import', function(addon, event, target, item)
{
    let input = $('<input style="display: none" type="file" accept="application/JSON">');

    $('body').append(input);

    input.trigger('click');

    input.on('change', function(event) 
    {
        let file = event.target.files[0];

        if(!file) 
        {
            return input.remove();
        }

        let reader = new FileReader();

        reader.onload = function(event) 
        {
            try 
            {
                let json = JSON.parse(event.target.result);

                item.Set('save', json);
                item.Fn('settings');

                popup.notification('Data imported.', true);

            } 
            catch(error) 
            {
                console.log(error);
                popup.notification('Invalid JSON file provided.');
            }
            finally
            {
                input.remove();
            }
        };

        reader.readAsText(file);
    });
});