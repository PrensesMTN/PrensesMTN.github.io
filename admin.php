<?php
session_start();

if (!isset($_SESSION['login'])) {
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        // Giriş bilgilerini kontrol etme
        $username = $_POST['username'];
        $password = $_POST['password'];

        if ($username === 'admin' && $password === 'admin123') {
            $_SESSION['login'] = true;
            header("Location: admin.php");
            exit();
        } else {
            $error = "Geçersiz kullanıcı adı veya şifre.";
        }
    }

    // Giriş yapılmamışsa giriş formunu gösterme
    ?>

    <!DOCTYPE html>
    <html>
    <head>
        <title>Site Yönetimi</title>
    </head>
    <body>
        <h1>Site Yönetimi</h1>
        <form method="post" action="<?php echo $_SERVER['PHP_SELF']; ?>">
            <label for="username">Kullanıcı Adı:</label>
            <input type="text" id="username" name="username" required><br><br>
            <label for="password">Şifre:</label>
            <input type="password" id="password" name="password" required><br><br>
            <input type="submit" value="Giriş Yap">
        </form>
        <?php
        if (isset($error)) {
            echo "<p style='color: red;'>$error</p>";
        }
        ?>
    </body>
    </html>

    <?php
} else {
    // Giriş yapıldıysa veritabanı içeriğini gösterme
    $servername = "localhost";
    $username = "root";
    $password = "1234";
    $dbname = "site_db";

    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        die("Veritabanı bağlantısı başarısız: " . $conn->connect_error);
    }

    $sql = "SELECT * FROM sayfalar";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        echo "<h2>Sayfa İçerikleri</h2>";
        echo "<table><tr><th>ID</th><th>Başlık</th><th>İçerik</th></tr>";
        while ($row = $result->fetch_assoc()) {
            echo "<tr><td>" . $row["id"] . "</td><td>" . $row["baslik"] . "</td><td>" . $row["icerik"] . "</td></tr>";
        }
        echo "</table>";
    } else {
        echo "Sayfa içeriği bulunamadı.";
    }

    $conn->close();
}
?>
