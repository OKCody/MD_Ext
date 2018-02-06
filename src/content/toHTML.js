function toHTML(){
	request = [];
	resources = [];
	toDownload = [];
	url = [];
	folder = [];
	zip = new JSZip();

	// Don't make changes to rendered DOM. User should not see evidence of broken paths to src.
	clone = document.getElementsByTagName('HTML')[0].cloneNode(true);

	// Scripts have no place among downloaded files
	scripts = Object.values(clone.getElementsByTagName('script'));
	for(i=0; i < scripts.length; i++){
		scripts[i].remove();
	}

	// Round up all esternal resources, concatenate into one array for easy
	// downloading, stylesheets are referenced by hrefs, all others by srcs
	css = Object.values(clone.getElementsByTagName('link'));
	audio = Object.values(clone.getElementsByTagName('audio'));
	image = Object.values(clone.getElementsByTagName('img'));
	video = Object.values(clone.getElementsByTagName('video'));
	resources = resources.concat(css).concat(audio).concat(video).concat(image);
	for(i = 0; i < resources.length; i++){
		if(resources[i].src != "" && resources[i].src != undefined){
			toDownload.push(resources[i]);
		}
		if(resources[i].href != "" && resources[i].href != undefined){
			toDownload.push(resources[i]);
		}
	}

	// Attempt to download all urls in toDownload. toDownload[i], and i,
	// arguments are necessary. [i] gets at specific url and i allows getResources
	// to spawn unique XHRs for each url
	for(i = 0; i < toDownload.length; i++){
		getResources(toDownload[i], i, toDownload.length);
	}

	// Check to see if all files have finished downloading. downloaded variable
	// is incremented in onloadend function of XHR
	downloadReadyCheck = setInterval(function(){
		if(toDownload.length == downloaded){
			// Excluding index.html fixes the "not commonly downloaded and may be
			// dangerous warning"
			// Must be last, because hrefs and srcs are being modified within it
			// before this point.
			blob = new Blob([clone.outerHTML]);

			// mimeType option, not clearly shown in documentation (only hinted at),
			// seems to work.
			zip.file('index.html', blob, {mimeType: "text/plain"});
			downloadZip();
			clearInterval(downloadReadyCheck);
		}
	},50);
}

function getResources(toDownload, i, max, callback) {
	// Initialize number of files downloaded
	downloaded = 0;

	// Each resource type should be placed in its own directory, also image and
	// stylesheets are each referenced differently
	if(toDownload.tagName == "LINK"){
		url[i] = toDownload.href;
		folder[i] = "stylesheets/";
	}
	if(toDownload.tagName == "AUDIO"){
		url[i] = toDownload.src;
		folder[i] = "audio/";
	}
	if(toDownload.tagName == "IMG"){
		url[i] = toDownload.src;
		folder[i] = "images/";
	}
	if(toDownload.tagName == "VIDEO"){
		url[i] = toDownload.src;
		folder[i] = "videos/";
	}

	// Spawn XHR for each resource
	request[i] = new XMLHttpRequest();
	request[i].open("GET", url[i], true);

	// Download text and binary resources as arraybuffer and blob respectively
	if(folder[i] == "stylesheets/"){
		request[i].responseType = 'arraybuffer';
	}
	else{
		request[i].responseType = 'blob';
	}
	request[i].onload = function(response){
		if(request[i].readyState === 4){
      // XHR on file:// from file:// status == 0 on success, source:
      // https://stackoverflow.com/questions/5005960/xmlhttprequest-status-0-responsetext-is-empty#comment-43864898
      var protocol = url[i].split('//')[0];
			if(request[i].status === 200 ||
        ( (protocol == "file:") && (request[i].status == 0) )){
				// Could possibly be deleted. Use CLI file --mime-type to test if needed
				if(folder[i] == "stylesheets/"){
					blob = new Blob([request[i].response], {
						type: "text/css"
					});
				}
				else{
					blob = request[i].response;
				}

				// Among other benefits, using this external script applies appropriate
				// extensions to various image types
				extension = '.' + mime.getExtension(blob.type);
				path = folder[i] + i + extension;

				// Only paths to css files are assigned to hrefs,
				// all others; images, audio, and videos are assigned to srcs.
				if(folder[i] == "stylesheets/"){
          toDownload.href = path;
				}
				else{
					toDownload.src = path;
				}
			}
			else{
				console.error(request[i].status, request[i].readyState, request[i]);
			}
		}
	};

	// When resource is completely loaded, increment downloaded variable, add
	// blob to zip object
	request[i].onloadend = function(){
		downloaded = downloaded + 1;
		zip.file(path, blob);
	};

  // In the event that any resource on the page is unable to be downloaded
  // all the paths would be shuffled. In order to ensure correct path
  // assignments, original urls will be assigned in the event one can't be
  // reached for any reason.
  request[i].onerror = function(){
		if(request[i].readyState != 4 || request[i].status != 200){
			if(folder[i] == "stylesheets/"){
				toDownload.href = url[i];
			}
			else{
				toDownload.src = url[i];
			}
		}
  };

	// After setting up XHR, finally send the request
	request[i].send();
}

function downloadZip(){
	// Download assembled zip archive as a blob
	zip.generateAsync({type:"blob"})
	.then(function (blob) {
		download(blob, "site.zip", "application/zip");
	});
}
