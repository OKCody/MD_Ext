chrome.runtime.onMessage.addListener(function(msg, sender){
  if (msg.text == "active"){
    tabId = sender.tab.id;
    chrome.pageAction.show(tabId);
  }
  if (msg.text == "download"){
    chrome.downloads.download({url: msg.url, filename: msg.filename});
  }
});
