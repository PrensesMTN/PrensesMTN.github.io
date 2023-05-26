<?php
session_start();

if (isset($_SESSION['clickcount'])) {
    $_SESSION['clickcount']++;
} else {
    $_SESSION['clickcount'] = 1;
}

$clickCount = $_SESSION['clickcount'];
?>

<!doctype html>
<html lang="en">
<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
</head>
<body>
    <p><button onclick="clickCounter()" type="button">Click me!</button></p>
    <div id="result"><?php echo "You have clicked the button $clickCount time(s)."; ?></div>
    <p>Click the button to see the counter increase.</p>
    <p>Close the browser tab (or window), and try again, and the counter will continue to count (is not reset).</p>

    <script>
    function clickCounter() {
        // This part remains the same since it runs on the client-side
        alert("The counter will continue to count on the server-side (PHP) even if you close the tab or window.");
    }
    </script>
</body>
</html>

    
    