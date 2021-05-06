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
			$changePage = "Location: http://$IP:80/progetti/CrazyGoose/server_nodejs/sitoWeb/phpFiles/creazioneDB.php?prox=registrati";
			header($changePage);
		}else{
			die("Errore:".$mysqli->connect_errno." per ".$mysqli->connect_error);
		}
	}else{
		$nome = $_POST["nome"];
		$cognome = $_POST["cognome"];
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
				// e mostrare o meno il msg email gia' in uso
			$changePage = "Location: http://$IP:3000/registrati?err=1";
			$flagEmailGiaInUso = false;
			
			foreach($ris_arr_assoc as $utente){
				if($utente["email"] == $email){
					$flagEmailGiaInUso = true;
					break;
				}
			}
			
			if(!$flagEmailGiaInUso){
				// !!! NON devo inserire l'ID_gioc XKE E' AUTO_INCREMENT
				$queryResult = $mysqli->query("INSERT INTO Utenti (nome, cognome, email, password) VALUES ('$nome', '$cognome', '$email', '$password');");
				if(!$queryResult){
					echo "ERRORE INSERT IN Utenti: ".$mysqli->error." (".$mysqli->errno.")";
				}else{
					//si e' registrato con successo
					$changePage = "Location: http://$IP:3000/login";
					header($changePage);
				}
			}else{
				header($changePage);
			}
		}
	}
?>
