chrome.runtime.onMessage.addListener(function(msg, sender){
  if (msg.text == "active"){
    tabId = sender.tab.id;
    chrome.pageAction.show(tabId);
    //chrome.browserAction.setIcon({path: '/icons/icon48.png', tabId: tabId});
  }
});
