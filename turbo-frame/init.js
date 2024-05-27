
if (!window.turboFrameInit) {
    class TurboFrameInit {
        constructor() {
            this.debugStylesheetPath = 'turbo-frame/debug.css';
            this.debugJSPath = 'turbo-frame/debug.js';
            this.enabled = false;

        }

        toggleDebug() {
            this.enabled = !this.enabled;
            this.toggleDebugElements();
        }

        toggleDebugElements() {
            const href = chrome.runtime.getURL(this.debugStylesheetPath)
            const src = chrome.runtime.getURL(this.debugJSPath);
            const linkElement = document.querySelectorAll('link[href="' + href + '"]')[0];
            const turboFrames = document.querySelectorAll('turbo-frame');
            const scriptElement = document.querySelectorAll('script[src="' + src + '"]')[0];

            if (!turboFrames.length) return

            if (this.enabled) {
                const head = document.getElementsByTagName('head')[0]
                const link = document.createElement('link')
                link.rel = 'stylesheet'
                link.type = 'text/css'
                link.href = href;
                head.appendChild(link);

                if (!scriptElement) {
                    const script = document.createElement('script');
                    script.src = src;
                    document.head.appendChild(script);
                }

            }
            else {
                linkElement.remove();
            }
        }


    }

    window.turboFrameInit = new TurboFrameInit();
}
window.turboFrameInit.toggleDebug();
