<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


include 'assets/includes/config.php';
include 'indexnow-config.php';

$servername = $dbGM['host'];
$username = $dbGM['user'];
$password = $dbGM['pass'];
$dbname = $dbGM['name'];

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$progressFile = 'indexnow-progress.txt';
$batchSize = 10000;
$maxUrlsPerRequest = 10000;

$progress = loadProgress();
$currentType = $progress['current_type'] ?? 'games';
$startOffset = $progress['offset'];
$totalSubmitted = $progress['total_submitted'];
$lastRun = $progress['last_run'];

if (date('Y-m-d') !== date('Y-m-d', strtotime($lastRun))) {
    $startOffset = 0;
    $totalSubmitted = 0;
    $currentType = 'games';
}

// If completed, start over from games
if ($currentType === 'completed') {
    $currentType = 'games';
    $startOffset = 0;
    echo "Starting new cycle from games\n";
}

$urlTypes = ['games', 'categories', 'tags', 'blogs', 'pages', 'static'];
$urls = [];
$nextType = null;
$nextOffset = 0;

switch ($currentType) {
    case 'games':
        $result = getGameUrls($conn, $startOffset, $batchSize);
        break;
    case 'categories':
        $result = getCategoryUrls($conn, $startOffset, $batchSize);
        break;
    case 'tags':
        $result = getTagUrls($conn, $startOffset, $batchSize);
        break;
    case 'blogs':
        $result = getBlogUrls($conn, $startOffset, $batchSize);
        break;
   
    case 'static':
        $result = getStaticUrls($startOffset, $batchSize);
        break;
    case 'completed':
        echo "Cycle completed, restarting from games\n";
        $currentType = 'games';
        $startOffset = 0;
        $result = getGameUrls($conn, $startOffset, $batchSize);
        break;
    default:
        echo "Unknown type, starting from games\n";
        $currentType = 'games';
        $startOffset = 0;
        $result = getGameUrls($conn, $startOffset, $batchSize);
        break;
}

$urls = $result['urls'];
$hasMore = $result['has_more'];

if (empty($urls)) {
    $currentTypeIndex = array_search($currentType, $urlTypes);
    if ($currentTypeIndex !== false && $currentTypeIndex < count($urlTypes) - 1) {
        $nextType = $urlTypes[$currentTypeIndex + 1];
        $nextOffset = 0;
        echo "Finished processing $currentType, moving to $nextType\n";
    } else {
        echo "All URLs have been submitted to IndexNow - Cycle completed\n";
        $nextType = 'completed';
        $nextOffset = 0;
    }
    saveProgress($nextOffset, $totalSubmitted, $nextType);
    exit;
}

$chunks = array_chunk($urls, $maxUrlsPerRequest);
$successfulSubmissions = 0;

foreach ($chunks as $urlChunk) {
    $response = submitToIndexNow($urlChunk);
    if ($response['success']) {
        $successfulSubmissions += count($urlChunk);
        echo "Successfully submitted " . count($urlChunk) . " $currentType URLs\n";
    } else {
        echo "Failed to submit $currentType batch: " . $response['error'] . "\n";
    }
    sleep(1);
}

if ($hasMore) {
    $nextOffset = $startOffset + $batchSize;
    $nextType = $currentType;
} else {
    $currentTypeIndex = array_search($currentType, $urlTypes);
    if ($currentTypeIndex !== false && $currentTypeIndex < count($urlTypes) - 1) {
        $nextType = $urlTypes[$currentTypeIndex + 1];
        $nextOffset = 0;
        echo "Finished processing $currentType, moving to $nextType\n";
    } else {
        $nextType = 'completed';
        $nextOffset = 0;
        echo "All URL types completed - Will restart from games on next run\n";
    }
}

$newTotalSubmitted = $totalSubmitted + $successfulSubmissions;
saveProgress($nextOffset, $newTotalSubmitted, $nextType);

echo "Processed: $successfulSubmissions $currentType URLs\n";
echo "Total submitted today: $newTotalSubmitted URLs\n";
echo "Current type: $currentType\n";
echo "Next type: $nextType\n";
echo "Next offset: $nextOffset\n";

$conn->close();

function loadProgress() {
    global $progressFile;
    if (!file_exists($progressFile)) {
        return [
            'offset' => 0,
            'total_submitted' => 0,
            'last_run' => date('Y-m-d H:i:s'),
            'current_type' => 'games'
        ];
    }
    
    $content = file_get_contents($progressFile);
    $data = json_decode($content, true);
    
    if (!$data) {
        return [
            'offset' => 0,
            'total_submitted' => 0,
            'last_run' => date('Y-m-d H:i:s'),
            'current_type' => 'games'
        ];
    }
    
    if (!isset($data['current_type'])) {
        $data['current_type'] = 'games';
    }
    
    return $data;
}

function saveProgress($offset, $totalSubmitted, $currentType = 'games') {
    global $progressFile;
    $data = [
        'offset' => $offset,
        'total_submitted' => $totalSubmitted,
        'last_run' => date('Y-m-d H:i:s'),
        'current_type' => $currentType
    ];
    
    file_put_contents($progressFile, json_encode($data, JSON_PRETTY_PRINT));
}

function submitToIndexNow($urls) {
    global $indexnowkey, $siteurl;
    
    $data = [
        'host' => parse_url($siteurl, PHP_URL_HOST),
        'key' => $indexnowkey,
        'urlList' => $urls
    ];
    
    $json = json_encode($data);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'https://api.indexnow.org/indexnow');
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $json);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Content-Length: ' . strlen($json)
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_USERAGENT, 'IndexNow-Submit/1.0');
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        return ['success' => false, 'error' => $error];
    }
    
    if ($httpCode === 200 || $httpCode === 202) {
        return ['success' => true, 'response' => $response];
    }
    
    return ['success' => false, 'error' => "HTTP $httpCode: $response"];
}

function createGameData($row_data) {
    $game = [];
    $game['game_id'] = $row_data['game_id'];
    $game['game_name'] = $row_data['game_name'];
    $game['name'] = $row_data['name'];
    
    $prefix = !empty($row_data['game_play_uri']) ? $row_data['game_play_uri'] : '/game';
    if (substr($prefix, -1) != '/') {
        $prefix .= '/';
    }
    
    global $siteurl;
    $game['game_url'] = $siteurl . '/' . ltrim($prefix, '/') . slugify($game['game_name']);
    
    return $game;
}

function slugify($text) {
    $text = preg_replace('~[^\pL\d]+~u', '-', $text);
    $text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);
    $text = preg_replace('~[^-\w]+~', '', $text);
    $text = trim($text, '-');
    $text = preg_replace('~-+~', '-', $text);
    $text = strtolower($text);
    
    if (empty($text)) {
        return 'n-a';
    }
    
    return $text;
}

function getGameUrls($conn, $offset, $limit) {
    $query = "SELECT * FROM `gm_games` LIMIT $limit OFFSET $offset";
    $result = $conn->query($query);
    
    $urls = [];
    if ($result && $result->num_rows > 0) {
        while ($game = $result->fetch_assoc()) {
            $gameData = createGameData($game);
            $urls[] = $gameData['game_url'];
        }
    }
    
    $countQuery = "SELECT COUNT(*) as total FROM `gm_games`";
    $countResult = $conn->query($countQuery);
    $total = $countResult->fetch_assoc()['total'];
    $hasMore = ($offset + $limit) < $total;
    
    return ['urls' => $urls, 'has_more' => $hasMore];
}

function getCategoryUrls($conn, $offset, $limit) {
    global $siteurl;
    $query = "SELECT * FROM `gm_categories` LIMIT $limit OFFSET $offset";
    $result = $conn->query($query);
    
    $urls = [];
    if ($result && $result->num_rows > 0) {
        while ($category = $result->fetch_assoc()) {
            $catSlug = seo_friendly_url($category['name']);
            $urls[] = $siteurl . '/category/' . $catSlug;
            $urls[] = $siteurl . '/category/' . $catSlug . '/popular';
            $urls[] = $siteurl . '/category/' . $catSlug . '/rated';
            $urls[] = $siteurl . '/category/' . $catSlug . '/news';
            $urls[] = $siteurl . '/category/' . $catSlug . '/atoz';
        }
    }
    
    $countQuery = "SELECT COUNT(*) as total FROM `gm_categories`";
    $countResult = $conn->query($countQuery);
    $total = $countResult->fetch_assoc()['total'];
    $hasMore = ($offset + $limit) < $total;
    
    return ['urls' => $urls, 'has_more' => $hasMore];
}

function getTagUrls($conn, $offset, $limit) {
    global $siteurl;
    $query = "SELECT * FROM `gm_tags` LIMIT $limit OFFSET $offset";
    $result = $conn->query($query);
    
    $urls = [];
    if ($result && $result->num_rows > 0) {
        while ($tag = $result->fetch_assoc()) {
            $tagSlug = seo_friendly_url($tag['name']);
            $urls[] = $siteurl . '/home/keyword/' . $tagSlug;
            $urls[] = $siteurl . '/home/keyword/' . $tagSlug . '/popular';
            $urls[] = $siteurl . '/home/keyword/' . $tagSlug . '/rated';
            $urls[] = $siteurl . '/home/keyword/' . $tagSlug . '/news';
            $urls[] = $siteurl . '/home/keyword/' . $tagSlug . '/atoz';
        }
    }
    
    $countQuery = "SELECT COUNT(*) as total FROM `gm_tags`";
    $countResult = $conn->query($countQuery);
    $total = $countResult->fetch_assoc()['total'];
    $hasMore = ($offset + $limit) < $total;
    
    return ['urls' => $urls, 'has_more' => $hasMore];
}

function getBlogUrls($conn, $offset, $limit) {
    global $siteurl;
    
    // First get blog posts
    $query = "SELECT * FROM `gm_blogs` LIMIT $limit OFFSET $offset";
    $result = $conn->query($query);
    
    $urls = [];
    if ($result && $result->num_rows > 0) {
        while ($blog = $result->fetch_assoc()) {
            $urls[] = $siteurl . '/blog/' . $blog['url'];
        }
    }
    
    
    
    $countQuery = "SELECT COUNT(*) as total FROM `gm_blogs`";
    $countResult = $conn->query($countQuery);
    $total = $countResult->fetch_assoc()['total'];
    $hasMore = ($offset + $limit) < $total;
    
    return ['urls' => $urls, 'has_more' => $hasMore];
}

 

function getStaticUrls($offset, $limit) {
    global $siteurl;
    
    $staticPages = [
        '',
        'featured',
        'popular', 
        'news',
        'game/viewall/played',
        'updated',
        'rated'
    ];
    
    $urls = [];
    $start = $offset;
    $end = min($offset + $limit, count($staticPages));
    
    for ($i = $start; $i < $end; $i++) {
        if (isset($staticPages[$i])) {
            $url = $staticPages[$i] === '' ? $siteurl : $siteurl . '/' . $staticPages[$i];
            $urls[] = $url;
        }
    }
    
    $hasMore = $end < count($staticPages);
    
    return ['urls' => $urls, 'has_more' => $hasMore];
}

function seo_friendly_url($string) {
    $string = str_replace(array('[\', \']'), '', $string);
    $string = preg_replace('/\[.*\]/U', '', $string);
    $string = preg_replace('/&(amp;)?#?[a-z0-9]+;/i', '-', $string);
    $string = htmlentities($string, ENT_COMPAT, 'utf-8');
    $string = preg_replace('/&([a-z])(acute|uml|circ|grave|ring|cedil|slash|tilde|caron|lig|quot|rsquo);/i', '\\1', $string);
    $string = preg_replace(array('/[^a-z0-9]/i', '/[-]+/'), '-', $string);
    return strtolower(trim($string, '-'));
}
?>
