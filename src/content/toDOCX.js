
function toDOCX(){
  request = [];
  toDownload = [];
  url = [];
  downloaded = [];
  i = 0;

  console.log("fromDocx");
  // All the things to do after MathJax is ready . . .
  clone = document.getElementsByTagName('HTML')[0].cloneNode(true);
  image = Object.values(clone.getElementsByTagName('img'));
  //console.log(image);
  if(image.length == 0){
    console.log("none");
    downloader();
  }
  else{
    for(i = 0; i < image.length; i++){
  		if(image[i].src != "" && image[i].src != undefined){
  			toDownload.push(image[i]);
  		}
  	}
    for(i = 0; i < toDownload.length; i++){
      console.log("toDownload", i);
  		getDOCXResources(toDownload[i], i, toDownload.length);
  	}
  }
}


function getDOCXResources(toDownload, i, max, callback) {

  url[i] = toDownload.src;
  blob = [];

  // Spawn XHR for each resource
	request[i] = new XMLHttpRequest();
	request[i].open("GET", url[i], true);
  request[i].responseType = 'blob';
  request[i].onload = function(response){
		if(request[i].readyState === 4){
      // XHR on file:// from file:// status == 0 on success, source:
      // https://stackoverflow.com/questions/5005960/xmlhttprequest-status-0-responsetext-is-empty#comment-43864898
      var protocol = url[i].split('//')[0];
			if(request[i].status === 200 ||
        ( (protocol == "file:") && (request[i].status == 0) )){
				// Could possibly be deleted. Use CLI file --mime-type to test if needed

				blob = request[i].response;

        fileReader = new FileReader();

        fileReader.onload = dlPrep(this.result, downloader);

        //console.log("readAsDataURL", i);
        fileReader.readAsDataURL(blob);
			}
			else{
        toDownload.src = url[i];
				console.error(request[i].status, request[i].readyState, request[i]);
			}
		}
	};
  console.log("send", i);
  request[i].send();
}

function dlPrep(insert, callback){
  toDownload.src = insert;
  downloaded.push(i);
  console.log("downloaded", downloaded);
  callback();
}

function downloader(){
  //console.log("downloader", toDownload.length, downloaded);
  if((toDownload.length == downloaded.length)){
    console.log("downloader done");
    // Excluding index.html fixes the "not commonly downloaded and may be
    // dangerous warning"
    // Must be last, because hrefs and srcs are being modified within it
    // before this point.

    //console.log(clone.outerHTML);
    var docx = htmlDocx.asBlob(clone.outerHTML);

    // Using Chrome's download API seems to have fixed the "not commonly
    // downloaded" warning.  Download.js should not be necessary.
    var url = URL.createObjectURL(docx);
    chrome.extension.sendMessage({text: "download", url: url, filename: "document.docx"});
  }
  else{
    console.log(downloaded.length, "/", toDownload.length);
  }
}
