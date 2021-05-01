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
			$changePage = "Location: http://".$IP.":80/progetti/CrazyGoose/server_nodejs/sitoWeb/phpFiles/creazioneDB.php?prox=registrati";
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
		$ris_arr_assoc = $queryResult->fetch_all(MYSQLI_ASSOC);

		//echo "<pre>";
		//print_r($ris_arr_assoc);
		//echo "</pre>";
		//echo count($ris_arr_assoc);
		
		if(count($ris_arr_assoc) > 0){
			$flagGiaRegistrato = false;

			$i = 0;
			while($i < count($ris_arr_assoc) && $flagGiaRegistrato == false){
				if($ris_arr_assoc[$i]["email"] == $email){
					$flagGiaRegistrato = true;
				}

				$i += 1;
			}
			
			if(!$flagGiaRegistrato){
				registra_utente($mysqli, $nome, $cognome, $email, $password);
			}else{
				echo "EMAIL GIÀ IN USO";
			}
		}else{
			registra_utente($mysqli, $nome, $cognome, $email, $password);
		}

		//session_start();
		//$_SESSION["nome"] = $nome;
		//$_SESSION["cognome"] = $cognome;

		$changePage = "Location: http://".$IP.":3000/";//?nome=$nome&cognome=$cognome";
		header($changePage);
	}

	function registra_utente($mysqli, $nome, $cognome, $email, $password){
		if(!$mysqli->query("INSERT INTO Utenti (nome, cognome, email, password) VALUES ('$nome', '$cognome', '$email', '$password');")){
			echo "<br>ERRORE NELLA INSERT ".$mysqli->error;
		}else{
			echo "<br>inserito";
		}
	}
?>