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
