# jInquery
A really dumb library for loading all versions of jQuery concurrently.

I was reading up on a post on Reddit about how someone wanted to load more than one version of jQuery at a time, and how he thought that was dumb. I took that as an excuse to write a library that can handle an arbitrary number of jQueries because I wanted to write something that can load ALL of the versions of jQuery. So here we are, with a library that can do that stuff.

## Getting Started
To get started, just download jInquery, include it into your page, and you're ready to go!

```html
<html>
  <head>
    <script src="jinquery.js"></script>
  </head>
  <body>
  
  </body>
</html>
```

## Loading jQueries
Using jInquery is really easy. The first thing you will want to do is tell jInquery which versions of jQuery you want to load. You can do this one at a time...

```javascript
jInquery.fromUrl('1_2_1', 'https://code.jquery.com/jquery-1.2.1.min.js');
```

or, you can load many at a time...

```javascript
jInquery.manyFromJson({
    '1_7' : 'https://code.jquery.com/jquery-1.7.min.js',
    '1_8_0' : 'https://code.jquery.com/jquery-1.8.0.min.js'
});
```

or, if you have a script that can generate the json structure above, you can just pass a url to that.

```javascript
jInquery.manyFromUrl('./versions.json.php');
```

This PHP script will return a list of all versions of jQuery, use at your own pleasure!

```php
<?php

header('Content-Type: application/json');

$url = 'https://code.jquery.com';
$all_versions = file_get_contents($url . '/jquery/');
preg_match_all('#/jquery-([0-9\.\-]+)\.(?:min|pack)\.js#i', $all_versions, $matches);

$out = array();
for($i = 0; $i < count($matches[0]); $i++) {
        $match = $matches[0][$i];
        $key = $matches[1][$i];
        $key = preg_replace('/[^A-Za-z0-9]/', '_', $key);
        $out[$key] = $url . $match;
}

echo json_encode($out);

?>
```

## Using jQueries
Now that you have loaded the jQueries you want, it's super easy to call them:

```javascript
jInquery.require('1_2_1', function($) {
  console.log($.fn.query + ' was loaded!');
});
```

**NOTE!** If you never loaded the version of jQuery, that callback function will never be called!

## Other Features
As an added bonus, you can use `jInquery.onLoaded(callback)` to get a call whenever a new jQuery was loaded.

```javascript
jInquery.onLoaded(function(version, $) {
  console.log($.fn.query + ' was loaded!');
});
```

## Other notes
Please don't use this in production. This is a joke.
