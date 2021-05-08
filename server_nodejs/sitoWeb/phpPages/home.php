<?php 
    session_start();

    //Mi serve l'IP del server. Questo lo leggo solo nel nodejs all'inizio e non riesco a passarlo
	// a tutte le pagine... lo scrivo su un file e quando ne ho bisogno lo leggo
    $IP = file("../../indirizzo_server.txt")[0];
    $nome = null;
    $cognome = null;
    $username = null;

    if(isset($_SESSION["ID"])){
        //Tento di connettermi al DB CrazyGoose (di certo ci sarà xke si è loggato)
        $mysqli = new mysqli("localhost", "root", "", "CrazyGoose");
        if($mysqli->connect_error){
            die("Errore:".$mysqli->connect_errno." per ".$mysqli->connect_error);
        }else{
            $ID = $_SESSION["ID"];
            $queryResults = $mysqli->query("SELECT * FROM Utenti WHERE ID_gioc = '$ID';");
            if(!$queryResults){
                echo "ERRORE SELECT di quel Utente: ".$mysqli->error." (".$mysqli->errno.")";
            }else{
                $ris_arr_assoc = $queryResults->fetch_assoc();
    
                //echo "<pre>";
                //print_r($ris_arr_assoc);
                //echo "</pre>";
                
                if(!empty($ris_arr_assoc)){
                    $nome = $ris_arr_assoc["nome"];
                    $cognome = $ris_arr_assoc["cognome"];
                }
            }
            
            if(isset($_SESSION["username"])){
            	$username = $_SESSION["username"];
            }
        }
    }
    
    $classDelMenuUtente = "";
    $styleDelMenuUtente = "";
    $msgDelMenuUtente = "";
    if($nome != null){
        $classDellaTestata = "class = \"col-10 d-flex justify-content-center\"";
        $classDelMenuUtente = "class = \"col-2\"";
        $styleDelMenuUtente = "display: inline-block;";
        $msgDelMenuUtente = "Benvenuto<br><i><b>$nome $cognome</b></i>";
        if($username != null){
        	$msgDelMenuUtente = "Benvenuto<br><i><b>$nome $cognome</b></i><br>Con profilo:<br><i><b>$username</b></i>"; 
        }
    }else{
        $classDellaTestata = "class = \"col-12 d-flex justify-content-center\"";
    }

?>

<!DOCTYPE html>
<html>

<head>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">

    <!--css aggiuntivo contente le varie icone-->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

	<!-- siamo in un file php quindi non "usa nodejs" e la cartella public per le risorse statiche,
	 quindi devo cambiare il percorso -->
    <link rel="stylesheet" href="../../public/res_static_sitoweb/css/home.css">
    <link rel="stylesheet" href="../../public/res_static_sitoweb/css/navbar.css">
    <link rel="stylesheet" href="../../public/res_static_sitoweb/css/soloFooter.css">
    <meta charset="UTF-8">

    <title>Crazy Goose: Home</title>

</head>

<body style="background-color:rgba(92, 58, 142, 0.87);">
    <div class="container-fluid">
        <div class="row">
            <div id="testataSito" <?php echo $classDellaTestata; ?> >
                <img src="../../public/res_static_sitoweb/images/logo_130x130.png">
                <img src="../../public/res_static_sitoweb/images/scrittaCrazyGoose_400x130_noBagliore.png">
            </div>
            <div id="menuUtente" style="padding:0px;" <?php echo $classDelMenuUtente; ?> >
                <div id="divDropdown" style="<?php echo $styleDelMenuUtente; ?>">
                    <button id="dropdownBtn"><?php echo $msgDelMenuUtente; ?></button>
                    <div id="dropdown-menu">
                        <a href="http://<?php echo $IP; ?>:3000/profilo">Profilo</a>
                        <?php if($username != null){ ?>
                        <a href="http://<?php echo $IP; ?>:3000/passaAPaginaPHP?pagina=webApp/menu/homeGioco">Vai al gioco</a>
                        <?php } ?>
                        <a href="http://<?php echo $IP; ?>:3000/download">Download<br>gioco</a>
                        <a href="http://<?php echo $IP; ?>:3000/esci">Esci</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <div id="carouselIndicators" class="carousel slide" data-ride="carousel">
                    <!--<ol class="carousel-indicators">
                        <li data-target="#carouselIndicators" data-slide-to="0" class="active"></li>
                        <li data-target="#carouselIndicators" data-slide-to="1"></li>
                        <li data-target="#carouselIndicators" data-slide-to="2"></li>
                    </ol>-->
                    <div class="carousel-inner" role="listbox">
                        <div class="carousel-item active">
                            <img src="../../public/res_static_sitoweb/images/gioco.png" class="img-fluid" id="imgSchedaCrazyGoose">
                            <div class="carousel-caption" id="divSchedaCarosello">
                                <p class="titoloSchedaCarousel">CRAZY GOOSE</p>
                                <p class="testoCarousel">Il gioco dell'oca che non c'era!</p>
                            </div>
                        </div>
                        <div class="carousel-item">
                            <img src="../../public/res_static_sitoweb/images/regolamento.jpg" class="img-fluid" id="imgSchedaRegolamento">
                            <div class="carousel-caption" id="divSchedaCarosello">
                                <a href="http://<?php echo $IP; ?>:3000/regole" class="titoloSchedaCarousel">
                                    <p><u>REGOLAMENTO</u></p>
                                </a>
                                <p class="testoCarousel">Queste sono le regole del nostro gioco, qui potrai scoprire quanti 'passi' dovrai fare per vincere, quali e quante sono le caselle speciali, quante volte un'abilità potrà essere attivata e....se hai delle domande passa</p>
                            </div>
                        </div>
                        <div class="carousel-item">
                            <img src="../../public/res_static_sitoweb/images/email.png" class="img-fluid" id="imgSchedaContattaci">
                            <div class="carousel-caption" id="divSchedaCarosello">
                                <a href="http://<?php echo $IP; ?>:3000/contattaci" class="titoloSchedaCarousel">
                                    <p><u>CONTATTACI</u></p>
                                </a>
                                <p class="testoCarousel">Se hai ancora domande oppure vuoi semplicemente metterti in contatto con i diretti creatori Contattaci!</p>
                            </div>
                        </div>
                    </div>
                    <a class="carousel-control-prev" href="#carouselIndicators" role="button" data-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    </a>
                    <a class="carousel-control-next" href="#carouselIndicators" role="button" data-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    </a>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col d-flex justify-content-center">
                <p class="introduz_giocoERegole"><i>Benvenuto su Crazy Goose il sito che ti permetterà di giocare al gioco dell'oca in modo mai visto fino ad ora!!<br>Crazy Goose si basa dalla voglia di innovare un gioco tradizionale quanto mai eterno come quello del gioco dell'oca infatti ci sarà una piccola novità che scopriremo succesivamente :</i>
                </p>
            </div>
        </div>
        <div class="row" id="rowAccediRegistrati">
            <div class="col">
                <div>
                    <h4><b class="classTestoNero">Hai già un account? Accedi, se no... Registrati</b></h4>
                </div>
                <p class="classTestoNero">
                    Se non hai ancora un account Crazy Goose <br>clicca sul tasto Registrati basteranno pochi secondi per iniziar far parte del nostro branco e divertirti giocando al gioco dell'oca !
                </p>
                <div>
                    <a href="http://<?php echo $IP; ?>:80/progetti/CrazyGoose/server_nodejs/sitoWeb/phpFiles/creazioneDB.php?prox=accedi" class="btnIn"><b>ACCEDI</b></a>
                    <br><br>
                    <a href="http://<?php echo $IP; ?>:80/progetti/CrazyGoose/server_nodejs/sitoWeb/phpFiles/creazioneDB.php?prox=registrati" class="btnIn"><b>REGISTRATI</b></a>
                </div>
            </div>
        </div>
        <br>
        <div class="row">
            <div class="col d-flex justify-content-center">
                <p class="introduz_giocoERegole"><i>Ti sei Registrato ??? Bene. Ora è il tempo di presentare la nostra grande novità: Le Abilità.<br>Le abilità sarà il grande punto di forza che avrai durante la partita, ebbene si infatti infatti in un dato momento, uno e uno solo, della partita potrai usare a seconda della pedina scelta all'inizio un potere speciale: </i>
                </p>
            </div>
        </div>
        <div class="row">
            <div class="col d-flex justify-content-center">
                <h2><b>LE ABILITÀ: </b></h2>
            </div>
        </div>
        <br><br>
        <div class="row">
            <div class="colContainerFlipCard col-lg-3 col-md-6 col-sm-12 d-flex justify-content-center">
                <div class="flip-card">
                    <div class="flip-card-inner">
                        <div class="cardFrontOcaVerde flip-card-front d-flex align-items-center justify-content-center"></div>
                        <div class="cardBackOcaVerde flip-card-back">
                            <p>Con l'abilit&agrave; dell'<b>oca verde</b> si potr&agrave; <b>tirare di nuovo</b> il dado. In modo da spiazzare l'avversario e andare in vantaggio !</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="colContainerFlipCard col-lg-3 col-md-6 col-sm-12 d-flex justify-content-center">
                <div class="flip-card">
                    <div class="flip-card-inner">
                        <div class="cardFrontOcaGialla flip-card-front d-flex align-items-center justify-content-center">

                        </div>
                        <div class="cardBackOcaGialla flip-card-back">
                            <p>Con l'abilit&agrave; dell'<b>oca gialla</b> si potr&agrave; <b>avanzare di 3</b> invece che 1 quando si capita su una casella <b>"avanti di 1 casella"</b>. In modo da evitare delle possibili insidie !</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="colContainerFlipCard col-lg-3 col-md-6 col-sm-12 d-flex justify-content-center">
                <div class="flip-card">
                    <div class="flip-card-inner">
                        <div class="cardFrontOcaBlu flip-card-front d-flex align-items-center justify-content-center">

                        </div>
                        <div class="cardBackOcaBlu flip-card-back">
                            <p>Con l'abilit&agrave; dell'<b>oca blu</b> si potr&agrave; <b>avanzare di 2</b> così da saltare una casella negativa o addirittura raggiungere il traguardo !</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="colContainerFlipCard col-lg-3 col-md-6 col-sm-12 d-flex justify-content-center">
                <div class="flip-card">
                    <div class="flip-card-inner">
                        <div class="cardFrontOcaRossa flip-card-front d-flex align-items-center justify-content-center">

                        </div>
                        <div class="cardBackOcaRossa flip-card-back">
                            <p>Con l'abilit&agrave; dell'<b>oca rossa</b> si potr&agrave; <b>annullare</b> l'effetto di una casella !</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <br><br>
        <div class="row">
            <div class="col d-flex justify-content-center">
                <h2><b>VS: </b></h2>
            </div>
        </div>
        <div class="col d-flex justify-content-center">
            <p class="introduz_giocoERegole"><i>Le buone notizie purtroppo sono già finite infatti le nostre amiche oche non avranno strada spianata fino alla raggiunto del tesoro , in aggiunta a tutte le caselle che possono contenere sia malus che bonus saremo contro la temuta oca Grimilde la quale cercherà in tutti i modi di arrivare alla fine prima di noi anche utilizzato la sua magia nera...</i>
            </p>
        </div>
        <div class="row" style="margin-bottom: 100px;">
            <div class="colContainerFlipCard col-lg-12 col-md-12 col-sm-12 d-flex justify-content-center">
                <div class="flip-card">
                    <div class="flip-card-inner">
                        <div class="cardFrontOcaCattiva flip-card-front d-flex align-items-center justify-content-center">

                        </div>
                        <div class="cardBackOcaCattiva flip-card-back">
                            <p id="nomeOcaCattiva">GRIMILDE</p>
                            <p>Con la sua magia riuscirà, se malauguratamente capiteremo sulla sua stessa casella, a mandarci indietro di due caselle facendoci perdere il vantaggio nei suoi confronti</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row" id="footer">
            <?php
                $footer = file("../soloFooter.html");
                foreach($footer as $row){
                    echo $row;
                }
            ?>
        </div>
    </div>


    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>
</body>

</html>
