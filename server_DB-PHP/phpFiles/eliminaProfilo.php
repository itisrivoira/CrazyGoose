<?php
	require("GestoreDB.php");

    session_start();
	if(isset($_SESSION["username"])){
		unset($_SESSION["username"]);
	}

	//Mi serve l'IP del server. Questo lo leggo solo nel nodejs all'inizio e non riesco a passarlo
	// a tutte le pagine... lo scrivo su un file e quando ne ho bisogno lo leggo
	$IP = file("../indirizzo_server.txt")[0];

    $gestDB = new GestDB();
    $username = $_GET["username"];
    
    if($gestDB->eliminaProfilo($username)){
        header("Location: http://$IP:3000/passaAPaginaPHP?pagina=sitoWeb/phpPages/profilo.php");
    }
?>