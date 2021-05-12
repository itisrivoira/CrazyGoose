<?php
	session_start();
	if(isset($_SESSION["username"])){
		unset($_SESSION["username"]);
	}

	//Mi serve l'IP del server. Questo lo leggo solo nel nodejs all'inizio e non riesco a passarlo
	// a tutte le pagine... lo scrivo su un file e quando ne ho bisogno lo leggo
	$IP = file("../../indirizzo_server.txt")[0];

	$mysqli = new mysqli("localhost", "root", "", "CrazyGoose");
	if($mysqli->connect_error){
		die("Errore:".$mysqli->connect_errno." per ".$mysqli->connect_error);
	}else{
		$username = $_GET["username"];
		
		$changePage = "Location: http://$IP:3000/passaAPaginaPHP?pagina=sitoWeb/phpPages/profilo.php";

		$queryResult = $mysqli->query("SELECT * FROM Partecipare WHERE username = '$username';");
		if(!$queryResult){
			die("Errore get i partecipare: ".$mysqli->error);
			$changePage = null;
		}else{
			//Avrò una tabella con tutte i campi di Partecipare e un record
			// per ogni partita fatta da questo profilo
			$ris_arr_assoc = $queryResult->fetch_all(MYSQLI_ASSOC);

			//DEVO CANCELLARE IN ORDINE IL PROFILO E TUTTE LE SUE PARTITE !!!
			// Prima cancello il record di Partecipare (che non ha un ID particolare
			// che diventa chiave esterna da qualche parte)
			// Ora posso eliminare la partita con il certo ID (prima non potevo xke il foreign
			// key di Partecipare sarebbe "rimasto appeso lì senza sapere più il suo valore")
			// E QUANDO HO FINITO TUTTI I PARTECIPARE/PARTITE POSSO ELIMINARE IL PROFILO

			foreach($ris_arr_assoc as $recordPartecipare){
				$idPartita = $recordPartecipare["ID_partita"];
				
				$queryResult = $mysqli->query("DELETE FROM Partecipare WHERE ID_partita = '$idPartita';");
				if(!$queryResult){
					die("Errore delete partecipare: ".$mysqli->error);
					$changePage = null;
				}else{
					
					$queryResult = $mysqli->query("DELETE FROM Partite WHERE ID_part = '$idPartita';");
					if(!$queryResult){
						die("Errore delete partita: ".$mysqli->error);
						$changePage = null;
					}
				}
			}

			$queryResult = $mysqli->query("DELETE FROM Profili WHERE username = '$username';");
			if(!$queryResult){
				die("Errore delete profilo: ".$mysqli->error);
				$changePage = null;
			}
		}

		if($changePage != null){
			header($changePage);
		}
	}
?>