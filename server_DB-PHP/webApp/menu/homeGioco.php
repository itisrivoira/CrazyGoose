<?php 
    require("../../phpFiles/GestoreDB.php");

    session_start();

    //Mi serve l'IP del server. Questo lo leggo solo nel nodejs all'inizio e non riesco a passarlo
	// a tutte le pagine... lo scrivo su un file e quando ne ho bisogno lo leggo
    $IP = file("../../indirizzo_server.txt")[0];
    $gestDB = new GestDB();
    
    $styleDivImgTitolo = "";
    $styleDelMenuUtente = "";
    $msgDelMenuUtente = "";
    if(isset($_SESSION["email"])){
       // !!! array associativo chiavi "nome" e "cognome"
        $datiUtente = $gestDB->datiUtente($_SESSION["email"]);
        if($datiUtente != null){
            
            if(isset($_SESSION["username"])){
            	$username = $_SESSION["username"];
            }else{
                $username = null;
            }
            
            if($datiUtente["nome"] != null){
                $styleDivImgTitolo = "margin-left: 130px;";
                $styleDelMenuUtente = "display: inline-block;";

                $msgDelMenuUtente = "Benvenuto<br><i><b>".$datiUtente["nome"]." ".$datiUtente["cognome"]."</b></i><br>Con profilo:<br><i><b>$username</b></i>";
            }
        }else{
            die("Errore nel reperire i tuoi dati !");
        }
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <!-- MI SERVE XKE SE IL BROWSER MEMORIZZA IN CACHE DEI DATI DEL SITO
        SMETTE DI ENTRARE IN ALCUNI ENDPOINT-->
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Expires" content="0" />
    
    
    <title>Crazy Goose: Gioco</title>

	<!-- siamo in un file php quindi non "usa nodejs" e la cartella public per le risorse statiche,
	 quindi devo cambiare il percorso (in un file normale userei /res_static_menu/... perchè sa che
     una risorsa statica la deve prendere dalla cartella /public) -->

    <link rel="stylesheet" href="../../public/res_static_menu/css/index.css">

    <!-- Per l'icona piccoliina nella scheda -->
    <link rel="icon" type="image/png" href="../../public/favicon/favicon-196x196.png" sizes="196x196" />
    <link rel="icon" type="image/png" href="../../public/favicon/favicon-128.png" sizes="128x128" />
    <link rel="icon" type="image/png" href="../../public/favicon/favicon-96x96.png" sizes="96x96" />
    <link rel="icon" type="image/png" href="../../public/favicon/favicon-32x32.png" sizes="32x32" />
    <link rel="icon" type="image/png" href="../../public/favicon/favicon-16x16.png" sizes="16x16" />
</head>

<body style="margin: 0px;">
    <div id="areaMenu">
        <div>
            <div id="divDropdown"style="<?php echo $styleDelMenuUtente; ?>">
                <button id="dropdownBtn"><?php echo $msgDelMenuUtente; ?></button>
                <div id="dropdown-menu" >
                    <a href="http://<?php echo $IP; ?>:3000/">Home</a>
                    <a href="http://<?php echo $IP; ?>:3000/profilo">Profilo</a>
                    <a href="http://<?php echo $IP; ?>:3000/passaAPaginaPHP?pagina=sitoWeb/phpPages/contattaci.php">Contattaci</a>
                    <a href="http://<?php echo $IP; ?>:3000/logoutUtente">Esci</a>
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

        <div id="divCredits">
            <a href="http://<?php echo $IP; ?>:3000/credits" id="credits" class="link">CREDITS</a>
        </div>

    </div>
</body>

</html>
<?php 
    }
?>
