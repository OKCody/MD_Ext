var oldContent = "";
var newContent = "";

var tabId = "";

var errorCount = 0;
var pollingInterval;

xhr = new XMLHttpRequest();
reader = new FileReader();

xhr.onload = function(){
  reader.readAsText(xhr.response);
}

reader.onload = function(e){
  compare(e.srcElement.result);
}

// In the event that the content is not able to be loaded after 5 attempts
// exit polling loop with error.
xhr.onerror = function(){
  console.log("XHR Error");
  if(errorCount >=4){
    clearInterval(pollingInterval); // Stops polling on 5th error
    console.log("Markdown file was possibly deleted.");
    console.log("Polling stopped. Refresh content page to restart.");
  }
  errorCount = errorCount + 1;
}

chrome.runtime.onMessage.addListener(function(msg, sender){
  errorCount = 0;
  if (msg.text == "watch"){
    console.log(sender);
    chrome.storage.local.set({'tabId':sender.tab.id}); // action.js depends on this.
    tabId = sender.tab.id;
    var windowId = sender.tab.windowId;
    chrome.browserAction.setIcon({path: '/icons/icon48.png', tabId: tabId});
    getFile(tabId);
    pollingInterval = setInterval(function(){getFile(tabId)}, 250);

    // Fires when the page is refreshed
    chrome.webNavigation.onCompleted.addListener(function(details){
      if(details.tabId == tabId){
        console.log("Refresh");
        oldContent = newContent;
        chrome.tabs.sendMessage(tabId, {text: "update", newContent: showdownCall(newContent)});
      }
    });
  }
});

function getFile(tabId){
  chrome.tabs.get(tabId, function(tab){
    var url = tab.url;
    if(isAllowedURL(url)){
      xhr.open("GET", url);
      xhr.responseType = "blob";
      xhr.send();
    }
  });
}

function compare(markdown){
  var newContent = markdown;
  if(oldContent == newContent){
    console.log("Same . . .");
  }
  if(oldContent != newContent){
    oldContent = newContent;
    chrome.tabs.sendMessage(tabId, {text: "update", newContent: showdownCall(newContent)});
    console.log("Different!");
  }
  //xhr = null; // Might be a way to mitigate a memory leak
  //reader = null; // Might be a way to mitigate a memory leak
  delete xhr.onload;
  delete reader.onload;
}

function showdownCall(newContent){
	var converter = new showdown.Converter();
	var html = converter.makeHtml(newContent);
	return html;
}

function isAllowedURL(url){
  // Create arrays of criteria which to check against
  var protocols = ['file:']; // should be first 5 characters. http:, https, file:,
  var extensions = ['md']; // should not include period
  var protocol = url.slice(0, 5);
  var extension = url.split('.').pop();
  // Check against criteria
  if(protocols.includes(protocol) && extensions.includes(extension)){
    return true;
  }
  else{
    return false;
  }
}
