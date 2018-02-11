
chrome.extension.sendMessage({text: "active"}, function(response){
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);
		// The following triggers when page is done loading
		// ----------------------------------------------------------

		mathjaxCall();
		chrome.storage.local.get(['style'], function(result){
			applyStyle(result.style.method, result.style);
		});
		addListeners();
		// ----------------------------------------------------------
		}
	}, 10);
});

/*
// Applys MathJax configuration and path to MathJax.js
function mathjaxCall(callback){
	if(document.getElementById('mathjax_config')){
		document.getElementById('mathjax_config').remove();
	}
	var script = document.createElement("script");
		script.type = "text/x-mathjax-config";
		script.text = 'MathJax.Hub.Config({' +
			'extensions: ["tex2jax.js","TeX/AMSmath.js","TeX/AMSsymbols.js"],' +
			'jax: ["input/TeX","output/HTML-CSS"],' +
			'tex2jax: {' +
					'inlineMath: [["$","$"]],' +
					'processEscapes: true,' +
			'},' +
	'});';
	script.id = "mathjax_config"
	document.getElementsByTagName("head")[0].appendChild(script);
	if(document.getElementById('mathjax')){
		document.getElementById('mathjax').remove();
	}
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.id = "mathjax";
	script.src = chrome.runtime.getURL("/js/MathJax/unpacked/MathJax.js");
	script.setAttribute('async','');
	document.getElementsByTagName("head")[0].appendChild(script);
}
*/

function mathjaxCall(){
	var script = document.createElement("script");
  script.type = "text/javascript";
	script.id = "mathjax";
  script.src = chrome.runtime.getURL("/js/MathJax/unpacked/MathJax.js");
  var config = 'MathJax.Hub.Config({' +
                 'extensions: ["tex2jax.js"],' +
                 'jax: ["input/TeX","output/HTML-CSS"]' +
               '});' +
               'MathJax.Hub.Startup.onload();' +
// MathJax.Hub.Register.StartupHook("End", function(){ . . . }) runs when
// MathJax is loaded and ready. To signify this to other functions that depend
// on this being true, the ID of the <script> tag where MathJax is loaded and
// configured changes from mathjax () to mathjaxReady. For example, this is
// checked after the body is updated by showdownCall. If id = "mathjasReady" is
// found a script is written to <head> that updates all math on page.
							 'MathJax.Hub.Register.StartupHook("End",function () {' +
							 		//'console.log("mathjax ready");' +
									'document.getElementById("mathjax").id = "mathjaxReady";' +
							 '});';

  if (window.opera) {script.innerHTML = config}
               else {script.text = config}

  document.getElementsByTagName("head")[0].appendChild(script);
}

function applyStyle(method, parameters){
	if(method == "external"){
		if(document.getElementById('user_css')){
			document.getElementById('user_css').remove();
		}
		var link = document.createElement("link");
		link.type = parameters.type;
		link.id = parameters.id;
		link.rel = parameters.rel;
		link.href = chrome.runtime.getURL(parameters.href);
		document.getElementsByTagName("head")[0].appendChild(link);
		chrome.storage.local.set({'style': parameters});
	}
	if(method == "internal"){
		if(document.getElementById('user_css')){
			document.getElementById('user_css').remove();
		}
		var style = document.createElement("style");
		style.type = parameters.type;
		style.id = parameters.id;
		style.innerHTML = parameters.innerHTML;
		document.getElementsByTagName("head")[0].appendChild(style);
		chrome.storage.local.set({'style': parameters});
	}
	if(method == "none"){
		if(document.getElementById('user_css')){
			document.getElementById('user_css').remove();
		}
		chrome.storage.local.set({'style': parameters});
	}
}

function addListeners(){
	chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse){
		if(msg.text == "style"){
			applyStyle(msg.parameters.method, msg.parameters);
		}
		if(msg.text == "updateBody"){
			document.getElementsByTagName('body')[0].innerHTML = msg.content;
		}
		// Download handlers
		if(msg.text == "download"){
			if(msg.type == "pdf"){
				window.alert('Destination: "Save as PDF"');
				window.print();
			}
			if(msg.type == "html"){
				readySet(toHTML);
			}
			if(msg.type == "docx"){
				readySet(toDOCX);  // Calls toDocx when MathJax is ready
			}
		}
	});
}


// Experimenting with function to check readiness

function readySet(go){
	console.log("here");
	if(document.getElementById('mathjaxReady')){
		if(document.getElementById('mathjax')){
			document.getElementById('mathjax').remove();
		}
		if(document.getElementById('mathjaxReady')){
			document.getElementById('mathjaxReady').remove();
		}
		// All the things to do after MathJax is ready . . .
		go();
	}
	else{
		var getMediaInterval = setInterval(function(){
			console.log("try");
			if(document.getElementById('mathjax')){
				document.getElementById('mathjax').remove();
			}
			if(document.getElementById('mathjaxReady')){
				document.getElementById('mathjaxReady').remove();
			}
			// All the things to do after MathJax is ready . . .
			go();
			clearInterval(getMediaInterval);
		});
	}
}

function test(){
	console.log("text");
}
