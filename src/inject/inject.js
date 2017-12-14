chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		console.log("Hello. This message was sent from scripts/inject.js");
		//
		showdownCall(mathjaxCall);
		// ----------------------------------------------------------
	}
	}, 10);
});

function showdownCall(callback){
	console.log("Showdown Begin");
	var markdown = document.getElementsByTagName("pre")[0].innerHTML;
	var converter = new showdown.Converter();
	var html = converter.makeHtml(markdown);
	document.body.innerHTML = html;
	console.log("Showdown End");
	callback();
}

function mathjaxCall(callback){

	console.log("MathJax Begin");

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
		script.src = chrome.runtime.getURL("/js/MathJax/unpacked/MathJax.js");    // use the location of your MathJax

		script.setAttribute('async','');

	document.getElementsByTagName("head")[0].appendChild(script);

	console.log("MathJax End");
	//callback();

}
