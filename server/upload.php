<?php
	require('credentials.php');

	$dsn = "mysql:host=$host;dbname=$db;port=$port;charset=$charset";

	$opt = [
    	PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    	PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    	PDO::ATTR_EMULATE_PREPARES   => false,
	];
	$pdo = new PDO($dsn, $user, $pass, $opt);


	if(isset($_FILES['upload_file'])){

		/*
		 * Upload the image from the local machine file to the file in the server.
		 * Also, add description and the image_name to the database. Echo is the request
		 * has been successful.
		 */
		if(move_uploaded_file($_FILES['upload_file']['tmp_name'], "../images/".$_FILES['upload_file']['name'])){
			$description = $_POST['description'];
			$image_name = $_POST['image_name'];
			$stmt = $pdo->prepare("INSERT INTO memes (description, image_name) VALUES (?, ?)");
			$stmt->execute([$description, $image_name]);
			echo $_FILES['upload_file']['tmp_name']." OK";
		}
		else{
			echo $_FILES['upload_file']['name']. " KO";
		}
	}
	else{
		echo "No file uploaded";
	}

?>