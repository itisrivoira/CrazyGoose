<?php
	require("../../phpFiles/GestoreDB.php");

    session_start();

	//Mi serve l'IP del server. Questo lo leggo solo nel nodejs all'inizio e non riesco a passarlo
	// a tutte le pagine... lo scrivo su un file e quando ne ho bisogno lo leggo
    $IP = file("../../indirizzo_server.txt")[0];
	
    $gestDB = new GestDB();
    
        //ricontrollo che nelle variabili di sessione ci siano i dati corretti (ulteriore sicurezza)
	if( isset($_SESSION["email"]) && $gestDB->accedi($_SESSION["email"], $_SESSION["passw"]) && isset($_SESSION["username"]) && isset($_SESSION["durata"]) &&
		isset($_SESSION["numMosse"]) && isset($_SESSION["vitt"]) ){

        $username = $_SESSION["username"];
        $durata = $_SESSION["durata"];
        $numMosse = $_SESSION["numMosse"];
        $vitt = $_SESSION["vitt"];
        
        if($gestDB->aggiungiPartita($username, $durata, $numMosse, $vitt)){
            //ora non mi servono più queste variabili, inoltre distruggendole evito
            // che se l'utente ricarica la pagina, venga caricatp un nuovo record
            //  di Partecipare e Partite
									
            unset($_SESSION["durata"]);
            unset($_SESSION["numMosse"]);
            unset($_SESSION["vitt"]);
        }
?>

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
    
	<title>
		<?php
			if($vitt == true){
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
			<a class="premiPerUscire" href="http://<?php echo $IP; ?>:3000/CrazyGoose"><b>Premi per rigiocare</b></a>
		</center>
    </div>

    <div id="sconfitta" style="<?php echo $styleSconfitta; ?>">
        <label id="msgHaiPerso"><center><b>HAI PERSO</b></center></label>
        <center>
			<a class="premiPerUscire" href="http://<?php echo $IP; ?>:3000/CrazyGoose"><b>Premi per rigiocare</b></a>
		</center>
    </div>
	<br><br>
</body>
</html>

<?php 
	}else{
        header("Location: http://$IP:3000/");
    }
?>
