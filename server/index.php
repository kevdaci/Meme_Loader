<?php

	require('credentials.php');

	$dsn = "mysql:host=$host;dbname=$db;port=$port;charset=$charset";

	$opt = [
    	PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    	PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    	PDO::ATTR_EMULATE_PREPARES   => false,
	];
	$pdo = new PDO($dsn, $user, $pass, $opt);

	//Query the description and image_name from memes database and echo the data
	$data = $pdo->query("SELECT description, image_name FROM memes")->fetchAll(PDO::FETCH_OBJ);
	echo json_encode($data);
?>