<?php
	//Nel file c'è solo una riga, solo l'IP. Quindi prendo il primo elemento dell'array
	// che mi restituisce la funzione file()
	$IP = file("../../indirizzo_server.txt")[0];

	$mysqli = new mysqli("localhost", "root", "", "CrazyGoose");
	if($mysqli->connect_error){
		if($mysqli->connect_errno == 1049){
			//L'utente è arrivato qui senza passare dal link ma modificando lui url.
			//Tornerà alla pagina login dove dovrà rimettere i campi ma pazienza, se lo merita
			echo "DB non ancora creato !";
		}else{
			die("Errore:".$mysqli->connect_errno." per ".$mysqli->connect_error);
		}
	}else{

		$username = $_GET["username"];
		/*
			if(!$mysqli->query("CREATE TABLE IF NOT EXISTS Profili (
									username VARCHAR(20) PRIMARY KEY NOT NULL,
									grado VARCHAR(15) NOT NULL,
									partiteVinte INT NOT NULL,
									partitePerse INT NOT NULL,
									ID_giocatore INT NOT NULL,
									FOREIGN KEY(ID_giocatore) REFERENCES Utenti(ID_giocatore)
								);")){
		*/
		
		$changePage = "Location: http://$IP:80/progetti/CrazyGoose/server_nodejs/sitoWeb/phpPages/profilo.php";

		if(!$mysqli->query("DELETE FROM Profili WHERE username = '$username';")){
			echo "Errore nella cancellazione: ".$mysqli->error;
			$changePage = null;
		}
		if($changePage != null){
			header($changePage);
		}
	}
?>