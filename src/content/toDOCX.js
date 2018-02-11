toDownload = [];
downloaded = 0;
function toDocx(){
  getMediaInterval = setInterval(function(){
    if(document.getElementById('mathjaxReady')){
      if(document.getElementById('mathjax')){
        document.getElementById('mathjax').remove();
      }
      if(document.getElementById('mathjaxReady')){
        document.getElementById('mathjaxReady').remove();
      }
      if(document.getElementById('MathJax_Message')){
        document.getElementById('MathJax_Message').remove();
      }
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

          var blob = htmlDocx.asBlob(clone.outerHTML);
          download(blob, "test.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
          clearInterval(getMediaInterval);
          clearInterval(downloadReadyCheck);
    		}
    	},50);
    }
  },50);
}


function getDOCXResources(toDownload, i, max, callback) {
  downloaded = 0;

  url = toDownload.src;

  // Spawn XHR for each resource
	request = new XMLHttpRequest();
	request.open("GET", url, true);
  request.responseType = 'blob';
  request.onload = function(response){
		if(request.readyState === 4){
      // XHR on file:// from file:// status == 0 on success, source:
      // https://stackoverflow.com/questions/5005960/xmlhttprequest-status-0-responsetext-is-empty#comment-43864898
      var protocol = url.split('//')[0];
			if(request.status === 200 ||
        ( (protocol == "file:") && (request.status == 0) )){
				// Could possibly be deleted. Use CLI file --mime-type to test if needed

				blob = request.response;

        var fileReader = new FileReader();
        fileReader.onload = function() {
          //toDownload.src = this.result;
          //console.log(this.result);

          downscale(this.result, 450, 0, {quality: 1}).
            then(function(dataURL) {
              toDownload.src = dataURL;
            })
        };
        fileReader.readAsDataURL(blob);
			}
			else{
				console.error(request.status, request.readyState, request);
			}
		}
	};
	// When resource is completely loaded, increment downloaded variable, add
	// blob to zip object
	request.onloadend = function(){
		downloaded = downloaded + 1;
	};
  request.send();
}
