var tabId = 0;
var style = {
  method: "", // internal/external
  id: "user_css",
  type: "text/css",
  rel: "stylesheet",
  href: "",
  innerHTML: ""
};
var msg = "";
var type = "";

// Event Listeners

document.getElementById("css_file").addEventListener("change", showFilename);

var clicks = document.getElementsByClassName("click");
for (var i = 0 ; i < clicks.length; i++) {
   clicks[i].addEventListener('click', buttonClick, false);
}

// /Event Listeners

chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
  tabId = tabs[0].id;
});

buttonClick();

function buttonClick(){
  id = this.id;

  console.log(id);
  console.log(tabId);

  // menu handlers . . .
  if(id == "output_btn"){
    console.log("output_btn");
    showOutputPage();
  }
  if(id == "content_btn"){
    console.log("content_btn");
    showContentPage();
  }
  if(id == "style_btn"){
    console.log("style_btn");
    showStylePage();
  }
  // download handlers . . .
  if(id == "pdf"){
    msg = "download";
    type = "pdf";
    //chrome.tabs.sendMessage(tabId, {text: "pdf"});
  }
  if(id == "html"){
    msg = "download";
    type = "html";
    //chrome.tabs.sendMessage(tabId, {text: "pdf"});
  }
  if(id == "docx"){
    msg = "download";
    type = "docx";
    //chrome.tabs.sendMessage(tabId, {text: "pdf"});
  }
  // style handlers . . .
  if(id == "sans-serif"){
    style.method = "external";
    style.href = "/css/sans-serif.css";
    msg = "style";
  }
  if(id == "serif"){
    style.method = "external";
    style.href = "/css/serif.css";
    msg = "style";
  }
  if(id == "ieee"){
    style.method = "external";
    style.href = "/css/pubcss/dist/css/pubcss-ieee.css";
    msg = "style";
  }
  if(id == "acm"){
    style.method = "external";
    style.href = "/css/pubcss/dist/css/pubcss-acm-sig.css";
    msg = "style";
  }
  if(id == "remove"){
    style.method = "none";
    msg = "style";
  }
  if(id == "save"){
    style.method = "internal";
    var file = document.getElementById('css_file').files[0];
    //https://medium.com/programmers-developers/convert-blob-to-string-in-javascript-944c15ad7d52
    const reader = new FileReader();
    reader.addEventListener('loadend', (e) => {
      style.innerHTML = e.srcElement.result;
      console.log(style);
    });
    reader.readAsText(file);
    msg = "style";
  }
  // sendMessage handler . . .
  if(msg == "style"){
    chrome.tabs.sendMessage(tabId, {text: "style", parameters: style});
  }
  if(msg == "download"){
    chrome.tabs.sendMessage(tabId, {text: "download", type: type});
  }
}

function showFilename(){
  document.getElementById('filename').innerHTML = document.getElementById('css_file').value.replace("C:\\fakepath\\", "");
}

function showOutputPage(){
  document.getElementById("outputPage").style.display = "block";
  document.getElementById("contentPage").style.display = "none";
  document.getElementById("stylePage").style.display = "none";
}

function showContentPage(){
  document.getElementById("outputPage").style.display = "none";
  document.getElementById("contentPage").style.display = "block";
  document.getElementById("stylePage").style.display = "none";
}

function showStylePage(){
  document.getElementById("outputPage").style.display = "none";
  document.getElementById("contentPage").style.display = "none";
  document.getElementById("stylePage").style.display = "block";
}
