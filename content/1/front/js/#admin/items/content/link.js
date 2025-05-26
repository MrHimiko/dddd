content.OnReady(function() 
{
    content.ItemAdd({
        id: 'link',
        name: 'Link',
        order: 20,
        condition: function (item, tag) 
        {
            return tag.Get('Block').Get('name') === 'a';
        },
        html: function (item, tag) 
        {
            let type = tag.Fn('attributes.get.object', 'link-type').value;
            let settings = [];

            if(!type || type === 'page')
            {
                let page = tag.Fn('attributes.get.object', 'page-id').value;

                settings.push(`
                    <div class="row s3">
                        <span>Page</span>
                    </div>

                    <div class="row s9">
                        ${html.Render('input', {
                            attributes: {
                                value: page ? page : 0,
                            },
                            select: () =>
                            {
                                return pages.Fn('list');
                            },
                            onSelect: (target, item) =>
                            {
                                tag.Fn('attributes.set.key', 'page-id', item.value ? item.value : null);
                                tag.Fn('update.attributes');
                            }
                        })}
                    </div>
                `);
            }
            else if(type === 'url')
            {
                let href = tag.Fn('attributes.get.object', 'href').value;

                settings.push(`
                    <div class="row s3">
                        <span>Link</span>
                    </div>

                    <div class="row s9">
                        ${html.Render('input', {
                            attributes: {
                                placeholder: 'https://',
                                value: href,
                            },
                            onChange: (target, value) =>
                            {
                                tag.Fn('attributes.set.key', 'href', value ? value : null);
                                tag.Fn('update.attributes');
                            },
                            variable: () => { return tag.Get('data'); }
                        })}
                    </div>
                `);
            }
            else if(type === 'anchor')
            {
                let href = tag.Fn('attributes.get.object', 'href').value;

                if(href && href[0] === '#')
                {
                    href = href.substring(1);
                }

                settings.push(`
                    <div class="row s3">
                        <span>Scroll to</span>
                    </div>

                    <div class="row s9">
                        ${html.Render('input', {
                            attributes: {
                                placeholder: 'Target ID',
                                value: href,
                            },
                            onChange: (target, value) =>
                            {
                                if(value && value[0] === '#')
                                {
                                    value = value.substring(1);
                                }

                                tag.Fn('attributes.set.key', 'href', value ? ('#' + value) : null);
                                tag.Fn('update.attributes');
                            }
                        })}
                    </div>
                `);

                settings.push(`
                    <div class="row s3">
                        <span>Offset (px)</span>
                    </div>

                    <div class="row s9">
                        ${html.Render('input', {
                            attributes: {
                                placeholder: 'O',
                                value: tag.Fn('attributes.get.object', 'scroll-offset').value,
                            },
                            onChange: (target, value) =>
                            {
                                tag.Fn('attributes.set.key', 'scroll-offset', value);
                                tag.Fn('update.attributes');
                            }
                        })}
                    </div>
                `);


            }
            else if(type === 'phone')
            {
                let href = tag.Fn('attributes.get.object', 'href').value;

                if(href && href.startsWith('tel:'))
                {
                    href = href.substring(4);
                }

                settings.push(`
                    <div class="row s3">
                        <span>Phone</span>
                    </div>

                    <div class="row s9">
                        ${html.Render('input', {
                            attributes: {
                                placeholder: 'eg: +1 123456789',
                                value: href,
                            },
                            onChange: (target, value) =>
                            {
                                tag.Fn('attributes.set.key', 'href', value ? ('tel:' + value) : null);
                                tag.Fn('update.attributes');
                            },
                            variable: () => { return tag.Get('data'); }
                        })}
                    </div>
                `);
            }

            else if(type === 'email')
            {
                let href = tag.Fn('attributes.get.object', 'href').value;
                let email = null;
                let subject = null;

                if(href)
                {
                    href = href.split('?');
                }

                if(href && 0 in href && href[0] && href[0].startsWith('mailto:'))
                {
                    email = href[0].substring(7);
                }

                if(href && 1 in href && href[1])
                {
                    href[1] = dh.query('?' + href[1]);

                    if('subject' in href[1])
                    {
                        subject = href[1].subject;
                    }
                }

                settings.push(`
                    <div class="row s3">
                        <span>Email</span>
                    </div>

                    <div class="row s9">
                        ${html.Render('input', {
                            attributes: {
                                placeholder: 'eg: hi@divhunt.com',
                                id: 'content-link-email',
                                value: email,
                            },
                            onChange: (target, value) =>
                            {
                                if(!value)
                                {
                                    $('#content-link-subject').val('');

                                    tag.Fn('attributes.set.key', 'href', null);
                                    tag.Fn('update.attributes');

                                    return;
                                }

                                let subject = $('#content-link-subject').val();

                                if(subject)
                                {
                                    value = value + '?subject=' + subject;
                                }

                                tag.Fn('attributes.set.key', 'href', value ? ('mailto:' + value) : null);
                                tag.Fn('update.attributes');
                            }
                        })}
                    </div>

                    <div class="row s3">
                        <span>Subject</span>
                    </div>

                    <div class="row s9">
                        ${html.Render('input', {
                            attributes: {
                                placeholder: 'eg: I am reaching out to...',
                                id: 'content-link-subject',
                                value: subject,
                            },
                            onChange: (target, value) =>
                            {
                                let email = $('#content-link-email').val();

                                tag.Fn('attributes.set.key', 'href', value ? ('mailto:' + (email ? email : '') + '?subject=' + (value ? value : '')) : null);
                                tag.Fn('update.attributes');
                            }
                        })}
                    </div>
                `);
            }

            if(['page', 'url'].includes(type))
            {
                let rel = tag.Fn('attributes.get.object', 'rel').value;

                settings.push(`
                    <div class="row s3">
                        <span>Rel</span>
                    </div>

                    <div class="row s9">
                        ${html.Render('input', {
                            attributes: {
                                value: rel ? rel : 0,
                            },
                            select: () =>
                            {
                                return [
                                    {group: '', title: 'None', value: 0},
                                    {group: '', title: 'No Follow', value: 'nofollow'},
                                    {group: '', title: 'No Opener', value: 'noopener'},
                                    {group: '', title: 'No Referrer', value: 'noreferrer'},
                                ];
                            },
                            onSelect: (target, item) =>
                            {
                                tag.Fn('attributes.set.key', 'rel', item.value ? item.value : null);
                                tag.Fn('update.attributes');
                            }
                        })}
                    </div>
                `);
            }

            if(['page', 'url', 'email'].includes(type))
            {
                let target = tag.Fn('attributes.get.object', 'target').value;

                settings.push(`
                    <div class="row s3">
                        <span>New Tab</span>
                    </div>

                    <div class="row s4"></div>
                    <div class="row s5">
                        ${html.Render('options', {
                            selected: !!target,
                            options: [
                                {icon: 'check', tooltip: 'Yes', value: true},
                                {icon: 'close', tooltip: 'No', value: false},
                            ],
                            onClick: (target, option) =>
                            {
                                if(!option.value)
                                {
                                    tag.Fn('attributes.set.key', 'target', null);
                                    tag.Fn('update.attributes');
                                }
                                else
                                {
                                    tag.Fn('attributes.set.key', 'target', '_BLANK');
                                    tag.Fn('update.attributes');
                                }
                            }
                        })}
                    </div>
                `);
            }

            return `
                <div class="row s3">
                    <span>Type</span>
                </div>

                <div class="row s9">
                    ${html.Render('options', {
                        selected: type ? type : 'page',
                        options: [
                            {icon: 'page', tooltip: 'Page', value: 'page'},
                            {icon: 'link', tooltip: 'Link', value: 'url'},
                            {icon: 'anchor', tooltip: 'Anchor', value: 'anchor'},
                            {icon: 'phone', tooltip: 'Phone', value: 'phone'},
                            {icon: 'email', tooltip: 'Email', value: 'email'},
                        ],
                        onClick: (target, option) =>
                        {
                            tag.Fn('attributes.set.key', 'link-type', option.value);
                            tag.Fn('attributes.set.key', 'page-id', null);
                            tag.Fn('attributes.set.key', 'href', null);
                            tag.Fn('attributes.set.key', 'target', null);
                            tag.Fn('attributes.set.key', 'rel', null);

                            tag.Fn('update.attributes');

                            item.Replace('html');
                        }
                    })}
                </div>

                ${settings.join('')}
            `;
        }
    });
});