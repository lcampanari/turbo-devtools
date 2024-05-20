if (!window.turboFrameDebug) {

    class TurboFrameDebug {

        constructor() {
            this.debugStylesheetPath = 'turbo-frame/debug.css';
            this.enabled = false;
            this.handleTurboClick = this.handleTurboClick.bind(this);
            this.handleTurboBeforeFetchResponse = this.handleTurboBeforeFetchResponse.bind(this);
            this.handleTurboBeforeStreamRender = this.handleTurboBeforeStreamRender.bind(this);
        }

        toggleDebug() {
            this.enabled = !this.enabled;
            this.toggleDebugStylesheet();
            if (this.enabled) {
                this.setupEventListeners();
            }
            else {
                this.removeEventListeners();

            }
        }

        toggleDebugStylesheet() {
            const href = chrome.runtime.getURL(this.debugStylesheetPath)
            const linkElement = document.querySelectorAll('link[href="' + href + '"]')[0]
            const turboFrames = document.querySelectorAll('turbo-frame')

            if (!turboFrames.length) return

            if (linkElement) {
                linkElement.remove()
            } else {
                const head = document.getElementsByTagName('head')[0]
                const link = document.createElement('link')
                link.rel = 'stylesheet'
                link.type = 'text/css'
                link.href = chrome.runtime.getURL(this.debugStylesheetPath)
                head.appendChild(link)
            }
        }

        setupEventListeners() {
            document.addEventListener('turbo:click', this.handleTurboClick)
            document.addEventListener('turbo:before-fetch-response', this.handleTurboBeforeFetchResponse)
            document.addEventListener('turbo:before-stream-render', this.handleTurboBeforeStreamRender);
        }

        removeEventListeners() {
            document.removeEventListener('turbo:click', this.handleTurboClick)
            document.removeEventListener('turbo:before-fetch-response', this.handleTurboBeforeFetchResponse)
            document.removeEventListener('turbo:before-stream-render', this.handleTurboBeforeStreamRender);
        }

        handleTurboClick(event) {
            const frameId = this.getFrameId(event.target);

            console.log(`%c${event.target.innerText}`,
                'font-weight: bold; text-decoration: underline;',
                'click was intercepted by Turbo which will',
                `replace the contents of #${frameId} with the contents of <turbo-frame id="${frameId}"></turbo-frame> returned from ${event.target.getAttribute('href')}`,
                event)

        }

        handleTurboBeforeFetchResponse(event) {
            const frameId = event.target.id;
            if (frameId) {
                console.log(`Turbo is replacing the contents of #${event.target.id} with the contents of <turbo-frame id="${frameId}"></turbo-frame> returned from ${event.target.getAttribute('src')}`,
                    event);
            }
            else {
                console.log(`Turbo is replacing the contents of the ${event.target.localName} element`,
                    event);
            }
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