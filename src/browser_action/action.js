var tabId = 0;
var style = {
  method: "", // internal/external
  id: "user_css",
  type: "text/css",
  rel: "stylesheet",
  href: "",
  innerHTML: ""
};

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

pagePersistence();
buttonClick();

function buttonClick(){
  id = this.id;

  console.log(id);
  console.log(tabId);

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
  if(id == "pdf"){
    chrome.tabs.sendMessage(tabId, {text: "pdf"});
  }
  if(id == "sans-serif"){
    style.method = "external";
    style.href = "/css/sans-serif.css";
  }
  if(id == "serif"){
    style.method = "external";
    style.href = "/css/serif.css";
  }
  if(id == "ieee"){
    style.method = "external";
    style.href = "/css/pubcss/dist/css/pubcss-ieee.css";
  }
  if(id == "acm"){
    style.method = "external";
    style.href = "/css/pubcss/dist/css/pubcss-acm-sig.css";
  }
  if(id == "remove"){
    style.method = "none";
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
  }
  console.log(typeof tabId);
  chrome.tabs.sendMessage(tabId, {text: "style", parameters: style});
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
