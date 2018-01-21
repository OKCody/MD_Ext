var oldContent = "";
var errorCount = 0;
var pollingInterval;

xhr = new XMLHttpRequest();
reader = new FileReader();

getFile(document.URL);
pollingInterval = setInterval(function(){getFile(document.URL)}, 250);

xhr.onload = function(){
  // Occasionally a read is attempted while a read is in progress. -not under
  // normal conditions, rather when the machine was put to sleep with the
  // extension running it will throw an error on wake-up
  if(reader.readyState != 1){
    reader.readAsText(xhr.response);
  }
}

reader.onload = function(e){
  if(compare(e.srcElement.result, oldContent)){
    // Do nothing if no change
  }
  else{
    oldContent = e.srcElement.result;
    document.getElementsByTagName('body')[0].innerHTML = showdownCall(e.srcElement.result);
  }
  //xhr = null; // Might be a way to mitigate a memory leak
  //reader = null; // Might be a way to mitigate a memory leak
  delete xhr.onload;
  delete reader.onload;
  delete reader.result;
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
