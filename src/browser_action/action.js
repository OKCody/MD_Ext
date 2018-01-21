// Event Listeners

//document.getElementById("save").addEventListener("click", saveStyle);

//document.getElementById("remove").addEventListener("click", removeStyle);

document.getElementById("css_file").addEventListener("change", showFilename);

//document.getElementsByClassName("stylesheet_btn").addEventListener("click", test);
var clicks = document.getElementsByClassName("click");
for (var i = 0 ; i < clicks.length; i++) {
   clicks[i].addEventListener('click', buttonClick, false);
}

var style = "";
var tabId = "";
chrome.storage.local.get('tabId', function(tab){
  tabId = tab.tabId;
});

buttonClick();

function buttonClick(){
  id = this.id;

  console.log(id);
  console.log(tabId);

  if(id == "output_btn"){
    console.log("output_btn");
    document.getElementById("outputPage").style.display = "block";
    document.getElementById("contentPage").style.display = "none";
    document.getElementById("stylePage").style.display = "none";
  }
  if(id == "content_btn"){
    console.log("content_btn");
    document.getElementById("outputPage").style.display = "none";
    document.getElementById("contentPage").style.display = "block";
    document.getElementById("stylePage").style.display = "none";
  }
  if(id == "style_btn"){
    console.log("style_btn");
    document.getElementById("outputPage").style.display = "none";
    document.getElementById("contentPage").style.display = "none";
    document.getElementById("stylePage").style.display = "block";
  }
  if(id == "sans-serif"){
    console.log("sans-serif");
    chrome.storage.local.set({'styleFile': "/css/sans-serif.css"});
    chrome.tabs.sendMessage(tabId,{ text: "updateStyleFile", from: "action.js"});
  }
  if(id == "serif"){
    console.log("serif");
    chrome.storage.local.set({'styleFile': "/css/serif.css"});
    chrome.tabs.sendMessage(tabId,{ text: "updateStyleFile", from: "action.js"});
  }
  if(id == "ieee"){
    console.log("ieee");
    chrome.storage.local.set({'styleFile': "/css/pubcss/dist/css/pubcss-ieee.css"});
    chrome.tabs.sendMessage(tabId,{ text: "updateStyleFile", from: "action.js"});
  }
  if(id == "acm"){
    console.log("acm");
    chrome.storage.local.set({'styleFile': "/css/pubcss/dist/css/pubcss-acm-sig.css"});
    chrome.tabs.sendMessage(tabId,{ text: "updateStyleFile", from: "action.js"});
  }
  if(id == "save"){
    console.log("save");
    chrome.storage.local.set({'style': style});
    chrome.tabs.sendMessage(tabId,{ text: "updateStyle", from: "action.js"});
  }
  if(id == "remove"){
    console.log("remove");
    chrome.tabs.sendMessage(tabId, { text: "removeStyle", from: "action.js"});
  }
}


function saveStyle(){
  console.log("saveStyle");
  var file = document.getElementById('css_file').files[0];
  //https://medium.com/programmers-developers/convert-blob-to-string-in-javascript-944c15ad7d52
  const reader = new FileReader();
  reader.addEventListener('loadend', (e) => {
    style = e.srcElement.result;
  });
  reader.readAsText(file);
}

/*
function removeStyle(){
  console.log("removeStyle");
  chrome.storage.local.get('tabId', function(tab){
    console.log(tab);
    chrome.tabs.sendMessage(tab.tabId, { text: "removeStyle", from: "action.js"});
  });
}
*/

function showFilename(){
  document.getElementById('filename').innerHTML = document.getElementById('css_file').value.replace("C:\\fakepath\\", "");
  saveStyle();
}
