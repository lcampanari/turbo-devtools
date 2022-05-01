function addStylesheet(path) {
  var head = document.getElementsByTagName('head')[0]
  var link = document.createElement('link')
  link.rel = 'stylesheet'
  link.type = 'text/css'
  link.href = chrome.runtime.getURL(path)
  head.appendChild(link)
}

function removeStylesheet(path) {
  var href = chrome.runtime.getURL(path)
  var linkElement = document.querySelectorAll('link[href="' + href + '"]')[0]

  if (linkElement) {
    linkElement.remove()
  }
}

function toggleDebugStylesheet(e) {
  var path = 'turbo-frame/debug.css'

  if (e.currentTarget.checked) {
    removeStylesheet(path)
  } else {
    addStylesheet(path)
  }
}

document
  .getElementById('turboFrameHighlighter')
  .addEventListener('change', toggleDebugStylesheet)
