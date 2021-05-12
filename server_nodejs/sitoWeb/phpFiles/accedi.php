<?php 
	session_start();

	//Mi serve l'IP del server. Questo lo leggo solo nel nodejs all'inizio e non riesco a passarlo
	// a tutte le pagine... lo scrivo su un file e quando ne ho bisogno lo leggo
	$IP = file("../../indirizzo_server.txt")[0];

	//Si connette al DB CrazyGoose
	$mysqli = new mysqli("localhost", "root", "", "CrazyGoose");
	if($mysqli->connect_error){
		if($mysqli->connect_errno == 1049){
			/*Cosa è successo ? Il DB non esiste ancora com'è possibile ? Può entrare qui SOLO se l'utente
				ha modificato l'URL per andare alla pagina di accesso ma in quel modo non è passato
				da creazioneDB.php ...*/
			$changePage = "Location: http://$IP:80/progetti/CrazyGoose/server_nodejs/sitoWeb/phpFiles/creazioneDB.php?prox=login";
			header($changePage);
		}else{
			die("Errore:".$mysqli->connect_errno." per ".$mysqli->connect_error);
		}
	}else{
		//(sono sicuro che i dati ci siano xke ho fatto i controlli nella pagina  accedi.html)
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
			// e mostrare o meno il msg "email o passw errati"
			$changePage = "Location: http://$IP:3000/accedi?err=1";
			
			foreach($ris_arr_assoc as $utente){
				if($utente["email"] == $email && $utente["password"] == $password){
					$_SESSION["ID"] = $utente["ID_gioc"];
					
					//(in caso si stesse loggando con un altro utente ma durante la stessa sessione
					// non gli deve mostrare un profilo di un altro account utente)
					unset($_SESSION["username"]);

					$changePage = "Location: http://$IP:3000/passaAPaginaPHP?pagina=sitoWeb/phpPages/home.php";
					break;
				}
			}
			header($changePage);
		}
	}
?>
