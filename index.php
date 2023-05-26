<?php

// Oturum kontrolü
session_start();
if (isset($_SESSION['login'])) {
    echo '<ul>';
    echo '<li><a href="admin.php">Admin</a></li>';
    echo '</ul>';
}


$host = 'localhost';
$username = 'root';
$password = 'Prenses10.';
$database = 'site_db';

$mysqli = new mysqli($host, $username, $password, $database);

if ($mysqli->connect_error) {
    die("Bağlantı hatası: " . $mysqli->connect_error);
}

// Menü bağlantıları ve içeriğinin getirilmesi
$menuId = isset($_GET['menu']) ? $_GET['menu'] : 1;

$sql = "SELECT icerik FROM sayfalar WHERE id = " . $menuId;
$result = $mysqli->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $icerik = $row["icerik"];
} else {
    $icerik = "Sayfa içeriği bulunamadı.";
}

// İletişim formu gönderildiğinde verileri veritabanına kaydetme
if ($_SERVER["REQUEST_METHOD"] == "POST" && $menuId == 9) {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $message = $_POST['message'];

    $sql = "INSERT INTO iletisim_formu (name, email, message) VALUES ('$name', '$email', '$message')";

    if ($mysqli->query($sql) === true) {
        echo "Mesajınız başarıyla gönderildi!";
    } else {
        echo "Hata: " . $mysqli->error;
    }
}

$mysqli->close();
?>

<!DOCTYPE html>
<html>
<head>
    <title>Site Haritası</title>
    <style>
        #harita {
            height: 400px;
            width: 100%;
        }
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
        }
        h1 {
            color: #333;
            margin-top: 0;
        }
        ul {
            list-style-type: none;
            margin: 0;
            padding: 0;
            background-color: #f1f1f1;
        }
        li {
            display: inline-block;
            margin-right: 10px;
        }
        li a {
            display: block;
            padding: 10px;
            text-decoration: none;
            color: #333;
        }
        li a:hover {
            background-color: #ddd;
        }
        li ul {
            display: none;
            position: absolute;
            background-color: #fff;
            border: 1px solid #ccc;
            padding: 0;
        }
        li:hover ul {
            display: block;
        }
        li ul li {
            float: none;
            width: 200px;
            border-bottom: 1px solid #ccc;
        }
        .content {
            margin-top: 20px;
        }
        .contact-info {
            margin-bottom: 20px;
        }
        .contact-info p {
            margin: 5px 0;
        }
        .contact-form {
            max-width: 500px;
        }
        .contact-form label {
            display: block;
            margin-bottom: 5px;
        }
        .contact-form input[type="text"],
        .contact-form input[type="email"],
        .contact-form textarea {
            width: 100%;
            padding: 10px;
            margin-bottom: 10px;
        }
        .contact-form input[type="submit"] {
            background-color: #333;
            color: #fff;
            border: none;
            padding: 10px 20px;
            cursor: pointer;
        }
        .contact-form input[type="submit"]:hover {
            background-color: #555;
        }
        .map {
            height: 400px;
            width: 100%;
            margin-top: 20px;
        }
    </style>
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBWoAm2-btyCY7iMerV6-PsoYAALMA6K30&callback=initMap" async defer></script>
    <script>
        function initMap() {
            var map = new google.maps.Map(document.getElementById("harita"), {
                center: { lat: 36.7856856, lng: 34.5276161 },
                zoom: 17
            });

            var marker = new google.maps.Marker({
                position: { lat: 36.7856856, lng: 34.5276161 },
                map: map
            });
        }
    </script>
</head>
<body>
    <h1>Site Haritası</h1>
    <ul>
        <li><a href="index.php?menu=1">Ana Sayfa</a></li>
        <li><a href="index.php?menu=2">Hakkımda</a>
            <ul>
                <li><a href="index.php?menu=3">Özgeçmişim</a></li>
                <li><a href="index.php?menu=4">Hobilerim</a></li>
                <li><a href="index.php?menu=5">Fobilerim</a></li>
            </ul>
        </li>
        <li><a href="index.php?menu=6">Portfolyo</a>
            <ul>
                <li><a href="index.php?menu=7">Bitirdiğim Okullar</a></li>
                <li><a href="index.php?menu=8">Bitirdiğim Projeler</a></li>
            </ul>
        </li>
        <li><a href="index.php?menu=9">İletişim</a></li>
        
        
    </ul>

    <div class="content">
        <?php
        if ($menuId == 9) { // İletişim sayfası kontrolü
            echo '<h2>İletişim</h2>';
            echo '<div class="contact-info">';
            echo '<p>Telefon: 0(000)000 00 00</p>';
            echo '<p>Adres: Mersin Üniversitesi Mersin Meslek Yüksekokulu Uzaktan Eğitim Tece/Mersin</p>';
            echo '</div>';

            echo '<h3>İletişim Formu</h3>';
            echo '<form class="contact-form" method="post" action="index.php?menu=9">';
            echo '<label for="name">Adınız:</label>';
            echo '<input type="text" id="name" name="name" required><br>';
            echo '<label for="email">E-posta Adresiniz:</label>';
            echo '<input type="email" id="email" name="email" required><br>';
            echo '<label for="message">Mesajınız:</label>';
            echo '<textarea id="message" name="message" required></textarea><br>';
            echo '<input type="submit" value="Gönder">';
            echo '</form>';

            echo '<div id="harita" class="map"></div>'; // Harita bölümü
        } else {
            echo $icerik;
        }
        ?>
    </div>
</body>
</html>
