function toggleDebugStylesheet() {
  var path = 'turbo-frame/debug.css'
  var href = chrome.runtime.getURL(path)
  var linkElement = document.querySelectorAll('link[href="' + href + '"]')[0]

  if (linkElement) {
    linkElement.remove()
  } else {
    var head = document.getElementsByTagName('head')[0]
    var link = document.createElement('link')
    link.rel = 'stylesheet'
    link.type = 'text/css'
    link.href = chrome.runtime.getURL(path)
    head.appendChild(link)
  }
}

chrome.action.onClicked.addListener(tab => {
  if (!tab.url.includes('chrome://')) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: toggleDebugStylesheet
    })
  }
})
