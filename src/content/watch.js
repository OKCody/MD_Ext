watch();

function watch(){
  // undo scrollwheel-preventing CSS applied by toSlides()
  document.getElementsByTagName('body')[0].setAttribute('style', null);
  //document.ontouchmove = function(e){ return true; }
  var oldContent = "";
  var errorCount = 0;
  var pollingInterval;

  xhr = new XMLHttpRequest();
  reader = new FileReader();

  // Run immediately, then once every interval thereafter.
  getFile(document);
  pollingInterval = setInterval(function(){getFile(document)}, 250);

  chrome.storage.local.get(['options'], function(result){
    if(result.options.watch != false){
      // change nothing
    }
    else{
      console.log('watch', result.options.watch);
      // prevent from calling getFile again
      clearInterval(pollingInterval);
    }
  });


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
      showdownCall(e.srcElement.result);
      updateMath();
      //toSlides(resize);
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
}

function getFile(document){
  if(isAllowedURL(document)){
    getContent(document);
  }
}

function getContent(page){
  xhr.open("GET", page.URL);
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
  chrome.storage.local.get(['options'], function(result){
    console.log(result);
    if(result.options.markdown != false){
      var converter = new showdown.Converter();
      converter.setOption('tables', true);
    	html = converter.makeHtml(newContent);
      if(result.options.page == true){
        document.getElementsByTagName('body')[0].innerHTML = html;
      }
      if(result.options.page == false){
        slides(toSlides, resize, html);
      }
    }
    else{
      console.log('markdown', result.options.markdown);
    }
  });
}

function slides(callback){
  document.getElementsByTagName('body')[0].innerHTML = arguments[2];
  callback(arguments[1]); // effectively calls toSlides(resize);
}

function isAllowedURL(page){
  // Create arrays of criteria which to check against
  var protocols = ['file:'];
  var extensions = ['md']; // should not include period
  var protocol = page.location.protocol;
  var extension = page.URL.split('.').pop();
  // Check against criteria
  if(protocols.includes(protocol) && extensions.includes(extension)){
    return true;
  }
  else{
    return false;
  }
}

function updateMath(){
  chrome.storage.local.get(['options'], function(result){
    if(result.options.mathjax != false){
      if(document.getElementById('re-math')){
        document.getElementById('re-math').remove();
      }
      if(document.getElementById('mathjaxReady')){
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.id = "re-math";
        script.innerHTML = "MathJax.Hub.Queue(['Typeset',MathJax.Hub]);";
        script.setAttribute('async','');
        document.getElementsByTagName("head")[0].appendChild(script);
      }
    }
    else{
      console.log('watch_mathjax', result.options.mathjax);
    }
  });
}
