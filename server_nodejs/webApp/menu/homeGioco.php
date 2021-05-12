<?php 
    session_start();

	//Mi serve l'IP del server. Questo lo leggo solo nel nodejs all'inizio e non riesco a passarlo
	// a tutte le pagine... lo scrivo su un file e quando ne ho bisogno lo leggo
    $IP = file("../../indirizzo_server.txt")[0];

    $nome = null;
    $cognome = null;
    $username = null;

    //controllo che ID e username siano settati. SE non sono settati che è successo ?
    // l'utente ha cambiato URL... NON DEVE POTER GIOCARE
    if(isset($_SESSION["ID"]) && isset($_SESSION["username"])){
        $ID = $_SESSION["ID"];
        $username = $_SESSION["username"];

        //Mi connetto al DB CrazyGoose
        $mysqli = new mysqli("localhost", "root", "", "CrazyGoose");
        if($mysqli->connect_error){
            die("Errore connessione al DB: ".$mysqli->connect_errno." per ".$mysqli->connect_error);
        }else{
            $queryResults = $mysqli->query("SELECT * FROM Utenti WHERE ID_gioc = '$ID';");
            if(!$queryResults){
                die("ERRORE SELECT di Utente da ID=$ID: ".$mysqli->error." (".$mysqli->errno.")");
            }else{
                //Nella query controllo che l'ID sia uguale a un certo valore. L'ID È CHIAVE
                // PRIMARIA QUINDI MI RESTITUISCE UN SOLO RECORD.
                //Allora posso usare fetch_assoc() per trasformare il risultato della query

                $ris_arr_assoc = $queryResults->fetch_assoc();
    
                /* DE-COMMENTARE per vedere cosa sarà $ris_arr_assoc
                echo "<pre>";
                print_r($ris_arr_assoc);
                echo "</pre>"; */

                if(!empty($ris_arr_assoc)){
                    $nome = $ris_arr_assoc["nome"];
                    $cognome = $ris_arr_assoc["cognome"];
                }else{
                    //In realta è impossibile che entri qui... può entrarci SOLO se per qualche motivo X
                    // l'utente con quel certo ID viene cancellato dal DB... (e quindi la query non trova nulla)
                    die("UTENTE CANCELLATO...");
                }
            }
        }
    
        $styleDivImgTitolo = "";
        $styleDelMenuUtente = "";
        $msgDelMenuUtente = "";
        if($nome != null){
            $styleDivImgTitolo = "margin-left: 130px;";
            $styleDelMenuUtente = "display: inline-block;";

            $msgDelMenuUtente = "Benvenuto<br><i><b>$nome $cognome</b></i><br>Con profilo:<br><i><b>$username</b></i>"; 
        }
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
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

        <div id="divCredits">
            <a href="http://<?php echo $IP; ?>:3000/credits" id="credits" class="link">CREDITS</a>
        </div>

    </div>
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