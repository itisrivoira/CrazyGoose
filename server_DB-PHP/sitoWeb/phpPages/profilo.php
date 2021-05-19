<?php 
    require("../../phpFiles/GestoreDB.php");

    session_start();

    //Mi serve l'IP del server. Questo lo leggo solo nel nodejs all'inizio e non riesco a passarlo
	// a tutte le pagine... lo scrivo su un file e quando ne ho bisogno lo leggo
    $IP = file("../../indirizzo_server.txt")[0];
    $gestDB = new GestDB();
    
    if(isset($_SESSION["email"])){
		$flagAgg = false;
        if(isset($_GET["agg"]) ){
			$flagAgg = true;
			
			//così fa il logout dal profilo corrente (visto che ne aggiunge uno nuovo)
			if(isset($_SESSION["username"])){
				unset($_SESSION["username"]);
			}
		}else if(isset($_GET["logout"])){
			unset($_SESSION["username"]);
		}

        $profili = $gestDB->profiliUtente($_SESSION["email"]);
    
        $datiUtente = $gestDB->datiUtente($_SESSION["email"]);
        
        if(isset($_GET["scelta"])){
            $_SESSION["username"] = $profili[ $_GET["scelta"] ]["username"];
            $username = $_SESSION["username"];
        }else{
            if(isset($_SESSION["username"])){
                $username = $_SESSION["username"];
            }else{
                $username = null;
            }
        }
        
        if($username != null){
            $datiProfilo = $gestDB->datiProfilo($username);
            
            $grado = $datiProfilo["grado"];
			/* class="gradi" Rende "trasparente" i gradi NON ANCORA raggiunti
			<del> mette una barra sulla scritta (per i gradi SUPERATI)
			class="gradiNoTrasp" per il grado corrente */
            $elencoGradi = "";
            
            switch ($grado){
                case "Novellino":
                    $msgMotiv = "Roma non è stata costruita in un giorno...";
                    
                    $elencoGradi .= "<li class=\"gradiNoTrasp\">Novellino</li>";
                    $elencoGradi .= "<li class=\"gradi\">Principiante</li>";
                    $elencoGradi .= "<li class=\"gradi\">Intermedio</li>";
                    $elencoGradi .= "<li class=\"gradi\">Esperto</li>";
                    $elencoGradi .= "<li class=\"gradi\">Maestro</li>";
                    break;
                case "Principiante":
                    $msgMotiv = "Sei un diamante ancora grezzo";
                    
                    $elencoGradi .= "<liclass=\"gradiNoTrasp\"><del>Novellino</del></li>";
					$elencoGradi .= "<li class=\"gradiNoTrasp\">Principiante</li>";
					$elencoGradi .= "<li class=\"gradi\">Intermedio</li>";
					$elencoGradi .= "<li class=\"gradi\">Esperto</li>";
					$elencoGradi .= "<li class=\"gradi\">Maestro</li>";
                    break;
                case "Intermedio":
                    $msgMotiv = "Non si lascia il lavoro a met&agrave;";
                    
                    $elencoGradi .= "<li class=\"gradiNoTrasp\"><del>Novellino</del></li>";
					$elencoGradi .= "<li class=\"gradiNoTrasp\"><del>Principiante</del></li>";
					$elencoGradi .= "<li class=\"gradiNoTrasp\">Intermedio</li>";
					$elencoGradi .= "<li class=\"gradi\">Esperto</li>";
					$elencoGradi .= "<li class=\"gradi\">Maestro</li>";
                    break;
                case "Esperto":
                    $msgMotiv = "Sei quasi al top";
                    
                    $elencoGradi .= "<li class=\"gradiNoTrasp\"><del>Novellino</del></li>";
					$elencoGradi .= "<li class=\"gradiNoTrasp\"><del>Principiante</del></li>";
					$elencoGradi .= "<li class=\"gradiNoTrasp\"><del>Intermedio</del></li>";
					$elencoGradi .= "<li class=\"gradiNoTrasp\">Esperto</li>";
					$elencoGradi .= "<li class=\"gradi\">Maestro</li>";
                    break;
                case "Maestro":
                    $msgMotiv = "Lascia da parte la fortuna di qui in poi solo i migliori";
                    
                    $elencoGradi .= "<li class=\"gradiNoTrasp\"><del>Novellino</del></li>";
					$elencoGradi .= "<li class=\"gradiNoTrasp\"><del>Principiante</del></li>";
					$elencoGradi .= "<li class=\"gradiNoTrasp\"><del>Intermedio</del></li>";
					$elencoGradi .= "<li class=\"gradiNoTrasp\"><del>Esperto</del></li>";
					$elencoGradi .= "<li class=\"gradiNoTrasp\">Maestro</li>";
                    break;
                default:
                    break;
            }
            
            
            $partite = $gestDB->partiteProfilo($username);
            
            $partiteVinte = $datiProfilo["partiteVinte"];
            $partitePerse = $datiProfilo["partitePerse"];
	
			$elencoPartite = "";
            $cont = sizeof($partite);
            foreach($partite as $partita){
				if($partita["flagVittoria"] == 1){
					$vinto_perso = "<label style=\"color:greenyellow;\">VINTO</label>";
				}else{
					$vinto_perso = "<label style=\"color:red;\">PERSO</label>";
				}
				$min = $partita["durata"];
				$N = $partita["numMosse"];

				$elencoPartite .= "<li>Partita N.$cont: hai $vinto_perso. Nella partita, durata <b>".$min."min</b>, hai <b>tirato $N volte</b> il dado;</li>";
                $cont -= 1;
			}
        }else{
            $partite = null;
        }
        
?>

<!DOCTYPE html>

<head>
	<meta charset="UTF-8">
    <!-- MI SERVE XKE SE IL BROWSER MEMORIZZA IN CACHE DEI DATI DEL SITO
        SMETTE DI ENTRARE IN ALCUNI ENDPOINT-->
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Expires" content="0" />
    
    
	<title>Crazy Goose: Scegli il profilo</title>

	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">

	<!-- siamo in un file php quindi non "usa nodejs" e la cartella public per le risorse statiche,
	 quindi devo cambiare il percorso (in un file normale userei /res_static_menu/... perchè sa che
     una risorsa statica la deve prendere dalla cartella /public) -->

	<link rel="stylesheet" href="../../public/res_static_sitoweb/css/profilo.css">

	<!-- Per l'icona piccoliina nella scheda -->
	<link rel="icon" type="image/png" href="../../public/favicon/favicon-196x196.png" sizes="196x196" />
	<link rel="icon" type="image/png" href="../../public/favicon/favicon-128.png" sizes="128x128" />
	<link rel="icon" type="image/png" href="../../public/favicon/favicon-96x96.png" sizes="96x96" />
	<link rel="icon" type="image/png" href="../../public/favicon/favicon-32x32.png" sizes="32x32" />
	<link rel="icon" type="image/png" href="../../public/favicon/favicon-16x16.png" sizes="16x16" />

    <script>
        function profiloScelto(indice){
			location.replace("http://<?php echo $IP; ?>:80/progetti/CrazyGoose/server_DB-PHP/sitoWeb/phpPages/profilo.php?scelta="+indice)
        }
		function aggProfilo(){
			location.replace("http://<?php echo $IP; ?>:80/progetti/CrazyGoose/server_DB-PHP/sitoWeb/phpPages/profilo.php?agg=1")
        }
		function chiediConferma(profilo){
			let link = "http://<?php echo $IP; ?>:80/progetti/CrazyGoose/server_DB-PHP/phpFiles/eliminaProfilo.php?username="+profilo;

			//alert con scelta 'annulla' o 'OK'
			if(confirm("Sicuro di voler eliminare il profilo\n==>   "+profilo+"   <== ?")){
				location.replace(link)
			}
		}
		function controllaUsername(){
			/* AL TENTATIVO DI INVIO DEI DATI ("onSubmit" nel tag "form")
            Prendo il form che nella pagina ha quel "name" "formReg", all'itnerno del
             quale ci sono delle componenti con un certo "name" ("email", "password").
             Ne controllo il valore, cioè quello che contengono. Se non contengono nulla sposto
             il focus su una di loro (scriverà con la tastiera all'interno della componente vuota senza doverci 
             cliccare lui) */

			if(document.formUsername.username.value == ""){
				document.formUsername.username.focus()
				alert("Inserisci l'username !!!")
				return false
			} else {
                var x = document.formReg.username.value
                document.formReg.username.value = x.trim()
            }
			return true
		}

		function focusIniziale(){
			<?php 
				if($username == null && $flagAgg){
			?>
			document.formUsername.username.focus()
			<?php } ?>
		}

    </script>
</head>
<body style="padding:2px;" onload="focusIniziale()">
	<div class="container-fluid">
		<div class="row" id="rowIntestazione">
			<div class="col-12">
				<nav class="navbar navbar-expand-lg navbar-light bg-light" style="border-radius:10px; border:3px solid rgba(46, 11, 99, 0.932);">
					<a class="navbar-brand" id="infoQualeUtente" href="#"></a>
					<div class="collapse navbar-collapse" id="navbarNavDropdown">
						<ul class="navbar-nav">
							<li class="nav-item dropdown">
								<a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
								MENU UTENTE
								</a>
								<div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
									<a class="dropdown-item" href="http://<?php echo $IP ?>:3000/">Home</a>
									<?php if($username != null){ ?>
									<a class="dropdown-item" id="linkVaiAlGioco" href="http://<?php echo $IP ?>:3000/CrazyGoose">Vai al gioco</a>
									<a class="dropdown-item" id="voceLogout" href="http://<?php echo $IP ?>:3000/esciDalProfilo"></a>
									<?php } ?>
									<a class="dropdown-item" href="http://<?php echo $IP ?>:3000/logoutUtente">Esci</a>
								</div>
							</li>
						</ul>
					</div>
				</nav>
			</div>
		</div>
		
		<?php if($username == null && $flagAgg == false){ ?>
		<div class="row" class="intestazionePagina" id="noProfiloScelto">
            <div class="col">
                <center>
                    <div id="divNonHaAccesso">ACCEDI AD UNO DEI TUOI PROFILI O CREANE UNO NUOVO.<br>Puoi creare fino a 3 profili</div>
                </center>
            </div>
        </div>
		<?php } ?>
		
		<?php if($username == null && $flagAgg == true){ ?>
		<div class="col-12">
			<center>
				<div style="padding:5px; border: 0.3em solid black; width: -moz-fit-content;">
					<!-- NON HO MODO DI PASSARE CAMPI IN POST DA NODEJS A PAGINA PHP QUINDI VADO DIRETTAMENTE ALLA PAGINA PHP -->
					<form action="http://<?php echo $IP ?>:80/progetti/CrazyGoose/server_DB-PHP/phpFiles/aggProfilo.php" method="post" name="formUsername" onsubmit="return(controllaUsername())">
						<h3>Scegli un username <u>univoco</u>:</h3><br>
						<input type="text" name="username" placeholder="es. giovannirossi01"><br><br>
						<button type="submit" id="btnSubmit">CREA PROFILO</button>
					</form>
					<?php if(isset($_GET["err"])){ ?>
						<br><label id="msgErroreUsername">USERNAME GI&Agrave; IN USO !</label>
					<?php } ?>
				</div>
			</center>
		</div>
		<?php } ?>
		
		<div id="contenitoreRiga2">
            <div class="row" id="rowSceltaProfilo">
                <div class="col-4 ">
                        <div class="divBtnScegliProfilo">
                            <?php if(isset($profili[0])){ ?>
                            <div id="mostra0">
                                <img onclick="chiediConferma('<?php echo $profili[0]["username"];?>')" class="imgCestino" src="/res_static_sitoweb/images/cestino.png">
                                <button onclick="profiloScelto('0')" class="btnScegliProfilo">Profilo N.1<br><i><b><?php echo $profili[0]["username"];?></i></b></button>
                            </div>
                            <?php }else{ ?>
                            <button id="btnScegli0" onclick="aggProfilo()" class="btnScegliProfilo">AGGIUNGI<br>PROFILO N.1 <h3>➕</h3></button>
                            <?php } ?>
                        </div>
                </div>
                <div class="col-4">
                    <center>
                        <div class="divBtnScegliProfilo">
                            <div id="mostra1">
                                <img onclick="chiediConferma('__USERNAME1__')" class="imgCestino" src="/res_static_sitoweb/images/cestino.png">
                                <button onclick="profiloScelto('__USERNAME1__')" class="btnScegliProfilo">Profilo N.2<br><i><b>__USERNAME1__</i></b></button>
                            </div>

                            <button id="btnScegli1" onclick="aggProfilo()" class="btnScegliProfilo">AGGIUNGI<br>PROFILO N.2<h3>➕</h3></button>
                        </div>
                    </center>
                </div>
                <div class="col-4">
                    <center>
                        <div class="divBtnScegliProfilo3">
                            <div id="mostra2">
                                <img onclick="chiediConferma('__USERNAME2__')" class="imgCestino" src="/res_static_sitoweb/images/cestino.png">
                                <button onclick="profiloScelto('__USERNAME2__')" class="btnScegliProfilo">Profilo N.3<br><i><b>__USERNAME2__</i></b></button>
                            </div>

                            <button id="btnScegli2" onclick="aggProfilo()" class="btnScegliProfilo">AGGIUNGI<br>PROFILO N.3<h3>➕</h3></button>
                        </div>
                    </center>
                </div>
            </div>
        </div>
		
		
		<div class="row" id="rowSceltaProfilo">
			<div class="col-4">
				<center>
					<div class="divBtnScegliProfilo">
						<?php
							if(isset($profili[0])){
						?>
						<img onclick="chiediConferma('<?php echo $profili[0]["username"];?>')" class="imgCestino" src="../../public/res_static_sitoweb/images/cestino.png">
						<button onclick="profiloScelto(0)" class="btnScegliProfilo">Profilo N.1<br><i><b><?php echo $profili[0]["username"]; ?></i></b></button>
						<?php }else{ ?>
							<button onclick="aggProfilo()" class="btnScegliProfilo">AGGIUNGI<br>PROFILO N.1 <h3>➕</h3></button>
						<?php } ?>
					</div>
				</center>
			</div>
			<div class="col-4">
				<center>
					<div class="divBtnScegliProfilo">
						<?php
							if(isset($profili[1])){
						?>
						<img onclick="chiediConferma('<?php echo $profili[1]["username"];?>')" class="imgCestino" src="../../public/res_static_sitoweb/images/cestino.png">
						<button onclick="profiloScelto(1)" class="btnScegliProfilo">Profilo N.2<br><i><b><?php echo $profili[1]["username"]; ?></i></b></button>
						<?php }else{ ?>
							<button onclick="aggProfilo()" class="btnScegliProfilo">AGGIUNGI<br>PROFILO N.2<h3>➕</h3></button>
						<?php } ?>
					</div>
				</center>
			</div>
			<div class="col-4">
			<center>
					<div class="divBtnScegliProfilo">
						<?php
							if(isset($profili[2])){
						?>
						<img onclick="chiediConferma('<?php echo $profili[2]["username"];?>')" class="imgCestino" src="../../public/res_static_sitoweb/images/cestino.png">
						<button onclick="profiloScelto(2)" class="btnScegliProfilo">Profilo N.3<br><i><b><?php echo $profili[2]["username"]; ?></i></b></button>
						<?php }else{ ?>
							<button onclick="aggProfilo()" class="btnScegliProfilo">AGGIUNGI<br>PROFILO N.3<h3>➕</h3></button>
						<?php } ?>
					</div>
				</center>
			</div>
		</div>
		<?php if($username != null){?>
		<div class="row" id="rowStatisitche">
			<div class="col-12">
				<center>
					<div id="infoStatistUsername"><h4>Statistiche del profilo <i><b style="color:red;"><?php echo $username; ?></b></i></h4></div>
				</center>
			</div>
		</div>
		<div class="row" id="rowStatistiche1">
			<div class="col-lg-6 col-12">
				<div id="totPartite">In totale hai giocato <?php echo ($partiteVinte+$partitePerse); ?> partite</div>
				<?php if($partiteVinte+$partitePerse > 0){ ?>
				<div class="numPartite">&#8614; di cui ne hai vinte <?php echo $partiteVinte; ?> </div>
				<div class="numPartite">&#8627; e ne hai perse <?php echo $partitePerse; ?></div>
				<?php }else{ ?>
					<br><br>
				<?php } ?>
				<div id="grado">
					<div id="intestazioneGrado">Sei di grado:</div>
					<div id="divElencoGradi">
						<ul><?php echo $elencoGradi; ?></ul>
					</div>
				</div>
				<div id="msgMotivazionale">
					<?php echo $msgMotiv; ?>
				</div><br>
			</div>
			<div class="col-lg-6 col-12" id="colonnaElencoPartite">
				<div id="intestazionePartite">Cronologia partite:</div>
				<div id="divElencoPartite">
					<?php if(!empty($partite)){ ?>
					<ul><?php echo $elencoPartite; ?></ul>
					<?php
						}else{
							?>
							<label>Non hai ancora giocato nessuna partita... Forza 
								<a href="http://<?php echo $IP;?>:3000/passaAPaginaPHP?pagina=webApp/menu/homeGioco.php">vai a divertirti</a>
						</label>
							<?php
						} ?>
				</div>
			</div>
		</div>
		<?php }else{
				if(!$flagAgg){ ?>
		
		<?php 	}
			}?>
	</div>

    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>
</body>
</html>
    <?php } ?>
