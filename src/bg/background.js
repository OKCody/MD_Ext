chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg.text == "updateCSS") {
    if(msg.from == "content.js"){
      sendResponse({tab: sender.tab.id}); //sends tab ID to content script
      var tabID = chrome.storage.local.set({tabID: sender.tab.id});
    }

    /*
    // Dec. 27, 2017

    // The following 3 lines implements the debugger API which is necessary for
    // using the printToPDF function from within the browser. It does not work
    // throwing the error,

    // Unchecked runtime.lastError while running
    // debugger.sendCommand: {"code":-32000,"message":"PrintToPDF is not
    // implemented"}

    // This is apparently because this function only works with headless Chrome
    // despite it being listed in the debugger API for use with extensions. This
    //  makes me hopeful that it will be implemented soon.
    // -Chrome: v63.0, Canary: v65.0 both give the same error.

    // Applicable documentation:
    // https://developer.chrome.com/extensions/debugger
    // https://developer.chrome.com/devtools/docs/integrating
    // https://chromedevtools.github.io/devtools-protocol  (Page.printToPDF)

    // ---

    console.log(sender.tab.id);
    chrome.debugger.attach({tabId:sender.tab.id}, "1.0");
    chrome.debugger.sendCommand({tabId:sender.tab.id}, 'Page.printToPDF', function(data){console.log(data)});
    */
  }
});
