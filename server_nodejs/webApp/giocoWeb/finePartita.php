<?php
	session_start();

	//Mi serve l'IP del server. Questo lo leggo solo nel nodejs all'inizio e non riesco a passarlo
	// a tutte le pagine... lo scrivo su un file e quando ne ho bisogno lo leggo
    $IP = file("../../indirizzo_server.txt")[0];
	

	if( isset($_SESSION["ID"]) && isset($_SESSION["username"]) && isset($_SESSION["durata"]) &&
		isset($_SESSION["numMosse"]) && isset($_SESSION["vitt"]) ){

		$mysqli = new mysqli("localhost", "root", "", "CrazyGoose");
		if($mysqli->connect_error){
			die("Errore ".$mysqli->connect_error);
		}else{
			$username = $_SESSION["username"];
			$durata = $_SESSION["durata"];
			$numMosse = $_SESSION["numMosse"];
			$vitt = $_SESSION["vitt"];

			//L'entità Partite ha due campi ID_part e durata, ID_part è AUTO INCREMENT
			$queryResults = $mysqli->query("INSERT INTO Partite (durata) VALUES ('$durata');");
			if(!$queryResults){
				die("Errore inseritmento partita ".$mysqli->error);
			}else{
				//!!! 
				//ritorna l'ultimo ID assegnato automaticamente (campo AUTO_INCREMENT) nell'ultima query
				$idPartita = $mysqli->insert_id;
				//!!!

				$queryResults = $mysqli->query("INSERT INTO Partecipare VALUES ('$idPartita', '$username', '$vitt', '$numMosse');");
				if(!$queryResults){
					die("Errore inseritmento partecipare ".$mysqli->error);
				}else{

					$queryResults = $mysqli->query("SELECT * FROM Profili WHERE username = '$username';");
					if(!$queryResults){
						die("Errore get profilo ".$mysqli->error);
					}else{

						$ris_array_assoc = $queryResults->fetch_assoc();
						if($vitt){
							$partiteVinteAdesso = $ris_array_assoc["partiteVinte"]+1;

							$queryResults = $mysqli->query("UPDATE Profili SET partiteVinte = '$partiteVinteAdesso' WHERE username = '$username';");
						}else{
							$partitePerseAdesso = $ris_array_assoc["partitePerse"]+1;

							$queryResults = $mysqli->query("UPDATE Profili SET partitePerse = '$partitePerseAdesso' WHERE username = '$username';");
						}

						if(!$queryResults){
							die("Errore set profilo ".$mysqli->error);
						}else{
							$queryResults = $mysqli->query("SELECT partiteVinte FROM Profili WHERE username = '$username';");
							if(!$queryResults){
								die("Errore get profilo ".$mysqli->error);
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
									die("Errore set profilo ".$mysqli->error);
								}else
									//ora non mi servono più queste variabili, inoltre distruggendole evito che
									// se l'utente ricarica la pagina, venga caricatp un nuovo record di Partecipare e Partite
									
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

	<!-- siamo in un file php quindi non "usa nodejs" e la cartella public per le risorse statiche,
	 quindi devo cambiare il percorso (in un file normale userei /res_static_menu/... perchè sa che
     una risorsa statica la deve prendere dalla cartella /public) -->

	<link rel="stylesheet" href="../../public/res_static_gioco/css/finePartita.css">

	<!-- Per l'icona piccoliina nella scheda -->
	<link rel="icon" type="image/png" href="../../public/favicon/favicon-196x196.png" sizes="196x196" />
	<link rel="icon" type="image/png" href="../../public/favicon/favicon-128.png" sizes="128x128" />
	<link rel="icon" type="image/png" href="../../public/favicon/favicon-96x96.png" sizes="96x96" />
	<link rel="icon" type="image/png" href="../../public/favicon/favicon-32x32.png" sizes="32x32" />
	<link rel="icon" type="image/png" href="../../public/favicon/favicon-16x16.png" sizes="16x16" />
</head>
<body>
	<div id="vittoria" style="<?php echo $styleVittoria; ?>">
        <label id="msgHaiVinto"><center><b>HAI VINTO</b></center></label>
        <center>
			<a class="premiPerUscire" href="http://<?php echo $IP; ?>:3000/passaAPaginaPHP?pagina=webApp/menu/homeGioco.php"><b>Premi per rigiocare</b></a>
		</center>
    </div>

    <div id="sconfitta" style="<?php echo $styleSconfitta; ?>">
        <label id="msgHaiPerso"><center><b>HAI PERSO</b></center></label>
        <center>
			<a class="premiPerUscire" href="http://<?php echo $IP; ?>:3000/passaAPaginaPHP?pagina=webApp/menu/homeGioco.php"><b>Premi per rigiocare</b></a>
		</center>
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
    <title>EHI !!!</title>

	<!-- siamo in un file php quindi non "usa nodejs" e la cartella public per le risorse statiche,
	 quindi devo cambiare il percorso -->

    <link rel="stylesheet" href="../../public/res_static_menu/css/index.css">

    <link rel="icon" type="image/png" href="../../public/res_static_menu/images/favicon/favicon-196x196.png" sizes="196x196" />
    <link rel="icon" type="image/png" href="../../public/res_static_menu/images/favicon/favicon-128.png" sizes="128x128" />
    <link rel="icon" type="image/png" href="../../public/res_static_menu/images/favicon/favicon-96x96.png" sizes="96x96" />
    <link rel="icon" type="image/png" href="../../public/res_static_menu/images/favicon/favicon-32x32.png" sizes="32x32" />
    <link rel="icon" type="image/png" href="../../public/res_static_menu/images/favicon/favicon-16x16.png" sizes="16x16" />
</head>
<body>
    <center><h1>COME SEI ARRIVATO QUI !?!?!?!?!?!</h1></center>
</body>
</html>

<?php 
	}
?>
