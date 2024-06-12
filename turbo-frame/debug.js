
class TurboDebugLogger {

    constructor() {
        this.handleTurboClick = this.handleTurboClick.bind(this);
        this.handleTurboVisit = this.handleTurboVisit.bind(this);
        this.handleTurboLoad = this.handleTurboLoad.bind(this);
        this.handleTurboFrameRender = this.handleTurboFrameRender.bind(this);
        this.handleTurboBeforePrefetch = this.handleTurboBeforePrefetch.bind(this);
        this.handleTurboBeforeFetchRequest = this.handleTurboBeforeFetchRequest.bind(this);
        this.handleTurboBeforeStreamRender = this.handleTurboBeforeStreamRender.bind(this);

    }


    setupEventListeners() {
        document.addEventListener('turbo:click', this.handleTurboClick);
        document.addEventListener('turbo:visit', this.handleTurboVisit);
        document.addEventListener('turbo:load', this.handleTurboLoad);
        document.addEventListener('turbo:frame-render', this.handleTurboFrameRender);
        document.addEventListener('turbo:before-prefetch', this.handleTurboBeforePrefetch);
        document.addEventListener('turbo:before-fetch-request', this.handleTurboBeforeFetchRequest);
        document.addEventListener('turbo:before-stream-render', this.handleTurboBeforeStreamRender);
    }

    removeEventListeners() {
        document.removeEventListener('turbo:click', this.handleTurboClick);
        document.removeEventListener('turbo:visit', this.handleTurboVisit);
        document.removeEventListener('turbo:load', this.handleTurboLoad);
        document.removeEventListener('turbo:frame-render', this.handleTurboFrameRender);
        document.removeEventListener('turbo:before-prefetch', this.handleTurboBeforePrefetch);
        document.removeEventListener('turbo:before-fetch-request', this.handleTurboBeforeFetchRequest);
        document.removeEventListener('turbo:before-stream-render', this.handleTurboBeforeStreamRender);
    }

    logMessage(event, ...messages) {
        console.log(`%cTurbo`,
            'font-weight: bold; color: lightgreen; border-radius: 3px; border: 1px solid lightgreen; display: inline-block;',
            ...messages,
            event);
    }

    handleTurboClick(event) {
        let clickMessage = '';
        if (event.target.getAttribute('data-turbo-stream') == 'true') {
            clickMessage = `act based on the contents of the turbo-stream returned from ${event.detail.url}`;
        }
        else {
            const frameId = this.getFrameId(event.target);
            clickMessage = `replace the contents of #${frameId} with the contents of <turbo-frame id="${frameId}"></turbo-frame> returned from ${event.detail.url}`;
        }
        this.logMessage(event,
            `Link with text "${event.target.innerText}" click was intercepted. Turbo will`,
            clickMessage);
    }

    handleTurboVisit(event) {
        this.logMessage(event,
            `Navigating to ${event.detail.url} with action "${event.detail.action}".`);
    }

    handleTurboLoad(event) {
        const visitStart = event.detail.timing.visitStart ? new Date(event.detail.timing.visitStart).toISOString() : '';
        const requestStart = event.detail.timing.requestStart ? new Date(event.detail.timing.requestStart).toISOString() : '';
        const requestEnd = event.detail.timing.requestEnd ? new Date(event.detail.timing.requestEnd).toISOString() : '';
        const visitEnd = event.detail.timing.visitEnd ? new Date(event.detail.timing.visitEnd).toISOString() : '';
        this.logMessage(event,
            `Loaded page from ${event.detail.url}.`,
            `\nVisit start: ${visitStart}`,
            `\nRequest start: ${requestStart}`,
            `\nRequest end: ${requestEnd}`,
            `\nVisit end: ${visitEnd}`
        );
    }

    handleTurboFrameRender(event) {
        const frameId = event.target.id;
        this.logMessage(event,
            `Rendered frame #${frameId} with the contents of the template received from`,
            event.detail.fetchResponse.response.url
        );
    }

    handleTurboBeforePrefetch(event) {
        this.logMessage(event,
            `Hover over link with text "${event.target.innerText}"  was intercepted. Turbo will prefetch.`);
    }

    handleTurboBeforeFetchRequest(event) {
        let openingTag = `<${event.target.localName}`;
        Array.from(event.target.attributes).forEach(attr => {
            if (attr.name.toLowerCase() !== 'class' && attr.name.toLowerCase() !== 'style') {
                openingTag += ` ${attr.name}="${attr.value}"`;
            }
        });
        openingTag += '>';

        this.logMessage(event,
            `Triggered by ${openingTag}, \nexecuting ${event.detail.fetchOptions.method} against ${event.detail.url}`);
    }

    handleTurboBeforeStreamRender(event) {
        let action = event.target.getAttribute('action');
        if (action == 'before' || action == 'after') {
            this.logMessage(event,
                `Received a stream of HTML that will insert the contents of the template received ${action} the contents of #${event.target.getAttribute('target')}`);
        }
        else {
            this.logMessage(event,
                `Received a stream of HTML that will ${action} the contents of #${event.target.getAttribute('target')} with the contents of the template received`);
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

if (!window.turboDebugLogger) {
    window.turboDebugLogger = new TurboDebugLogger();
    window.turboDebugLogger.setupEventListeners();
}
