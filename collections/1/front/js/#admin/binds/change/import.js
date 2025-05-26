collections.BindChange('import', function(addon, event, target)
{
    let collection = collections.ItemGet(target.attr('data-collection'));

    if(collection && event.target.files.length)
    {
        let file = event.target.files[0];

        mdLibraries.Fn('load', ['papaparse'], () => 
        {
            Papa.parse(file, {
                error: function(err, file, inputElem, reason)
                {
                    console.log(err, file, reason);
                },
                complete: function(csv)
                {
                    if(csv.data.length < 2)
                    {
                        return popup.notification('Invalid CSV file format. 0 items returned.');
                    }

                    csv.data.forEach((value, index) =>
                    {
                        if(value.length !== csv.data[0].length)
                        {
                            delete csv.data[index];
                        }
                    });

                    collection.Replace('import', {
                        csv: csv.data.filter(Boolean)
                    });
                }
            });
        });
    }
    
    target.val('');
});