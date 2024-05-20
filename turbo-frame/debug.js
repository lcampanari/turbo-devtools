if (!window.turboFrameDebug) {

    class TurboFrameDebug {

        constructor() {
            this.debugStylesheetPath = 'turbo-frame/debug.css';
            this.enabled = false;
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
            document.addEventListener('turbo:before-fetch-response', this.handleTurboBeforeFetchResponse)
            console.log('Event listeners added')
        }

        removeEventListeners() {
            document.removeEventListener('turbo:before-fetch-response', this.handleTurboBeforeFetchResponse)
            console.log('Event listeners removed')
        }


        handleTurboBeforeFetchResponse(event) {
            console.log('turbo:before-fetch-response', event)
        }
    }

    window.turboFrameDebug = new TurboFrameDebug();
}
window.turboFrameDebug.toggleDebug();