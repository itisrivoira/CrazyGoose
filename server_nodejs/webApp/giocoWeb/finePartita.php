<?php
	//Nel file c'è solo una riga, solo l'IP. Quindi prendo il primo elemento dell'array
    // che mi restituisce la funzione file()
    $IP = file("../../indirizzo_server.txt")[0];
	
	session_start();
	if( isset($_SESSION["ID"]) && isset($_SESSION["username"]) && isset($_SESSION["durata"]) &&
		isset($_SESSION["numMosse"]) && isset($_SESSION["vitt"]) ){

		$mysqli = new mysqli("localhost", "root", "", "CrazyGoose");
		if($mysqli->connect_error){
			echo "Errore ".$mysqli->connect_error;
		}else{
			$username = $_SESSION["username"];
			$durata = $_SESSION["durata"];
			$numMosse = $_SESSION["numMosse"];
			$vitt = $_SESSION["vitt"];

			$queryResults = $mysqli->query("INSERT INTO Partite (durata) VALUES ('$durata');");
			if(!$queryResults){
				echo "Errore inseritmento parita ".$mysqli->error;
			}else{
				//ritorna l'ultimo ID assegnato automaticamente (campo AUTO_INCREMENT) nell'ultima query
				$idPartita = $mysqli->insert_id;
				$queryResults = $mysqli->query("INSERT INTO Partecipare VALUES ('$idPartita', '$username', '$vitt', '$numMosse');");
				if(!$queryResults){
					echo "Errore inseritmento partecipare ".$mysqli->error;
				}else{
					$queryResults = $mysqli->query("SELECT * FROM Profili WHERE(username = '$username');");
					if(!$queryResults){
						echo "Errore get profilo ".$mysqli->error;
					}else{
						$ris_array_assoc = $queryResults->fetch_assoc();
						if($vitt){
							$partiteVinteAdesso = $ris_array_assoc["partiteVinte"]+1;

							$queryResults = $mysqli->query("UPDATE Profili SET partiteVinte = '$partiteVinteAdesso' WHERE username = '$username';");
						}else{
							$partiteVinteAdesso = $ris_array_assoc["partitePerse"]+1;

							$queryResults = $mysqli->query("UPDATE Profili SET partitePerse = '$partiteVinteAdesso' WHERE username = '$username';");
						}

						if(!$queryResults){
							echo "Errore set profilo ".$mysqli->error;
						}else{
							$queryResults = $mysqli->query("SELECT partiteVinte FROM Profili WHERE(username = '$username');");
							if(!$queryResults){
								echo "Errore get profilo ".$mysqli->error;
							}else{
								$ris_array_assoc = $queryResults->fetch_assoc();
								$vittorie = $ris_array_assoc["partiteVinte"];
								
								if($vittorie < 5){
									$grado = "Novellino";
								}elseif($vittorie >= 5 && $vittorie < 10){
									$grado = "Principiante";
								}elseif($vittorie >= 10 && $vittorie < 20){
									$grado = "Intermedio";
								}elseif($vittorie >= 20 && $vittorie < 30){
									$grado = "Esperto";
								}elseif($vittorie >= 30){
									$grado = "Maestro";
								}
								
								$queryResults = $mysqli->query("UPDATE Profili SET grado = '$grado' WHERE(username = '$username');");

								if(!$queryResults){
									echo "Errore set profilo ".$mysqli->error;
								}else
									//ora non mi servono più queste variabili, inoltre distruggendole evito che
									// se l'utente ricarica la pagina, venga caricata un nuovo record di Partecipare
									
									unset($_SESSION["durata"]);
									unset($_SESSION["numMosse"]);
									unset($_SESSION["vitt"]);
								}
							}
						}
						
					}
				}
			}
?>

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>
		<?php
			if($vitt == 1){
				echo "VITTORIA !";
				$styleVittoria = "display: block;";
				$styleSconfitta = "display: none;";
			}else{
				echo "Sconfitta...";
				$styleVittoria = "display: none;";
				$styleSconfitta = "display: block;";
			}
		?>
	</title>

	<link rel="stylesheet" href="../../public/res_static_gioco/css/finePartita.css">
</head>
<body>
	<div id="vittoria" style="<?php echo $styleVittoria; ?>">
        <label id="msgHaiVinto"><center><b>HAI VINTO</b></center></label>
        <center><a class="premiEsc" href="http://<?php echo $IP; ?>:80/progetti/CrazyGoose/server_nodejs/webApp/menu/homeGioco.php"><b>Premi per rigiocare</b></a></center>
    </div>

    <div id="sconfitta" style="<?php echo $styleSconfitta; ?>">
        <label id="msgHaiPerso"><center><b>HAI PERSO</b></center></label>
        <center><a class="premiEsc" href="http://<?php echo $IP; ?>:80/progetti/CrazyGoose/server_nodejs/webApp/menu/homeGioco.php"><b>Premi per rigiocare</b></a></center>
    </div>
	<br><br>
</body>
</html>

<?php 
	}else{
?>

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>COME SEI ARRIVATO QUI !</title>
</head>
<body>
	<h1>NON HAI IL PERMESSO DI ESSERE QUI !</h1>
</body>
</html>

<?php 
	}
?>
