<?php
	//Nel file c'è solo una riga, solo l'IP. Quindi prendo il primo elemento dell'array
    // che mi restituisce la funzione file()
    $IP = file("../../indirizzo_server.txt")[0];
	
	session_start();
	if( isset($_SESSION["ID"]) && isset($_SESSION["vitt"]) ){
?>

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>
		<?php
			if($_SESSION["vitt"] == "true"){
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
	<center style="font-size: 22px;">
		<?php
			$min = explode("_", $_SESSION["durata"])[0];
			$sec = explode("_", $_SESSION["durata"])[1];
			$numMosse = $_SESSION["numMosse"];

			echo "CI HAI MESSO $min min e $sec sec, tirando $numMosse volte il dado.";
		?>
	</center>
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