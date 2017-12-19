// Event Listeners
// Listens for a click on the "Save CSS" button on the options page
// ----------------------------------------------------------

document.getElementById("save").addEventListener("click", save);

function save() {
  var file = document.getElementById('css_file').files[0];
  var data = document.getElementById('css_file').value;
  console.log(file);
  var fileObjectURL = window.URL.createObjectURL(file);
  console.log(fileObjectURL);
  //var style = document.createElement("style");
	//	style.type = "text/css";
	//	style.src = fileObjectURL;
  //console.log(tab);
	//document.getElementsByTagName("head")[0].appendChild(style);
  //chrome.tabs.insertCSS(tab, {file: fileObjectURL});
  //chrome.tabs.executeScript(null, {file: "/src/inject/inject.js"});
  // Get all the tabs

  // List of allowable extensions. Should be identical to "match" in manifest
  var extList = {"md": true, "MD": true};

  chrome.tabs.query({currentWindow: true}, function(result){console.log(result);});

  chrome.tabs.query({currentWindow: true}, function(result) {
    result.forEach(function(tab) {
      if(tab.selected){
        if( tab.url.split('.').pop() in extList){
          console.log(tab.id);

          //https://medium.com/programmers-developers/convert-blob-to-string-in-javascript-944c15ad7d52
          const reader = new FileReader();
          reader.addEventListener('loadend', (e) => {
            const style = e.srcElement.result;
            console.log(style);
            chrome.tabs.insertCSS(tab.id, {code: style});
            chrome.storage.local.set({'style': style}); //background.js depends
          });

          reader.readAsBinaryString(file);
          //reader.readAsText(file);

        }
        else{
          console.log("Error: Markdown file not present in active tab.");
        }
      }
    });
  });

}



//.log("score!");
//if (!extList.hasOwnProperty(i)) continue;
//if(tab.url.split('.').pop() in extList){
//  console.log("yes!");
//  console.log(tab);
