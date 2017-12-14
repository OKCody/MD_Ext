var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = chrome.runtime.getURL("/src/inject/MathJax/MathJax.js");    // use the location of your MathJax

	var config = 'MathJax.Hub.Config({' +
    'extensions: ["tex2jax.js","TeX/AMSmath.js","TeX/AMSsymbols.js"],' +
    'jax: ["input/TeX","output/HTML-CSS"],' +
    'tex2jax: {' +
        'inlineMath: [["$","$"],["\\(","\\)"]],' +
        'processEscapes: true,' +
    '},' +
'});';

	// This gets added to the <script></script> that is injected into the page.
	// Each string gets executed sequentially after MathJax is finished executing.
	//var afterMathJax = 'MathJax.Hub.Queue(["Typeset",MathJax.Hub]);' +
	//					 'MathJax.Hub.Queue(function(){full_DOM = document.getElementsByTagName("html")["0"].outerHTML; console.log(full_DOM);  });';

						 //'MathJax.Hub.Queue(function(){console.log("This is some shit."); });';
						 //'MathJax.Hub.Queue(function(){window.epubPress(window.full_DOM)});' +

	//var callbackQueue = 'chrome.storage.local.set({"full_DOM": "shit shit shit"}, function(){});'



						 //MathJax.Hub.Queue["[[Scopes]]"]["0"].window.full_DOM
	// Seems to be working, but having trouble accessing the variable within storage
	//chrome.storage.local.set({"full_DOM": "shit shit shit"}, function(){});
	//chrome.storage.local.get(null, function(){});

// There is a problem here with calling epubPress() because it is outside the scope of the
// MathJax script that is calling it. Figure out a way to make it a globally accessible function.
// Or perhaps it would be better to try referencing the know-to-be-global variable window.full_DOM
// from another script that does have access to epubPress()

	if (window.opera) {script.innerHTML = config}
							 else {script.text = config}


	document.getElementsByTagName("head")[0].appendChild(script);


	// TRY INSERTING SOMETHING HERE. THINK ABOUT IT AS BEING CALLED AFTER THE MATHJAX SCRIPT IS LOADED.
