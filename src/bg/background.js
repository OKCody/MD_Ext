var oldContent = "";
var newContent = "";
var content = ""; // Needs to be global

var tabId = "";
var url = "";

var errorCount = 0;
var pollingInterval;

xhr = new XMLHttpRequest();
reader = new FileReader();

chrome.runtime.onMessage.addListener(function(msg, sender){
  errorCount = 0;
  if (msg.text == "watch"){
    chrome.storage.local.set({'tabId':sender.tab.id}); // action.js depends on this.
    tabId = sender.tab.id;
    url = sender.url;
    chrome.browserAction.setIcon({path: '/icons/icon48.png', tabId: tabId});
    getFile(url);
    pollingInterval = setInterval(function(){getFile(url)}, 250);

    // Fires when the page is refreshed
    chrome.webNavigation.onCompleted.addListener(function(details){
      if(details.tabId == tabId){
        oldContent = newContent;
        chrome.tabs.sendMessage(tabId, {text: "updateBody", newContent: showdownCall(newContent)});
      }
    });
  }
});

xhr.onload = function(){
  reader.readAsText(xhr.response);
}

reader.onload = function(e){
  content = e.srcElement.result;
  if(compare(content, oldContent)){
    // Do nothing if no change
  }
  else{
    oldContent = content;
    html = showdownCall(content);
    chrome.tabs.sendMessage(tabId, {text: "updateBody", content: html});
  }
  //xhr = null; // Might be a way to mitigate a memory leak
  //reader = null; // Might be a way to mitigate a memory leak
  delete xhr.onload;
  delete reader.onload;
  delete reader.result;
  //console.log(xhr);
  //console.log(reader);
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

function getFile(url){
  if(isAllowedURL(url)){
    getContent(url);
  }
}

function getContent(path){
  xhr.open("GET", path);
  xhr.responseType = "blob";
  xhr.send();
}

function compare(content, oldContent){
  if(oldContent == content){
    return true;
  }
  else{
    return false;
  }
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
