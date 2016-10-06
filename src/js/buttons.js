let Buttons = {
    CLICK: 'data-click',
    CLICKED_CLASSNAME: 'clicked',
    CLICKED_ANIMATION_DURATION: 100,

    init: (btns) => {
        for (let i = 0; i < btns.length; i++) {
            let button = btns[i];

            button.addEventListener('mousedown', () => button.classList.add(Buttons.CLICKED_CLASSNAME));

            button.addEventListener('mouseup', (event) => Buttons.click(button, event));


            button.addEventListener('mouseleave', () => {
                button.classList.remove('clicked');
            });
        }
    },

    initForms: (forms) => {
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i];

            form.addEventListener('submit', (event) => Buttons.click(form, event));
        }
    },

    click: (button, event) => {
        event.stopPropagation();
        event.preventDefault();
        setTimeout(() => {
            button.classList.remove(Buttons.CLICKED_CLASSNAME);

            if (button.hasAttribute(Buttons.CLICK)) {
                let functionName = button.getAttribute(Buttons.CLICK).split('.');
                if (functionName.length) {
                    let fn = window;
                    for (let i = 0; i < functionName.length; i++) {
                        fn = fn[functionName[i]];
                    }
                    fn(button);
                }
            }
        }, Buttons.CLICKED_ANIMATION_DURATION);
    }

};