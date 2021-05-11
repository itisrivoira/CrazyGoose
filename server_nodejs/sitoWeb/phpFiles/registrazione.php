<?php 
	//Mi serve l'IP del server. Questo lo leggo solo nel nodejs all'inizio e non riesco a passarlo
	// a tutte le pagine... lo scrivo su un file e quando ne ho bisogno lo leggo
	$IP = file("../../indirizzo_server.txt")[0];

	//Si connette al DB CrazyGoose
	$mysqli = new mysqli("localhost", "root", "", "CrazyGoose");
	if($mysqli->connect_error){
		if($mysqli->connect_errno == 1049){
			/*Cosa è successo ? Il DB non esiste ancora com'è possibile ? Può entrare qui SOLO se l'utente
				ha modificato l'URL per andare alla pagina di registrazione ma in quel modo non è passato
				da creazioneDB.php ...*/
			$changePage = "Location: http://$IP:80/progetti/CrazyGoose/server_nodejs/sitoWeb/phpFiles/creazioneDB.php?prox=registrati";
			header($changePage);
		}else{
			die("Errore:".$mysqli->connect_errno." per ".$mysqli->connect_error);
		}
	}else{
		//(sono sicuro che i dati ci siano xke ho fatto i controlli nella pagina  registrati.html)
		$nome = $_POST["nome"];
		$cognome = $_POST["cognome"];
		$email = $_POST["email"];
		//cifra la password (è memorizzata cifrata nel DB)
		$password = hash("sha256", $_POST["password"]);

		$queryResult = $mysqli->query("SELECT * FROM Utenti;");
		if(!$queryResult){
			die("ERRORE SELECT Utenti: ".$mysqli->error." (".$mysqli->errno.")");
		}else{
			//Mi ritorna un array posizionale, dove in ogni posizione (0,1,2,3,...) ho un Utente
			// sotto forma di array associativo ([ID_gioc]=..., [nome]=...)
			$ris_arr_assoc = $queryResult->fetch_all(MYSQLI_ASSOC);

			//Passo semplicemente in GET un flag alla fine... mi serve per modificare con jsdom la pagina
			// e mostrare o meno il msg "email gia' in uso"
			$changePage = "Location: http://$IP:3000/registrati?err=1";
			$flagEmailGiaInUso = false;
			
			foreach($ris_arr_assoc as $utente){
				if($utente["email"] == $email){
					$flagEmailGiaInUso = true;
					break;
				}
			}
			
			if(!$flagEmailGiaInUso){
				// !!! NON devo inserire l'ID_gioc XKE E' AUTO_INCREMENT !!!
				$queryResult = $mysqli->query("INSERT INTO Utenti (nome, cognome, email, password) VALUES ('$nome', '$cognome', '$email', '$password');");
				if(!$queryResult){
					die("ERRORE INSERT IN Utenti: ".$mysqli->error." (".$mysqli->errno.")");
				}else{
					//È andato tutto bene, si è registrato...
					$changePage = "Location: http://$IP:3000/accedi";
				}
			}
			header($changePage);
		}
	}
?>
