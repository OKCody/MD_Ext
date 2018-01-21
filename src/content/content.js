
chrome.extension.sendMessage({text: "watch"}, function(response){
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);
		// The following triggers when page is done loading
		// ----------------------------------------------------------

		mathjaxCall(applyStyle());
		addListeners();

		// ----------------------------------------------------------
		}
	}, 10);
});

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

// Applys most recently saved style to page
function applyStyle(){
	chrome.storage.local.get(['style'], function(result){
		console.log("applyStyle");
		var style = document.createElement("style");
		style.type = 'text/css';
		style.id = 'user_css';
		style.innerHTML = result.style;
		document.getElementsByTagName("head")[0].appendChild(style);
	});
}

function addListeners(){
	console.log("Event Listeners Added");
	chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse){
		console.log("Message Received");
		if(msg.text == "updateStyleFile"){
			console.log("updateStyleFile");
			chrome.storage.local.get('styleFile', function(result){
				if(document.getElementById('user_css')){
					document.getElementById('user_css').remove();
				}
				var link = document.createElement("link");
				link.type = 'text/css';
				link.id = 'user_css';
				link.rel = 'stylesheet';
				link.href = chrome.runtime.getURL(result.styleFile);
				document.getElementsByTagName("head")[0].appendChild(link);
			});
		}
		if(msg.text == "updateStyle"){
			console.log("updateStyle");
			if(document.getElementById('user_css')){
				document.getElementById('user_css').remove();
			}
			var style = document.createElement("style");
			style.type = 'text/css';
			style.id = 'user_css';
			document.getElementsByTagName("head")[0].appendChild(style);
			chrome.storage.local.get('style', function(result){
				document.getElementById('user_css').innerHTML = result.style;
			});
		}
		if(msg.text == "removeStyle"){
			console.log("removeStyle");
			chrome.storage.local.set({'style': ""});
			if(document.getElementById('user_css')){
				document.getElementById('user_css').remove();
			}
		}
		if(msg.text == "updateBody"){
			console.log("updateBody");
			document.getElementsByTagName('body')[0].innerHTML = msg.content;
		}
	});
}
