collections.FieldAdd('name');
collections.FieldAdd('group');
collections.FieldAdd('description');
collections.FieldAdd('count');
collections.FieldAdd('order');
collections.FieldAdd('global');
collections.FieldAdd('variable');
collections.FieldAdd('nest');
collections.FieldAdd('storage');
collections.FieldAdd('config');
collections.FieldAdd('share');
collections.FieldAdd('active');
collections.FieldAdd('client');
collections.FieldAdd('split');

collections.FieldAdd('fields', null, function(value)
{
    if(!value || typeof value !== 'object')
    {
        return {};
    }

    return value;
});

collections.FieldAdd('items', null, function(value)
{
    if(!value || typeof value !== 'object')
    {
        return {};
    }

    return value;
});

collections.FieldAdd('tabs', null, (value) =>
{
    if(!value || typeof value !== 'object')
    {
        return {};
    }

    return value;
});

collections.FieldAdd('Tab', (value, item) =>
{
    let tab = null;
    
    $.each(item.Get('tabs'), (index, find) =>
    {
        tab = find;
        return false;
    });

    return tab;
});

/* Items */

collections.items = Addons.create(collections.GetName() + '.items', function(item)
{
    item.FieldAdd('name');
    item.FieldAdd('slug');
    item.FieldAdd('order');
    item.FieldAdd('fields');
    item.FieldAdd('seo');
    item.FieldAdd('schedule');
    item.FieldAdd('published');
    item.FieldAdd('client');
    item.FieldAdd('updated');
    item.FieldAdd('created');
    item.FieldAdd('save');
    
    item.FieldAdd('collection');
    item.FieldAdd('Collection', function(value, item)
    {
        return collections.ItemGet(item.Get('collection'));
    });

    item.FieldAdd('parent');
    item.FieldAdd('Parent', function(value, item)
    {
        return collections.items.ItemGet(item.Get('parent'));
    });
});

/* Tabs */

collections.tabs = Addons.create(collections.GetName() + '.tabs', function(tabs)
{
    tabs.FieldAdd('name');
    tabs.FieldAdd('description');
    
    tabs.FieldAdd('collection');
    tabs.FieldAdd('Collection', function(value, item)
    {
        return collections.ItemGet(item.Get('collection'));
    });

    tabs.FieldAdd('sections', null, function(value)
    {
        if(!value || typeof value !== 'object')
        {
            return {};
        }

        return value;
    });

    tabs.FieldAdd('sections[]', function(value, item)
    {
        let array = $.map(item.Get('sections'), function(value) { return [value]; });

        array.sort((a, b) => a.Get('order') - b.Get('order'));

        return array;
    });

    /* Sections */

    tabs.sections = Addons.create(tabs.GetName() + '.sections', function(sections)
    {
        sections.FieldAdd('name');
        sections.FieldAdd('order');

        sections.FieldAdd('tab');
        sections.FieldAdd('Tab', function(value, item)
        {
            return collections.tabs.ItemGet(item.Get('tab'));
        });

        sections.FieldAdd('collection');
        sections.FieldAdd('Collection', function(value, item)
        {
            return collections.ItemGet(item.Get('collection'));
        });

        sections.FieldAdd('fields', null, function(value)
        {
            if(!value || typeof value !== 'object')
            {
                return {};
            }

            return value;
        });

        sections.FieldAdd('fields[]', function(value, item)
        {
            let array = $.map(item.Get('fields'), function(value) { return [value]; });

            array.sort((a, b) => a.Get('order') - b.Get('order'));

            return array;
        });
    });
});

/* Fields */

collections.fields = Addons.create(collections.GetName() + '.fields', function(fields)
{
    fields.FieldAdd('name');
    fields.FieldAdd('width');
    fields.FieldAdd('list');
    fields.FieldAdd('settings', null, function(value)
    {
        if(!value || typeof value !== 'object')
        {
            return {};
        }

        return value;
    });
    fields.FieldAdd('order');

    fields.FieldAdd('type');
    fields.FieldAdd('Type', function(value, item)
    {
        return collections.fields.types.ItemGet(item.Get('type'));
    });

    fields.FieldAdd('section');
    fields.FieldAdd('Section', function(value, item)
    {
        return collections.tabs.sections.ItemGet(item.Get('section'));
    });

    fields.FieldAdd('collection');
    fields.FieldAdd('Collection', function(value, item)
    {
        return collections.ItemGet(item.Get('collection'));
    });

    /* Types */
    fields.types = Addons.create(fields.GetName() + '.types', function(fields)
    {
        fields.FieldAdd('name');
        fields.FieldAdd('description');
        fields.FieldAdd('icon');
    });
});