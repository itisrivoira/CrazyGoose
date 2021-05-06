<?php 
    session_start();

    //Mi serve l'IP del server. Questo lo leggo solo nel nodejs all'inizio e non riesco a passarlo
	// a tutte le pagine... lo scrivo su un file e quando ne ho bisogno lo leggo
    $IP = file("../../indirizzo_server.txt")[0];
    $nome = null;
    $cognome = null;

    if(isset($_SESSION["ID"])){
        //Tento di connettermi al DB CrazyGoose (di certo ci sarà xke si è loggato)
        $mysqli = new mysqli("localhost", "root", "", "CrazyGoose");
        if($mysqli->connect_error){
            die("Errore:".$mysqli->connect_errno." per ".$mysqli->connect_error);
        }else{
            $ID = $_SESSION["ID"];
            $queryResults = $mysqli->query("SELECT * FROM Utenti WHERE(ID_gioc = '$ID');");
            if(!$queryResults){
                echo "ERRORE SELECT di quel Utente: ".$mysqli->error." (".$mysqli->errno.")";
            }else{
                $ris_arr_assoc = $queryResults->fetch_assoc();

                if(!empty($ris_arr_assoc)){
                    $nome = $ris_arr_assoc["nome"];
                    $cognome = $ris_arr_assoc["cognome"];
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
	
	<title>Aggiungi profilo</title>
</head>
<body>
	<center>
	<form action="http://<?php echo $IP;?>:80/progetti/CrazyGoose/server_nodejs/sitoWeb/phpFiles/aggProfilo.php" method="post">
		<label><?php echo $nome." ".$cognome ?> scegli un username univoco</label><br>
		<input type="text" name="username" placeholder="es. giovannirossi01"><br><br>
		<input type="submit" value="SALVA">
	</form>
	</center>
</body>
</html>
