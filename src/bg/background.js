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
  //Working!!! commented out to stop it running!!  >_<
  //setInterval(function(){check(sender)}, 1000);
  //check(sender);
});


// Hackish way of converting symbol entities to symbols courtsey of,
// https://stackoverflow.com/questions/7394748/whats-the-right-way-to-decode-a-string-that-has-special-html-entities-in-it/7394787#7394787
function decodeHTML(html) {
  var txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

function check(sender){
  chrome.tabs.get(sender.tab.id, function(result){
    console.log(result.url);
    var blob = null;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", result.url);
    xhr.responseType = "blob";
    xhr.onload = function(){
      blob = xhr.response;
      console.log(blob);
      const reader = new FileReader();
      reader.addEventListener('loadend', (e) => {
        const contents = e.srcElement.result;
        // The following line should not be necessary.  Do not write to
        // storage.local if the file has not changed.  No sense in that.
        chrome.storage.local.set({'updated_markdown': contents}, function(){
          chrome.storage.local.get(['markdown','updated_markdown','tabID'], function(result){
            if(decodeHTML(result.markdown) == decodeHTML(result.updated_markdown)){
              console.log('same');
            }
            else{
              console.log('not same');
              chrome.tabs.reload(result.tabID);
            }
          });
        })
      });
      reader.readAsBinaryString(blob);
    };
    xhr.send()
  });
}
