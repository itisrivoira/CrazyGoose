<?php
	//Mi serve l'IP del server. Questo lo leggo solo nel nodejs all'inizio e non riesco a passarlo
	// a tutte le pagine... lo scrivo su un file e quando ne ho bisogno lo leggo
	$IP = file("../indirizzo_server.txt")[0];
	
	session_start();
	session_destroy();
	//e viah, le variabili di sessione sono state tutte cancellate, posso andare alla home

	$changePage = "Location: http://$IP:3000/";
	header($changePage);
?>
