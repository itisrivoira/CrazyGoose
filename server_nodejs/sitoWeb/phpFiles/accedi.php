<?php 
	session_start();

	//Mi serve l'IP del server. Questo lo leggo solo nel nodejs all'inizio e non riesco a passarlo
	// a tutte le pagine... lo scrivo su un file e quando ne ho bisogno lo leggo
	$IP = file("../../indirizzo_server.txt")[0];

	//Tento di connettermi al DB CrazyGoose
	$mysqli = new mysqli("localhost", "root", "", "CrazyGoose");
	if($mysqli->connect_error){
		if($mysqli->connect_errno == 1049){
			//Puo' entrare qui solo se l'utente ha MODIFICATO l'url, quindi senza passare dai link, e se
			// questo e' pure il primo utente sul sito (non ha ancora creato il DB).
			//Crea il DB e torna alla pagina di login
			$changePage = "Location: http://$IP:80/progetti/CrazyGoose/server_nodejs/sitoWeb/phpFiles/creazioneDB.php?prox=login";
			header($changePage);
		}else{
			die("Errore:".$mysqli->connect_errno." per ".$mysqli->connect_error);
		}
	}else{
		$email = $_POST["email"];
		//cifra la password
		$password = hash("sha256", $_POST["password"]);

		
		$queryResult = $mysqli->query("SELECT * FROM Utenti;");
		if(!$queryResult){
			echo "ERRORE SELECT Utenti: ".$mysqli->error." (".$mysqli->errno.")";
		}else{
			$ris_arr_assoc = $queryResult->fetch_all(MYSQLI_ASSOC);

			//echo "<pre>";
			//print_r($ris_arr_assoc);
			//echo "</pre>";

				//passo in get un flag alla fine... mi serve per modificare con jsdom la pagina
				// e mostrare o meno il msg email o passw sbagliati
			$changePage = "Location: http://$IP:3000/login?err=1";
			
			foreach($ris_arr_assoc as $utente){
				if($utente["email"] == $email && $utente["password"] == $password){
					$_SESSION["ID"] = $utente["ID_gioc"];
					unset($_SESSION["username"]);
					$changePage = "Location: http://$IP:3000/passaAPaginaPHP?pagina=sitoWeb/phpPages/home";
					break;
				}
			}
			header($changePage);
		}
		
	}
?>
