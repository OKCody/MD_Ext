// Event Listeners

// Listens for a click on the "Save CSS" button on the options page
document.getElementById("save").addEventListener("click", save);

function save() {
  console.log("Save");
  var file = document.getElementById('css_file').files[0];
  //https://medium.com/programmers-developers/convert-blob-to-string-in-javascript-944c15ad7d52
  const reader = new FileReader();
  reader.addEventListener('loadend', (e) => {
    const style = e.srcElement.result;
    // background.js depends on style being saved in local storage
    chrome.storage.local.set({'style': style});
    chrome.storage.local.get('tabID', function(tab){
      chrome.tabs.sendMessage(tab.tabID,{ text: "updateCSS", from: "action.js"})
    });
  });
  reader.readAsBinaryString(file);
}
