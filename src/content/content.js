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

function addListeners(){
	chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse){
		if(msg.text == "updateStyle"){
			console.log("updateStyle");
			chrome.storage.local.get('style', function(result){
				document.getElementById('user_css').innerHTML = result.style;
			});
		}
		if(msg.text == "removeStyle"){
			console.log("removeStyle");
			chrome.storage.local.set({'style': ""});
			document.getElementById('user_css').innerHTML = "";
		}
		if(msg.text == "updateBody"){
			console.log("updateBody");
			document.getElementsByTagName('body')[0].innerHTML = msg.newContent;
		}
	});
}
