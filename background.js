chrome.action.onClicked.addListener(tab => {
  if (!tab.url.includes('chrome://')) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['turbo-frame/init.js']
    })
  }
})
