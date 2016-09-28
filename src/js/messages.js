let Messages = {
    init: () => {
        let headerButtons = document.querySelectorAll('body > header .button');
        buttons.init(headerButtons);

        Messages.placeholders.init();
    },

    load: () => {
        if (Math.random() > .2) {
            Messages.placeholders.removeAll();

            for (let i = 0; i < messagesSample.length; i++) {
                Messages.message.add(messagesSample[i]);
            }

            if (!messagesSample.length) {
                Messages.empty.add();
            }

        } else {
            Messages.failed.add();
        }
    },
    reload: () => {
        Messages.failed.remove();

        setTimeout(Messages.load, Math.round(Math.random() * 1500));
    },

    message: {
        submit: (button)=> {
            if (!button.classList.contains('progress')) {
                button.classList.add('progress');
                setTimeout(() => {
                    let messageForm = document.querySelector('.message-dialog form');

                    let message = {
                        createdOn: new Date(),
                        userName: currentUser.userName,
                        userId: currentUser.userId,
                        formatted: messageForm.querySelector('.textarea').textContent,
                        iconPath: messageForm.querySelector('.icons .active').getAttribute('data-path'),
                        images: []
                    };

                    Messages.message.add(message);

                    // icon
                    // message || image
                    // image, gps, date?

                    // on success:
                    Messages.message.dialog.remove();
                    button.classList.remove('progress');
                }, 1500);
            }
        },

        add: (message) => {
            let template =
                `<article class="${currentUser.userId == message.userId ? 'my' : ''}" data-id="${message.id}" data-date="${dateTime.formatDate(message.createdOn)}">
    <header>
        <h1 style="background-image: url('/images/${message.iconPath}.png')"></h1>
    </header>
    <main>          
        ${Messages.message.images(message.images)}
        
        ${Messages.message.formatted(message)}
            
        <footer>${dateTime.formatDate(new Date()) != dateTime.formatDate(message.createdOn) ? dateTime.formatDate(message.createdOn) + ',' : ''} <b>${dateTime.formatTime(message.createdOn)}</b></footer>
    </main>
</article>`;

            let messages = document.querySelector('.messages');
            if (messages.querySelector('article:first-child')
                && messages.querySelector('article:first-child').hasAttribute('data-date')
                && messages.querySelector('article:first-child').getAttribute('data-date') != dateTime.formatDate(message.createdOn)) {
                messages.insertAdjacentHTML('afterbegin', Messages.message.separator(messages.querySelector('article:first-child').getAttribute('data-date')));
            }

            messages.insertAdjacentHTML('afterbegin', template);
            buttons.init(messages.querySelectorAll('article:first-child .button'));
        },

        images: (images) => {
            if (!images.length) {
                return '';
            }

            return `<section class="image">${images.map(Messages.message.image).join('')}</section>`;
        },
        image: (image)=> {
            return `<span class="button thumbnail" data-click="Messages.image.dialog.add" data-url="${image.url}" style="background-image: url('/images/${image.thumbUrl}')"></span>`;
        },

        formatted: (message) => {
            if (!message.formatted) {
                return '';
            }

            return `<section><p><b>${message.userName}:</b> ${message.formatted}</p></section>`;
        },

        separator: (createdOn) => {
            return `<div class="seperator"><span><b>${createdOn}</b></div>`;
        },

        dialog: {
            add: (button) => {
                let template =
                    `<section class="message-dialog">
    <header>
        <span class="close_button"><a class="button" data-click="Messages.message.dialog.remove"><span>&#43;</span></a></span>
    </header>
    <form>
        <ul class="icons">
            ${Messages.message.dialog.icons()}                                                                        
        </ul>
        
        <p class="textarea" contenteditable="true"></p>
                       
        <p><a class="button" data-click="Messages.message.submit"><span>&gt;</span><span class="progress">...</span></a></p>
    </form>
</section>`;

                document.body.insertAdjacentHTML('beforeend', template);

                setTimeout(() => {
                    document.querySelector('.message-dialog').classList.add('active');

                    buttons.init(document.querySelectorAll('.message-dialog .button'));

                    let textarea = document.querySelector('.message-dialog .textarea');
                    textarea.addEventListener('paste', () => {
                        setTimeout(() => {
                            textarea.innerHTML = textarea.textContent;
                        }, 1);
                    });
                }, 100);
            },
            remove: () => {
                let dialog = document.querySelector('.message-dialog');

                dialog.classList.remove('active');

                setTimeout(() => {
                    dialog.parentNode.removeChild(dialog);
                }, 300);
            },

            icons: () => {
                return currentUser.icons.map(Messages.message.dialog.icon).join('');
            },
            icon: (icon)=> {
                return `<li class="button" data-click="Messages.message.dialog.selectIcon" data-path="${icon.url}" style="background-image: url('/images/${icon.url}.png')"></li>`;
            },
            selectIcon: (li)=> {
                let icons = li.parentNode.querySelectorAll('li');
                for (let i = 0; i < icons.length; i++) {
                    let icon = icons[i];

                    icon.classList.remove('active');
                }

                li.classList.add('active');
            }
        }
    },

    image: {
        dialog: {
            add: (thumbnail) => {
                let template = `<div class="image-dialog">
    <header>
        <span class="close_button"><a class="button" data-click="Messages.image.dialog.remove"><span>&#43;</span></a></span>
    </header>
    <main></main>
</div>`;

                thumbnail.insertAdjacentHTML('afterend', template);
                let imageDialog = document.querySelector('.image-dialog');
                buttons.init([imageDialog]);

                let image = new Image();
                image.src = '/images/' + thumbnail.getAttribute('data-url');
                image.addEventListener('load', () => {
                    imageDialog.querySelector('main').appendChild(image);

                    setTimeout(() => {
                        imageDialog.classList.add('active');
                    }, 1000);
                });

                setTimeout(() => {
                    thumbnail.classList.add('active');
                    buttons.init(document.querySelectorAll('.image-dialog .button'));
                }, 100);
            },
            remove: (button) => {
                let dialog = document.querySelector('.image-dialog');
                let image = dialog.previousSibling;

                image.classList.remove('active');

                setTimeout(() => {
                    dialog.parentNode.removeChild(dialog);
                }, 300);
            }

        }
    },

    placeholders: {
        init: () => [1, 2, 3, 4].map(Messages.placeholders.add),
        add: () => {
            let template =
                `<article class="placeholder">
                    <header><h1></h1></header>
                    <main>          
                        <section><p><b>&middot;&nbsp;&middot;&nbsp;&middot;</b></p></section>
                        <footer></footer>
                    </main>
                </article>`;

            document.querySelector('.messages').insertAdjacentHTML('beforeend', template);
        },
        removeAll: () => {
            let placeholders = document.getElementsByClassName('messages')[0].getElementsByClassName('placeholder');
            for (let i = placeholders.length; i--;) {
                let placeholder = placeholders[i];
                document.querySelector('.messages').removeChild(placeholder);
            }
        }
    },

    empty: {
        add: () => {
            let template =
                `<article>Tak tady se asi ještě diskuse moc nerozjela.</article>`;

            document.querySelector('.messages').insertAdjacentHTML('beforeend', template);
        }
    },
    failed: {
        add: () => {
            let template =
                `<div class="overlay alert">
    <span class="button" data-click="Messages.reload">Zatím se nepodařilo nic nahrát. <br/> Zkuste to prosím ještě jednou.</span>
</div>`;

            document.body.insertAdjacentHTML('beforeend', template);
            buttons.init(document.querySelectorAll('.overlay .button'));
        },
        remove: () => {
            let overlays = document.getElementsByClassName('overlay');
            for (let i = overlays.length; i--;) {
                let overlay = overlays[i];
                document.body.removeChild(overlay);
            }
        }
    }
};

let dateTime = {
    formatDate: (date)=> {
        let dayNames = ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So'];

        return dayNames[date.getDay()] + ' ' + date.getDate() + '.' + (date.getMonth() + 1) + '. ' + date.getFullYear();
    },

    formatTime: (date) => {
        return ('0' + date.getHours()).slice(-2) + '.' + ('0' + date.getMinutes()).slice(-2);
    }
};



