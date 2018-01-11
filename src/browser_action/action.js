// Event Listeners

document.getElementById("save").addEventListener("click", saveStyle);

document.getElementById("remove").addEventListener("click", removeStyle);

document.getElementById("css_file").addEventListener("change", showFilename);
/*
document.getElementById("sans-serif").addEventListener("click", applySans_Serif);

document.getElementById("serif").addEventListener("click", applySerif);
*/
// ----------------------------------------------------------
/*
function getContent(url){

  return content;
}

function idToURL(id){

  return url;
}

function applyStyle(content, callback){

  callback();
}

function sendMessage(payload, from){

}
*/
// Call the above functions which should be generalized and contained in a helper.js file that is accessible by all contexts.

//applyStyle(getContent("style/sheet/url")), sendMessage("updateStyle","action.js"));

// Event Functions

/*
function applySans_Serif(){
  console.log("Sans-Serif");
  removeStyle();
  getCSS("/css/sans-serif.css");
  chrome.storage.local.get('tabId', function(tab){
    chrome.tabs.sendMessage(tab.tabId,{ text: "updateStyle", from: "action.js"})
  });
}
function applySerif(){
  console.log("Serif");
  removeStyle();
}

*/
function saveStyle(){
  console.log("saveStyle");
  var file = document.getElementById('css_file').files[0];
  //https://medium.com/programmers-developers/convert-blob-to-string-in-javascript-944c15ad7d52
  const reader = new FileReader();
  reader.addEventListener('loadend', (e) => {
    const style = e.srcElement.result;
    // background.js depends on style being saved in local storage
    chrome.storage.local.set({'style': style});
    chrome.storage.local.get('tabId', function(tab){
      chrome.tabs.sendMessage(tab.tabId,{ text: "updateStyle", from: "action.js"})
    });
  });
  reader.readAsBinaryString(file);
}

function removeStyle(){
  console.log("removeStyle");
  chrome.storage.local.get('tabId', function(tab){
    console.log(tab);
    chrome.tabs.sendMessage(tab.tabId, { text: "removeStyle", from: "action.js"});
  });
}

function showFilename(){
  document.getElementById('filename').innerHTML = document.getElementById('css_file').value.replace("C:\\fakepath\\", "");
}
/*

xhr = new XMLHttpRequest();
reader = new FileReader();

xhr.onload = function(){
  reader.readAsText(xhr.response);
}

reader.onload = function(e){
  var style = e.srcElement.result;
  chrome.storage.local.set({'style': style});
}

function getCSS(path){
  xhr.open("GET", path);
  xhr.responseType = "blob";
  xhr.send();
}
*/
