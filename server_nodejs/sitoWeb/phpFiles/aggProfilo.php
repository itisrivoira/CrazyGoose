<?php
	session_start();
	
	//Mi serve l'IP del server. Questo lo leggo solo nel nodejs all'inizio e non riesco a passarlo
	// a tutte le pagine... lo scrivo su un file e quando ne ho bisogno lo leggo
	$IP = file("../../indirizzo_server.txt")[0];

	//Si connette al DB CrazyGoose
	$mysqli = new mysqli("localhost", "root", "", "CrazyGoose");
	if($mysqli->connect_error){
		die("Errore:".$mysqli->connect_errno." per ".$mysqli->connect_error);
	}else{
		$ID_giocatore = $_SESSION["ID"];
		//(sono sicuro che il dato ci sia xke ho fatto i controlli nella pagina  registrati.html)
		$username = $_POST["username"];
		
		$changePage = "Location: http://$IP:80/progetti/CrazyGoose/server_nodejs/sitoWeb/phpPages/profilo.php";

		if(!$mysqli->query("INSERT INTO Profili VALUES ('$username', 'Novellino', 0, 0, '$ID_giocatore');")){
			//username già presente ==> Error: Duplicate entry usernameScritto for key 'PRIMARY'
			if($mysqli->errno == 1062){
				//Passo semplicemente in GET un flag alla fine... mi serve per modificare con jsdom la pagina
				// e mostrare o meno il msg "username già in uso"
				$changePage = "Location: http://$IP:80/progetti/CrazyGoose/server_nodejs/sitoWeb/phpPages/profilo.php?agg=1&err=1";
			}else{
				die("Errore nell'inserimento: ".$mysqli->error);
				$changePage = null;
			}
		}
		if($changePage != null){
			header($changePage);
		}
	}
?>