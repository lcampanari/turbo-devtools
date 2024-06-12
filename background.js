
chrome.action.onClicked.addListener(async (tab) => {
  if (tab.url.includes('chrome://')) return;

  const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
  const nextState = prevState === 'ON' ? 'OFF' : 'ON'

  chrome.action.setBadgeText({
    text: nextState,
    tabId: tab.id,
  });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['turbo-frame/init.js']
  })
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading') {
    chrome.action.setBadgeText({
      text: "OFF",
      tabId: tabId,
    });
  }
});