var oldContent = "";
var newContent = "";

chrome.runtime.onMessage.addListener(function(msg, sender){
  if (msg.text == "watch"){
    console.log(sender);
    //var url = sender.url;
    var tabId = sender.tab.id;
    var windowId = sender.tab.windowId;
    //poll(tabId); // call once then start loop b/c loop begins w/ delay
    setInterval(function(){poll(tabId)}, 100); //repeating

    // Fires when the page is refreshed
    chrome.webNavigation.onCompleted.addListener(function(details){
      if(details.tabId == tabId){
        console.log("eureka!");
        oldContent = newContent;
        chrome.tabs.sendMessage(tabId, {text: "update", newContent: showdownCall(newContent)});
      }
    });
  }
});

function poll(tabId){
  var tab = chrome.tabs.get(tabId, function(tab){
    var url = tab.url;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.onload = function(){
      const reader = new FileReader();
      reader.addEventListener('loadend', function(e){helper(reader, tabId, url, e)}, true);
      reader.removeEventListener('loadend', function(e){helper(reader, tabId, url, e)}, true);
      // Seems like a good idea to remove the listener immediately after its used
      // Removing this line appears not to cause memory leak
      reader.readAsText(xhr.response); // evaluate performance compared to other
      // types of read operations,
      // https://developer.mozilla.org/en-US/docs/Web/API/FileReader
    };
    xhr.send();
  });
}

function helper(reader, tabId, url, e){
  console.log(url);
  var newContent = e.srcElement.result;
  if(oldContent == newContent){
    console.log("Same . . .");
  }
  if(oldContent != newContent){
    oldContent = newContent;
    chrome.tabs.sendMessage(tabId, {text: "update", newContent: showdownCall(newContent)});
    console.log("Different!");
  }
  reader = null;  // Definitely prevents memory leak. w/o this line, reader
  // objects are never removed and accumulate
}

function showdownCall(newContent){
	var converter = new showdown.Converter();
	var html = converter.makeHtml(newContent);
	return html;
}
