
function toDOCX(){
  request = [];
  toDownload = [];
  url = [];
  downloaded = 0;

  console.log("fromDocx");
  // All the things to do after MathJax is ready . . .
  clone = document.getElementsByTagName('HTML')[0].cloneNode(true);
  image = Object.values(clone.getElementsByTagName('img'));
  //console.log(image);
  for(i = 0; i < image.length; i++){
		if(image[i].src != "" && image[i].src != undefined){
			toDownload.push(image[i]);
		}
	}
  for(i = 0; i < toDownload.length; i++){
		getDOCXResources(toDownload[i], i, toDownload.length);
	}
  downloadReadyCheck = setInterval(function(){
		if(toDownload.length == downloaded){
			// Excluding index.html fixes the "not commonly downloaded and may be
			// dangerous warning"
			// Must be last, because hrefs and srcs are being modified within it
			// before this point.

      //console.log(clone.outerHTML);
      var blob = htmlDocx.asBlob(clone.outerHTML);

      // Using Chrome's download API seems to have fixed the "not commonly
  		// downloaded" warning.  Download.js should not be necessary.
      var url = URL.createObjectURL(blob);
      chrome.extension.sendMessage({text: "download", url: url, filename: "document.docx"});

      clearInterval(downloadReadyCheck);
		}
	},50);
}


function getDOCXResources(toDownload, i, max, callback) {

  url[i] = toDownload.src;

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

        var fileReader = new FileReader();
        fileReader.onload = function() {
          //toDownload.src = this.result;
          //console.log(this.result);

          downscale(this.result, 450, 0, {quality: 1}).
            then(function(dataURL) {
              toDownload.src = dataURL;
              //console.log(dataURL.length);
              // Incrementing here instead of in onloadend because
              // it could happen that downscale() will not have finished
              // before onloadend is fired
              downloaded = downloaded + 1;
            })
        };
        fileReader.readAsDataURL(blob);
			}
			else{
        toDownload.src = url[i];
				console.error(request[i].status, request[i].readyState, request[i]);
			}
		}
	};
  request[i].send();
}
