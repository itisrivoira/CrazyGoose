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
    
    $styleDivImgTitolo = "";
    $styleDelMenuUtente = "";
    $msgDelMenuUtente = "";
    if($nome != null){
        $styleDivImgTitolo = "margin-left: 130px;";
        $styleDelMenuUtente = "display: inline-block;";
        $msgDelMenuUtente = "Benvenuto<br>$nome $cognome";
        if($username != null){
        	$msgDelMenuUtente = "Benvenuto<br><i><b>$nome $cognome</b></i><br>Con profilo:<br><i><b>$username</b></i>"; 
        }
    }

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Crazy Goose: Gioco</title>

	<!-- siamo in un file php quindi non "usa nodejs" e la cartella public per le risorse statiche,
	 quindi devo cambiare il percorso -->

    <link rel="stylesheet" href="../../public/res_static_menu/css/index.css">

    <link rel="icon" type="image/png" href="../../public/res_static_menu/images/favicon/favicon-196x196.png" sizes="196x196" />
    <link rel="icon" type="image/png" href="../../public/res_static_menu/images/favicon/favicon-96x96.png" sizes="96x96" />
    <link rel="icon" type="image/png" href="../../public/res_static_menu/images/favicon/favicon-32x32.png" sizes="32x32" />
    <link rel="icon" type="image/png" href="../../public/res_static_menu/images/favicon/favicon-16x16.png" sizes="16x16" />
    <link rel="icon" type="image/png" href="../../public/res_static_menu/images/favicon/favicon-128.png" sizes="128x128" />
</head>

<body style="margin:0px;">
    <div id="areaMenu">
        <div>
            <div id="divDropdown"style="<?php echo $styleDelMenuUtente; ?>">
                <button id="dropdownBtn"><?php echo $msgDelMenuUtente; ?></button>
                <div id="dropdown-menu" >
                    <a href="http://<?php echo $IP; ?>:3000/passaAPaginaPHP?pagina=sitoWeb/phpPages/home">Home</a>
                    <a href="http://<?php echo $IP; ?>:3000/contattaci">Contattaci</a>
                    <a href="http://<?php echo $IP; ?>:3000/esci">Esci</a>
                </div>
            </div>
        </div>

        <div id="divImgTitolo" style="<?php echo $styleDivImgTitolo; ?>">
            <center>
                <img id="scritta" src="../../public/res_static_menu/images/scrittaCrazyGoose_1920x1080_bagliore.png">
            </center>
        </div>

        <div id="divStart">
            <a href="http://<?php echo $IP; ?>:3000/start" id="start" class="link">START</a>
        </div>

        <div id="divOptions">
            <a href="http://<?php echo $IP; ?>:3000/options" id="options" class="link">OPTIONS</a>
        </div>

        <div id="divCredits">
            <a href="http://<?php echo $IP; ?>:3000/credits" id="credits" class="link">CREDITS</a>
        </div>

    </div>
</body>

</html>
