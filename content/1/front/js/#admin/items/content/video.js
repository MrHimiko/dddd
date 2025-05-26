content.OnReady(function() 
{
    content.ItemAdd({
        id: 'video',
        name: 'Video',
        order: 20,
        condition: function(item, tag)
        {
            return tag.Get('name') === 'video';
        },
        html: function (item, tag) 
        {
            let src = tag.Fn('attributes.get.object', 'src').value;
            let poster = tag.Fn('attributes.get.object', 'poster').value;
            let controls = tag.Fn('attributes.get.object', 'controls').value;
            let autoplay = tag.Fn('attributes.get.object', 'autoplay').value;
            let loop = tag.Fn('attributes.get.object', 'loop').value;
            let muted = tag.Fn('attributes.get.object', 'muted').value;
            let css = {
                'object-position': tag.Fn('css.find', 'object-position', '50% 50%'),
                'object-fit': tag.Fn('css.find', 'object-position', null).value,
                'aspect-ratio': tag.Fn('css.find', 'aspect-ratio', null).value,
            }

            css['object-position'].value = (css['object-position'].value + '').split(' ');

            return `
                <div class="row s3">
                    <span>Source</span>
                </div>

                <div class="row s9">
                    ${storage.Render('upload.input', {
                        type: 'video',
                        value: {file: src},
                        category: 2,
                        onChange: function(target, value)
                        {
                            tag.Fn('attributes.set.key', 'src', value ? value : null);
                            tag.Fn('update.attributes');
                        },
                        variable: () => { return tag.Get('data'); }
                    }, {class: 'w100'})}
                </div>

                <div class="row s3">
                    <span>Cover</span>
                </div>

                <div class="row s9">
                    ${storage.Render('upload.input', {
                        value: {file: poster},
                        category: 1,
                        onChange: function(target, value)
                        {
                            tag.Fn('attributes.set.key', 'poster', value ? value : null);
                            tag.Fn('update.attributes');
                        },
                        variable: () => { return tag.Get('data'); }
                    }, {class: 'w100'})}
                </div>

                <div class="row s3">
                    <span>Size</span>
                </div>

                <div class="row s9">
                    ${html.Render('options', {
                        selected: css['object-fit'] ? css['object-fit'] : '',
                        options: [
                            {icon: 'close|common', tooltip: 'None', value: ''},
                            {icon: 'overflow-auto|builder', tooltip: 'Fill', value: 'fill'},
                            {icon: 'box-full|builder', tooltip: 'Cover', value: 'cover'},
                            {icon: 'box-half|builder', tooltip: 'Contain', value: 'contain'},
                            {icon: 'box-small|builder', tooltip: 'Scale Down', value: 'scale-down'},
                        ],
                        onClick: (target, option) =>
                        {
                            tag.Fn('css.set.key', null, null, 'object-fit', option.value ? option.value : null);
                            tag.Fn('update.css');
                        }
                    })}
                </div>

                <div class="row s3">
                    <span>Aspect Ratio</span>
                </div>

                <div class="row s9">
                    ${html.Render('options', {
                        selected: css['aspect-ratio'] ? css['aspect-ratio'] : '',
                        options: [
                            {title: 'Auto', tooltip: 'Auto', value: ''},
                            {title: '1:1', tooltip: '1/1', value: '1/1'},
                            {title: '4:3', tooltip: '4/3', value: '4/3'},
                            {title: '16:9', tooltip: '16/9', value: '16/9'},
                            {title: '16:10', tooltip: '16/10', value: '16/10'},
                        ],
                        onClick: (target, option) =>
                        {
                            if(option.value && !css['width'])
                            {
                                tag.Fn('css.set.key', null, null, 'width', '100%');
                            }

                            tag.Fn('css.set.key', null, null, 'aspect-ratio', option.value ? option.value : null);
                            tag.Fn('update.css');
                        }
                    })}
                </div>

                <div class="row s3">
                    <span>Position</span>
                </div>

                <div class="row s9 g10">
                    <div>
                        ${html.Render('input', {
                            attributes: {
                                autocomplete: 'off',
                                placeholder: 'Left',
                                value: css['object-position'].value.length === 2 ? css['object-position'].value[0] : '50%',
                                scroll: true,
                                units: 'px,%,em,rem,vw,vh',
                                'bind-change': 'css|builder.components.tags',
                                'dh-css-key': 'object-position',
                                'dh-css-val': '1/2',
                            }
                        })}
                    </div>
                    <div>
                        ${html.Render('input', {
                            attributes: {
                                autocomplete: 'off',
                                placeholder: 'Top',
                                value: css['object-position'].value.length === 2 ? css['object-position'].value[1] : '50%',
                                scroll: true,
                                units: 'px,%,em,rem,vw,vh',
                                'bind-change': 'css|builder.components.tags',
                                'dh-css-key': 'object-position',
                                'dh-css-val': '2/2',
                            }
                        })}
                    </div>
                </div>

                <div class="row s3">
                    ${html.Render('options', {
                        selected: controls ? controls : '',
                        labelBottom: 'Controls',
                        options: [
                            {icon: 'close', tooltip: 'No', value: ''},
                            {icon: 'check', tooltip: 'Yes', value: 'true'},
                        ],
                        onClick: (target, option) =>
                        {
                            tag.Fn('attributes.set.key', 'controls', option.value ? 'true' : null);
                            tag.Fn('update.attributes');
                        }
                    })}
                </div>

                <div class="row s3">
                    ${html.Render('options', {
                        selected: autoplay ? autoplay : '',
                        labelBottom: 'Autoplay',
                        options: [
                            {icon: 'close', tooltip: 'No', value: ''},
                            {icon: 'check', tooltip: 'Yes', value: 'true'},
                        ],
                        onClick: (target, option) =>
                        {
                            tag.Fn('attributes.set.key', 'autoplay', option.value ? 'true' : null);
                            tag.Fn('update.attributes');
                        }
                    })}
                </div>

                <div class="row s3">
                    ${html.Render('options', {
                        selected: loop ? loop : '',
                        labelBottom: 'Loop',
                        options: [
                            {icon: 'close', tooltip: 'No', value: ''},
                            {icon: 'check', tooltip: 'Yes', value: 'true'},
                        ],
                        onClick: (target, option) =>
                        {
                            tag.Fn('attributes.set.key', 'loop', option.value ? 'true' : null);
                            tag.Fn('update.attributes');
                        }
                    })}
                </div>

                <div class="row s3">
                    ${html.Render('options', {
                        selected: muted ? muted : '',
                        labelBottom: 'Muted',
                        options: [
                            {icon: 'close', tooltip: 'No', value: ''},
                            {icon: 'check', tooltip: 'Yes', value: 'true'},
                        ],
                        onClick: (target, option) =>
                        {
                            tag.Fn('attributes.set.key', 'muted', option.value ? 'true' : null);
                            tag.Fn('update.attributes');
                        }
                    })}
                </div>
            `;
        }
    });
});