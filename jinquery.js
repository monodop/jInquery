
var jInquery = (function() {
	// The jqueries that have been loaded
	var loadedStates = {};
	
	// The requires queued to be called until jquery is ready
	var requireCallbacks = {};
	
	// The callbacks to be called with onLoad
	var onLoadedCallbacks = [];
	
	// The jQueries that we have loaded
	var jQueries = {};

	// Returns whether or not a version of jQuery has been loaded yet.
	var isLoaded = function(version) {
		if (!loadedStates.hasOwnProperty(version))
			return false;
		return loadedStates[version] === true;
	};
	
	// Internal - alerts all event subscribers that the version is ready.
	var notifyLoaded = function(version) {
		
		// Set the loaded state to true to indicate that requires should no longer be queued for this version
		loadedStates[version] = true;
		
		// Call any subscribers to the onLoaded event
		for (var i = 0; i < onLoadedCallbacks.length; i++) {
			onLoadedCallbacks[i](version, jQueries[version]);
		}

		// Call any queued requires
		if (requireCallbacks.hasOwnProperty(version)) {
			for (var i = 0; i < requireCallbacks[version].length; i++) {
				requireCallbacks[version][i](jQueries[version]);
			}
		}
	}
	
	// Allows you to request a version of jQuery from the internal data store.
	// If the version is not loaded, it will be queued until it has been loaded
	// Note, this can be never!
	// The callback provides a function of the signature:
	//     function(jQuery)
	//         jQuery - the instance of jQuery that was loaded
	var require = function(version, callback) {
		if (isLoaded(version)) 
			callback(jQueries[version]);
		else
		{
			if (!requireCallbacks.hasOwnProperty(version))
				requireCallbacks[version] = [];
			requireCallbacks[version].push(callback);
		}
	};

	// Allows you to hook when a version of jQuery has been loaded.
	// The callback provides a function of the signature:
	//     function(version, jQuery)
	//         version - the version that was loaded
	//         jQuery - the instance of jQuery that was loaded
	var onLoaded = function(callback) {
		onLoadedCallbacks.push(callback);
	};
	
	// Allows you to load a specific version of jQuery by providing the version number and the url where
	// you want to download it from.
	var fromUrl = function(version, url) {
		// Generate a new script element
		var newScript = document.createElement('script');
		newScript.type = 'text/javascript';
		newScript.async = true;

		// Define what happens when the script element has been loaded completely
		var ready = function(k) {
			jQueries[k] = $.noConflict(true);
			notifyLoaded(k);
		}.bind(this, version);
		if (newScript.readyState) { //IE
		    newScript.onreadystatechange = function () {
			if (newScript.readyState == "loaded" || newScript.readyState == "complete") {
			    newScript.onreadystatechange = null;
			    ready();
			}
		    };
		} else { //Others
		    newScript.onload = function () {
			ready();
		    };
		}
		
		// Begin loading the script.
		newScript.src = url;
		(document.getElementsByTagName('head')[0]||document.getElementsByTagName('body')[0]).appendChild(newScript);
	};
	
	// Allows you to load many versions of jQuery by passing an object where the keys are the version numbers,
	// and the values are the urls where the version can be downloaded from.
	// Example: {
	//     '1_7' : 'https://code.jquery.com/jquery-1.7.min.js',
	//     '1_8_0' : 'https://code.jquery.com/jquery-1.8.0.min.js'
	// }
	var manyFromJson = function(data) {
		// Just iterate over this
		for (var key in data) {
			loadedStates[key] = false;
			var url = data[key];
			fromUrl(key, url);
		}
	};
	
	// Allows you to load many versions of jQuery by passing the url to a file that returns an object where the keys
	// are the version numbers, and the values are the urls where the version can be downloaded from.
	// see manyFromJson(data) for an example of the expected format.
	var manyFromUrl = function(url) {
		// Load the data
		var req = new XMLHttpRequest();
		req.open('GET', url);
		req.send(null);
		req.onreadystatechange = function() {
			if (req.readyState === 4) {
				if (req.status === 200) {
					var response = req.responseText;
					var data = JSON.parse(response);
					manyFromJson(data);
				} else {
					console.log(req.status);
				}
			}
		};

	};
	
	// Return the public functions
	return {
		fromUrl: fromUrl,
		manyFromUrl: manyFromUrl,
		manyFromJson: manyFromJson,
		isLoaded: isLoaded,
		onLoaded: onLoaded,
		require: require
	};
}());
