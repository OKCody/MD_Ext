chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// The following triggers when page is done loading
		// ----------------------------------------------------------
		showdownCall(mathjaxCall(applyStyle()));
		updateStyle(); // Update user_css on message from action.js
		removeStyle(); // Remove contents of user_css on message from action.js

		// ----------------------------------------------------------
		}
	}, 10);
});

// Runs Showdown on text in <pre> automatically added by browser
function showdownCall(callback){
	var markdown = document.getElementsByTagName("pre")[0].innerHTML;
	var converter = new showdown.Converter();
	var html = converter.makeHtml(markdown);
	document.body.innerHTML = html;
}

// Applys MathJax configuration and path to MathJax.js
function mathjaxCall(callback){
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
	document.getElementsByTagName("head")[0].appendChild(script);
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = chrome.runtime.getURL("/js/MathJax/unpacked/MathJax.js");
	script.setAttribute('async','');
	document.getElementsByTagName("head")[0].appendChild(script);
}

// Applys most recently saved style to page
function applyStyle(){
	chrome.storage.local.get(['style'], function(result){
		var style = document.createElement("style");
		style.type = 'text/css';
		style.id = 'user_css';
		style.innerHTML = result.style;
		document.getElementsByTagName("head")[0].appendChild(style);
	});
}

// Listens for message from action.js and applys user-selected style
function updateStyle(){
	chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse){
		if (msg.text == "updateCSS"){
			if(msg.from == "action.js"){
				chrome.storage.local.get('style', function(result){
					document.getElementById('user_css').innerHTML = result.style;
				});
			}
		}
	});
}

// Listens for message from action.js and removes contents of user_css instead
// of removing entire tag because subsequent styles applied rely on there being
// an element with id="user_css"
// Also sets 'style' in local storage to empty string 
function removeStyle(){
	chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse){
		if (msg.text == "removeStyle"){
			if(msg.from == "action.js"){
				chrome.storage.local.set({'style': ""});
				document.getElementById('user_css').innerHTML = "";
			}
		}
	});
}
