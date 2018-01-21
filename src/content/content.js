
chrome.extension.sendMessage({text: "watch"}, function(response){
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);
		// The following triggers when page is done loading
		// ----------------------------------------------------------

		mathjaxCall();
		chrome.storage.local.get(['style'], function(result){
			console.log(result);
			applyStyle(result.style.method, result.style);
		});
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

/*
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
*/

function applyStyle(method, parameters){
	console.log(parameters);
	if(method == "external"){
		if(document.getElementById('user_css')){
			document.getElementById('user_css').remove();
		}
		var link = document.createElement("link");
		console.log(parameters);
		link.type = parameters.type;
		link.id = parameters.id;
		link.rel = parameters.rel;
		link.href = chrome.runtime.getURL(parameters.href);
		document.getElementsByTagName("head")[0].appendChild(link);
		chrome.storage.local.set({'style': parameters});
		console.log(link);
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
	console.log("Event Listeners Added");
	chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse){
		console.log("Message Received");
		if(msg.text == "style"){
			applyStyle(msg.parameters.method, msg.parameters);
		}
		if(msg.text == "updateBody"){
			console.log("updateBody");
			document.getElementsByTagName('body')[0].innerHTML = msg.content;
		}
	});
}
