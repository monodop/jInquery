
jInquery.onLoaded(function(version, $) {
	var newElem = document.createElement('p');
	newElem.innerHTML = $.fn.jquery;
	document.getElementsByTagName('body')[0].appendChild(newElem);
});

jInquery.require('1_2_1', function($) {
	console.log($.fn.jquery + ' was loaded!');
});

// Load ALL jQuery
jInquery.manyFromUrl('./versions.json.php');
// If you wanted to load just one
// jInquery.fromUrl('1_2_1', 'https://code.jquery.com/jquery-1.2.1.min.js');
