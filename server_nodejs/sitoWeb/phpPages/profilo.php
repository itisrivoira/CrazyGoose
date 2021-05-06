<?php 
    session_start();

    //Mi serve l'IP del server. Questo lo leggo solo nel nodejs all'inizio e non riesco a passarlo
	// a tutte le pagine... lo scrivo su un file e quando ne ho bisogno lo leggo
    $IP = file("../../indirizzo_server.txt")[0];
    $nome = null;
    $cognome = null;
	$username = null;
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
								
								//(dalla più recente)
								$queryResult = $mysqli->query("SELECT ID_part, durata, flagVittoria, numMosse FROM Partecipare, Partite WHERE(username = '$username' AND ID_partita = ID_part) ORDER BY ID_part DESC;");

								if(!$queryResult){
									echo "ERRORE SELECT dati partite/partecipare: ".$mysqli->error." (".$mysqli->errno.")";
								}else{
									//la query non mi ritorna 1 solo record... non posso prendere il risultato in 
									// semplice array associativo (con "fetch_assoc()")
									$partite = $queryResult->fetch_all(MYSQLI_ASSOC);
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
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
	<link rel="stylesheet" href="../../public/res_static_sitoweb/css/profilo.css">

	<title>Scegli il profilo</title>

    <script>
        function profiloScelto(indice){
			location.replace("http://<?php echo $IP; ?>:80/progetti/CrazyGoose/server_nodejs/sitoWeb/phpPages/profilo.php?scelta="+indice)
        }
    </script>
</head>
<body>
	<div class="container-fluid">
		<div class="row" id="rowIntestazione">
			<div class="col-9">
				<center><div id="infoQualeUtente">Profili di <b><i><?php echo $nome." ".$cognome; ?></i></b></div></center>
			</div>
			<div class="col-3">
				<div id="menuUtente" style="padding:0px;">
					<div id="divDropdown">
						<button id="dropdownBtn">- - - MENU UTENTE - - -</button>
						<div id="dropdown-menu">
							<a href="">Home</a>
							<?php if($username != null){ ?>
								<a href="http://<?php echo $IP; ?>:3000/passaAPaginaPHP?pagina=webApp/menu/homeGioco">Vai al gioco</a>
								<a href="http://<?php echo $IP; ?>:80/progetti/CrazyGoose/server_nodejs/sitoWeb/phpPages/profilo.php">Logout da <i><b><?php echo $username; ?></i></b></a>
							<?php } ?>
							<a href="http://<?php echo $IP; ?>:3000/esci">Esci</a>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="row" id="rowSceltaProfilo">
			<div class="col-4">
				<center>
					<div class="divScegliProfilo">
						<?php
							if(isset($profili[0])){
						?>
						<button onclick="profiloScelto(0)" class="btnScegliProfilo">Profilo N.1<br><i><b><?php echo $profili[0]; ?></i></b></button>
						<?php }else{ ?>
							<button><a href="http://<?php echo $IP;?>:80/progetti/CrazyGoose/server_nodejs/sitoWeb/phpPages/formAggProfilo.php">AGGIUNGI<br>PROFILO N.1 <h3>➕</h3> </a></button>
						<?php } ?>
					</div>
				</center>
			</div>
			<div class="col-4">
				<center>
					<div class="divScegliProfilo">
						<?php
							if(isset($profili[1])){
						?>
						<button onclick="profiloScelto(1)" class="btnScegliProfilo">Profilo N.2<br><i><b><?php echo $profili[1]; ?></i></b></button>
						<?php }else{ ?>
							<button><a href="http://<?php echo $IP;?>:80/progetti/CrazyGoose/server_nodejs/sitoWeb/phpPages/formAggProfilo.php">AGGIUNGI<br>PROFILO N.2 <h3>➕</h3> </a></button>
						<?php } ?>
					</div>
				</center>
			</div>
			<div class="col-4">
			<center>
					<div class="divScegliProfilo">
						<?php
							if(isset($profili[2])){
						?>
						<button onclick="profiloScelto(2)" class="btnScegliProfilo">Profilo N.3<br><i><b><?php echo $profili[2]; ?></i></b></button>
						<?php }else{ ?>
							<button><a href="http://<?php echo $IP;?>:80/progetti/CrazyGoose/server_nodejs/sitoWeb/phpPages/formAggProfilo.php">AGGIUNGI<br>PROFILO N.3 <h3>➕</h3> </a></button>
						<?php } ?>
					</div>
				</center>
			</div>
		</div>
		<?php if($username != null){ ?>
		<div class="row" id="rowStatisitche">
			<div class="col-12">
				<center>
					<div id="infoStatistUsername"><h4>Statistiche del profilo <i><b><?php echo $username; ?></b></i></h4></div>
				</center>
			</div>
		</div>
		<div class="row" id="rowStatistiche1">
			<div class="col-12 col-md-6">
				<div id="totPartite">In totale hai giocato <?php echo ($partiteVinte+$partitePerse); ?> partite</div>
				<div class="numPartite">&#8614; di cui ne hai vinte <?php echo $partiteVinte; ?> </div>
				<div class="numPartite">&#8627; e ne hai perse <?php echo $partitePerse; ?></div>
				<div id="grado">
					<div id="intestazioneGrado">Sei di grado:</div>
					<div id="divElencoGradi">
						<ul>
							<!--TODO rifare meglio  -->
							<?php
								switch($grado){
									case "Novellino":
										echo "<li class=\"gradiNoTrasp\">Novellino</li>";
										echo "<li class=\"gradi\">Principiante</li>";
										echo "<li class=\"gradi\">Intermedio</li>";
										echo "<li class=\"gradi\">Esperto</li>";
										echo "<li class=\"gradi\">Maestro</li>";
										break;
									case "Principante":
										echo "<liclass=\"gradiNoTrasp\"><del>Novellino</del></li>";
										echo "<li class=\"gradiNoTrasp\">Principiante</li>";
										echo "<li class=\"gradi\">Intermedio</li>";
										echo "<li class=\"gradi\">Esperto</li>";
										echo "<li class=\"gradi\">Maestro</li>";
										break;
									case "Intermedio":
										echo "<li class=\"gradiNoTrasp\"><del>Novellino</del></li>";
										echo "<li class=\"gradiNoTrasp\"><del>Principiante</del></li>";
										echo "<li class=\"gradiNoTrasp\">Intermedio</li>";
										echo "<li class=\"gradi\">Esperto</li>";
										echo "<li class=\"gradi\">Maestro</li>";
										break;
									case "Esperto":
										echo "<li class=\"gradiNoTrasp\"><del>Novellino</del></li>";
										echo "<li class=\"gradiNoTrasp\"><del>Principiante</del></li>";
										echo "<li class=\"gradiNoTrasp\"><del>Intermedio</del></li>";
										echo "<li class=\"gradiNoTrasp\">Esperto</li>";
										echo "<li class=\"gradi\">Maestro</li>";
										break;
									case "Maestro":
										echo "<li class=\"gradiNoTrasp\"><del>Novellino</del></li>";
										echo "<li class=\"gradiNoTrasp\"><del>Principiante</del></li>";
										echo "<li class=\"gradiNoTrasp\"><del>Intermedio</del></li>";
										echo "<li class=\"gradiNoTrasp\"><del>Esperto</del></li>";
										echo "<li class=\"gradiNoTrasp\">Maestro</li>";
										break;
									default:
										break;
								}
								?>
						</ul>
					</div>
				</div>
				<div id="msgMotivazionale">
					<?php echo "Qui ci sar&agrave; un msg motivazionale"; ?>
				</div><br>
			</div>
			<div class="col-12 col-md-6" id="colonnaElencoPartite">
				<div id="intestazionePartite">Cronologia partite:</div>
				<div id="divElencoPartite">
					<?php if(!empty($partite)){ ?>
					<ul>
						<?php
							foreach($partite as $partite){
								$ID_part = $partite["ID_part"];
								if($partite["flagVittoria"] == 1){
									$vinto_perso = "<label style=\"color:greenyellow;\">VINTO</label>";
								}else{
									$vinto_perso = "<label style=\"color:red;\">PERSO</label>";
								}
								$min = $partite["durata"];
								$N = $partite["numMosse"];
			
								echo "<li>Partita N.$ID_part: hai $vinto_perso. Nella partita, durata <b>".$min."min</b>, hai <b>tirato $N volte</b> il dado;</li>";
							}
						?>
					</ul>
					<?php
						}else{
							echo "Non hai ancora giocato nessuna partita... Forza <a href=\"http://<?php echo $IP; ?>:3000/passaAPaginaPHP?pagina=webApp/menu/homeGioco\">vai a divertirti</a>";
						} ?>
				</div>
			</div>
		</div>
		<?php }else{ ?>
		<div class="row" class="intestazionePagina">
			<div class="col">
				<center>
					<div id="divNonHaAccesso">ACCEDI AD UNO DEI TUOI PROFILI O CREANE UNO NUOVO.<br>Puoi creare fino a 3 profili</div>
				</center>
			</div>
		</div>
		<?php } ?>
	</div>


	<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>
</body>
</html>
