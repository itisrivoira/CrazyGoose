<?php
	//Nel file c'è solo una riga, solo l'IP. Quindi prendo il primo elemento dell'array
	// che mi restituisce la funzione file()
	$IP = file("../../indirizzo_server.txt")[0];
	
	session_start();
	session_destroy();

	$changePage = "Location: http://".$IP.":3000/passaAPaginaPHP?pagina=sitoWeb/phpPages/home";
	header($changePage);
?>