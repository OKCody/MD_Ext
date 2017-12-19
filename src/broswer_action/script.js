// Event Listeners
// Listens for a click on the "Save CSS" button on the options page
// ----------------------------------------------------------

document.getElementById("save").addEventListener("click", save);

function save() {
  var file = document.getElementById('css_file').files[0];

  //https://medium.com/programmers-developers/convert-blob-to-string-in-javascript-944c15ad7d52
  const reader = new FileReader();
  reader.addEventListener('loadend', (e) => {
    const style = e.srcElement.result;
    //console.log(style);
    //Saves contents of user-selected stylesheet to storage
    chrome.storage.local.set({'style': style}); //background.js depends on this
    //Updates page style to that in storage.local
    chrome.runtime.sendMessage({ text: "updateCSS", from: "action.js" });
  });

  reader.readAsBinaryString(file);

}
