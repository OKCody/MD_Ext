// Event Listeners

document.getElementById("save").addEventListener("click", saveStyle);

document.getElementById("remove").addEventListener("click", removeStyle);

document.getElementById("css_file").addEventListener("change", showFilename);

// ----------------------------------------------------------

// Event Functions

function saveStyle(){
  var file = document.getElementById('css_file').files[0];
  //https://medium.com/programmers-developers/convert-blob-to-string-in-javascript-944c15ad7d52
  const reader = new FileReader();
  reader.addEventListener('loadend', (e) => {
    const style = e.srcElement.result;
    // background.js depends on style being saved in local storage
    chrome.storage.local.set({'style': style});
    chrome.storage.local.get('tabID', function(tab){
      chrome.tabs.sendMessage(tab.tabID,{ text: "updateStyle", from: "action.js"})
    });
  });
  reader.readAsBinaryString(file);
}

function removeStyle(){
  chrome.storage.local.get('tabID', function(tab){
    chrome.tabs.sendMessage(tab.tabID, { text: "removeStyle", from: "action.js"});
  })
}

function showFilename(){
  document.getElementById('filename').innerHTML = document.getElementById('css_file').value.replace("C:\\fakepath\\", "");
}
