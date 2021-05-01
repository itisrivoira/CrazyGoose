<?php 
	//Nel file c'è solo una riga, solo l'IP. Quindi prendo il primo elemento dell'array
	// che mi restituisce la funzione file()
	$IP = file("../../indirizzo_server.txt")[0];

	//arriva da "creazioneDB.php" che, se non c'era ancora, crea il DB CrazyGoose
	$mysqli = new mysqli("localhost", "root", "", "CrazyGoose");
	if($mysqli->connect_error){
		if($mysqli->connect_errno == 1049){
			//L'utente è arrivato qui senza passare dal link ma modificando lui url.
			//Tornerà alla pagina login dove dovrà rimettere i campi ma pazienza, se lo merita
			$changePage = "Location: http://".$IP.":80/progetti/CrazyGoose/server_nodejs/sitoWeb/phpFiles/creazioneDB.php?prox=login";
			header($changePage);
		}else{
			die("Errore:".$mysqli->connect_errno." per ".$mysqli->connect_error);
		}
	}else{
		$email = $_POST["email"];
		//cifra la password
		$password = hash("sha256", $_POST["password"]);

		
		$queryResult = $mysqli->query("SELECT * FROM Utenti;");
		$ris_arr_assoc = $queryResult->fetch_all(MYSQLI_ASSOC);

		//echo "<pre>";
		//print_r($ris_arr_assoc);
		//echo "</pre>";
		//echo count($ris_arr_assoc);
		
		$loggatoCorrettamente = false;
		$nome = null;
		$cognome = null;

		if(count($ris_arr_assoc) > 0){
			$flagLoggato = false;
			$flagPasswCorretta = true;

			$i = 0;
			while($i < count($ris_arr_assoc) && $flagPasswCorretta && $flagLoggato == false){
				if($ris_arr_assoc[$i]["email"] == $email){
					if($ris_arr_assoc[$i]["password"] != $password){
						$flagPasswCorretta = false;
					}else{
						$flagLoggato = true;
						$nome = $ris_arr_assoc[$i]["nome"];
						$cognome = $ris_arr_assoc[$i]["cognome"];
					}
				}

				$i += 1;
			}
			
			if(!$flagPasswCorretta || !$flagLoggato){
				echo "EMAIL NON REGISTRATA O PASSWORD ERRATA !";
			}else{
				$loggatoCorrettamente = true;
			}
		}else{
			echo "EMAIL NON REGISTRATA O PASSWORD ERRATA !";
		}

		//session_start();
		//$_SESSION["nome"] = $nome;
		//$_SESSION["cognome"] = $cognome;

		if($loggatoCorrettamente){
			$changePage = "Location: http://".$IP.":3000/";//?nome=$nome&cognome=$cognome";
			echo $nome." ".$cognome;
		}else{
			//in qualche modo si mette msg
			$changePage = "Location: http://".$IP.":3000/login";
		}
		//header($changePage);
	}
?>