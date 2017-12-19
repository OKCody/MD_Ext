chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg.text == "updateCSS") {
    //Stores tab.id of content script -the only one that matters.
    //Uses value from storage.local if needed in context of any other script
    if(msg.from == "content.js"){
      sendResponse({tab: sender.tab.id}); //sends tab ID to content script
      var tabID = chrome.storage.local.set({tabID: sender.tab.id});
    }
    chrome.storage.local.get('style', function(result){
      chrome.tabs.insertCSS(tabID, {code: result.style});
      //Something like the following might be necessary to prevent sequential
      //  stylesheet insertions from cascading. Below should ~REPLACE~ the
      //  what is originally inserted in the "content.js" section above.  
      //var css = document.createElement("style");
      //css.type = "text/css";
      //css.innerHTML = result.style;
      //chrome.tabs.executeScript(tabID, {code: }document.body.appendChild(css));
    });
  }
});
