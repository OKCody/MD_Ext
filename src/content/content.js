chrome.extension.sendMessage({text: "watch"}, function(response){
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);
		// The following triggers when page is done loading
		// ----------------------------------------------------------

		mathjaxCall(applyStyle());
		updateStyle(); // Update user_css on message from action.js
		removeStyle(); // Remove contents of user_css on message from action.js

		// ----------------------------------------------------------
		}
	}, 10);
});

chrome.extension.onMessage.addListener(function(msg){
	if(msg.text == "update"){
		document.getElementsByTagName('body')[0].innerHTML = msg.newContent;
	}
});

/*
// Runs Showdown on text in <pre> automatically added by browser
function showdownCall(callback){
	var markdown = document.getElementsByTagName("pre")[0].innerHTML;
	chrome.storage.local.set({'markdown': markdown});
	var converter = new showdown.Converter();
	var html = converter.makeHtml(markdown);
	document.body.innerHTML = html;
}
*/

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
	console.log("applyInitialized");
	chrome.storage.local.get(['style'], function(result){
		console.log("applyStyle");
		var style = document.createElement("style");
		style.type = 'text/css';
		style.id = 'user_css';
		style.innerHTML = result.style;
		document.getElementsByTagName("head")[0].appendChild(style);
	});
}

// Listens for message from action.js and applys user-selected style
function updateStyle(){
	console.log("updateInitialized");
	chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse){
		console.log(msg.text);
		console.log(msg.from);
		if (msg.text == "updateStyle"){
			if(msg.from == "action.js"){
				console.log("updateStyle");
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
	console.log("removeIitialized");
	chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse){
		console.log(msg.text);
		console.log(msg.from);
		if (msg.text == "removeStyle"){
			if(msg.from == "action.js"){
				console.log("removeStyle");
				chrome.storage.local.set({'style': ""});
				document.getElementById('user_css').innerHTML = "";
			}
		}
	});
}
