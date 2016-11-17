<?php
header("Content-type: text/html; charset=utf-8");
$servername = "localhost";
$username = "aljbbs";
$password = "alj4006160333";
$datasheet = 'aljbbs';
$conn = new mysqli($servername, $username, $password,$datasheet);
$targetSheet = "ts_messageslist";
?>