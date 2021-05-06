<?php 
    session_start();

    //Mi serve l'IP del server. Questo lo leggo solo nel nodejs all'inizio e non riesco a passarlo
	// a tutte le pagine... lo scrivo su un file e quando ne ho bisogno lo leggo
    $IP = file("../../indirizzo_server.txt")[0];
    $nome = null;
    $cognome = null;
	$username = null;
	$styleStatistiche = "display: none";
	$stylePartite = "display: none";
	$profili = array();
	$partite = array();


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
                    
                    $queryResults = $mysqli->query("SELECT Profili.* FROM Utenti, Profili WHERE(ID_gioc = '$ID' AND ID_gioc = ID_giocatore);");
				    if(!$queryResults){
				        echo "ERRORE SELECT Profili: ".$mysqli->error." (".$mysqli->errno.")";
				    }else{
				        $ris_arr_assoc = $queryResults->fetch_all(MYSQLI_ASSOC);

				        //echo "<pre>";
				        //print_r($ris_arr_assoc);
				        //echo "</pre>";

						foreach($ris_arr_assoc as $utente){
							array_push($profili, $utente["username"]);
						}
						
						if(isset($_GET["scelta"])){
							$username = $profili[ $_GET["scelta"] ];
							$_SESSION["username"] = $username;

							$queryResult = $mysqli->query("SELECT * FROM Profili WHERE username = '$username';");
							if(!$queryResult){
								echo "ERRORE SELECT dati profilo: ".$mysqli->error." (".$mysqli->errno.")";
							}else{
								$ris_arr_assoc = $queryResult->fetch_assoc();
								
								$grado = $ris_arr_assoc["grado"];
								$partiteVinte = $ris_arr_assoc["partiteVinte"];
								$partitePerse = $ris_arr_assoc["partitePerse"];
								
								$styleStatistiche = "display: block";

								//(dalla più recente)
								$queryResult = $mysqli->query("SELECT ID_part, durata, flagVittoria, numMosse FROM Partecipare, Partite WHERE(username = '$username' AND ID_partita = ID_part) ORDER BY ID_part DESC;");

								if(!$queryResult){
									echo "ERRORE SELECT dati partite/partecipare: ".$mysqli->error." (".$mysqli->errno.")";
								}else{
									//la query non mi ritorna 1 solo record... non posso prendere il risultato in 
									// semplice array associativo (con "fetch_assoc()")
									$partite = $queryResult->fetch_all(MYSQLI_ASSOC);
									$stylePartite = "display: block";
								}
							}
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
	<title>Scegli il profilo</title>

    <script>
        function profiloScelto(indice){
			location.replace("http://<?php echo $IP; ?>:80/progetti/CrazyGoose/server_nodejs/sitoWeb/phpPages/profilo.php?scelta="+indice)
        }
    </script>
</head>
<body>
	<center><h1>PROFILI DI <?php echo $nome." ".$cognome; ?></h1></center>
	<center>
		<div>
            <?php
                if(isset($profili[0])){
            ?>
            <button onclick="profiloScelto(0)">Accedi con <?php echo $profili[0]; ?></button>
            <?php }else{ ?>
                <a href="http://<?php echo $IP;?>:80/progetti/CrazyGoose/server_nodejs/sitoWeb/phpPages/formAggProfilo.php">AGGIUNGI<br>PROFILO 1</a>
            <?php } ?>
        </div><br>
		<div>
			<?php
                if(isset($profili[1])){
            ?>
            <button onclick="profiloScelto(1)">Accedi con <?php echo $profili[1]; ?></button>
            <?php }else{ ?>
                <a href="http://<?php echo $IP;?>:80/progetti/CrazyGoose/server_nodejs/sitoWeb/phpPages/formAggProfilo.php">AGGIUNGI<br>PROFILO 2</a>
            <?php } ?>
		</div><br>
		<div>
			<?php
                if(isset($profili[2])){
            ?>
            <button onclick="profiloScelto(2)">Accedi con <?php echo $profili[2]; ?></button>
            <?php }else{ ?>
                <a href="http://<?php echo $IP;?>:80/progetti/CrazyGoose/server_nodejs/sitoWeb/phpPages/formAggProfilo.php">AGGIUNGI<br>PROFILO 3</a>
            <?php } ?>
		</div><br><br>
		
		<div style="<?php echo $styleStatistiche; ?>;">
			<div> <?php echo "HAI VINTO $partiteVinte"; ?> </div>
			<div> <?php echo "HAI PERSE $partitePerse"; ?> </div>
			<div> <?php echo "Il tuo grado e' $grado"; ?> </div>
		</div>
		
		<div style="<?php echo $stylePartite; ?>;">
			<?php
				if(!empty($partite)){
					foreach($partite as $partite){
						$ID_part = $partite["ID_part"];
						if($partite["flagVittoria"] == 1){
							$vinto_perso = "VINTO";
						}else{
							$vinto_perso = "PERSO";
						}
						$min = $partite["durata"];
						$N = $partite["numMosse"];
	
						echo "<label>Partita N.$ID_part: hai $vinto_perso. Nella partita di ".$min."min hai tirato $N volte il dado</label><br>";
					}
				}else{
					echo "Non hai ancora giocato nessuna partita";
				}
			?>
		</div>
		
	</center>
</body>
</html>
