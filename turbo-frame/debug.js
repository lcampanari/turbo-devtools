if (!window.turboFrameDebug) {

    class TurboFrameDebug {

        constructor() {
            this.debugStylesheetPath = 'turbo-frame/debug.css';
            this.enabled = false;
            this.handleTurboClick = this.handleTurboClick.bind(this);
            this.handleTurboBeforePrefetch = this.handleTurboBeforePrefetch.bind(this);
            this.handleTurboBeforeFetchRequest = this.handleTurboBeforeFetchRequest.bind(this);
            this.handleTurboBeforeStreamRender = this.handleTurboBeforeStreamRender.bind(this);
        }

        toggleDebug() {
            this.enabled = !this.enabled;
            if (this.enabled) {
                this.setupEventListeners();
            }
            else {
                this.removeEventListeners();

            }
        }

        setupEventListeners() {
            document.addEventListener('turbo:click', this.handleTurboClick);
            document.addEventListener('turbo:before-prefetch', this.handleTurboBeforePrefetch);
            document.addEventListener('turbo:before-fetch-request', this.handleTurboBeforeFetchRequest);
            document.addEventListener('turbo:before-stream-render', this.handleTurboBeforeStreamRender);
        }

        removeEventListeners() {
            document.removeEventListener('turbo:click', this.handleTurboClick);
            document.removeEventListener('turbo:before-prefetch', this.handleTurboBeforePrefetch);
            document.removeEventListener('turbo:before-fetch-request', this.handleTurboBeforeFetchRequest);
            document.removeEventListener('turbo:before-stream-render', this.handleTurboBeforeStreamRender);
        }

        handleTurboClick(event) {
            const frameId = this.getFrameId(event.target);
            console.log(`%c${event.target.innerText}`,
                'font-weight: bold; text-decoration: underline;',
                'click was intercepted by Turbo which will',
                `replace the contents of #${frameId} with the contents of <turbo-frame id="${frameId}"></turbo-frame> returned from ${event.detail.url}`,
                event)

        }

        handleTurboBeforePrefetch(event) {
            console.log(`%c${event.target.innerText}`,
            'font-weight: bold; text-decoration: underline;',
            'hover was intercepted by Turbo which will',
            `prefetch.`,
            event);
        }

        handleTurboBeforeFetchRequest(event) {
            console.log(`Turbo is fetching ${event.detail.url}`, event);
        }

        handleTurboBeforeStreamRender(event) {
            let action = event.target.getAttribute('action');
            if (action == 'before' || action == 'after') {
                console.log(`Turbo has received a stream of html that will insert the contents of the template received ${action} the contents of #${event.target.getAttribute('target')}`, event)
            }
            else {
                console.log(`Turbo has received a stream of html that will ${action} the contents of #${event.target.getAttribute('target')} with the contents of the template received`, event)
            }

        }

        getFrameId(element) {
            const frameId = element.getAttribute('data-turbo-frame');
            if (!frameId) {
                while (element.parentElement) {
                    if (element.localName === 'turbo-frame') {
                        const parentFrameId = element.id;
                        return parentFrameId;
                    }
                    element = element.parentElement;
                }
            }
            return frameId;
        }

    }

    window.turboFrameDebug = new TurboFrameDebug();
}
window.turboFrameDebug.toggleDebug();