<?php
include 'assets/includes/config.php';

$servername = $dbGM['host'];
$username = $dbGM['user'];
$password = $dbGM['pass'];
$dbname = $dbGM['name'];

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if column 'wt_video' exists
$checkColumn = $conn->query("SHOW COLUMNS FROM `gm_games` LIKE 'wt_video'");
if ($checkColumn->num_rows == 0) {
    // Add column 'wt_video' to table 'gm_games'
    $addColumn = "ALTER TABLE gm_games ADD wt_video VARCHAR(255)";
    if ($conn->query($addColumn) === TRUE) {
        echo "Column 'wt_video' added successfully.<br>";
    } else {
        echo "Error adding column: " . $conn->error . "<br>";
    }
} else {
    echo "Column 'wt_video' already exists.<br>";
}

// Function to get game video URL
function getGameVideo($gameId) {
    $url = "https://api.gamemonetize.com/video.php?gameid=" . $gameId;
    $response = file_get_contents($url);
    $data = json_decode($response, true);
    if ($data['isSuccess'] && isset($data['data']['detail'][0]['mediaURL'])) {
        return $data['data']['detail'][0]['mediaURL'];
    }
    return null;
}


// Count total games with wt_video NULL or empty
$countResult = $conn->query("SELECT COUNT(*) as total FROM gm_games WHERE wt_video IS NULL OR wt_video = ''");
if ($countResult) {
    $countRow = $countResult->fetch_assoc();
    echo "Total games with wt_video NULL or empty: " . $countRow['total'] . "<br>";
} else {
    echo "Error counting games: " . $conn->error . "<br>";
}
// Fetch games that do not have wt_video
$result = $conn->query("SELECT game_id, image FROM gm_games WHERE wt_video IS NULL OR wt_video = '' OR wt_video LIKE 'https://html5.gamemonetize%' ORDER BY wt_video IS NULL DESC, wt_video = '' DESC");
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Load the JSON file
        $jsonData = file_get_contents('games-wt-video.json');
        $gamesWtVideo = json_decode($jsonData, true);

        // Search for wt_video in the JSON data
        $wtVideo = null;
        foreach ($gamesWtVideo as $game) {
            if ($game['image'] == $row['image']) {
                $wtVideo = $game['wt_video'];
                break;
            }
        }

        // If wt_video is not found in JSON, get it from the API
        if (!$wtVideo) {
            $gameId = explode("/", $row['image'])[3];
            $wtVideo = getGameVideo($gameId);
        }
        
        if ($wtVideo) {
            $updateQuery = "UPDATE gm_games SET wt_video = '" . $conn->real_escape_string($wtVideo) . "' WHERE game_id = " . $row['game_id'];
            if ($conn->query($updateQuery) === TRUE) {
                echo "Updated game ID " . $row['game_id'] . " with wt_video. ". explode("/", $row['image'])[3] . " " . $wtVideo. "<br>";
            } else {
                echo "Error updating game ID " . $row['game_id'] . ": " . $conn->error . "<br>";
            }
        } else {
            echo "No video found for game ID " . $row['game_id'] . "<br>";
        }
    }
} else {
    echo "No games found.<br>";
}

$conn->close();
?>