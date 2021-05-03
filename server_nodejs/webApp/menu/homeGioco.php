<?php 
    session_start();

    //Nel file c'è solo una riga, solo l'IP. Quindi prendo il primo elemento dell'array
    // che mi restituisce la funzione file()
    $IP = file("../../indirizzo_server.txt")[0];
    $nome = null;
    $cognome = null;

    if(isset($_SESSION["ID"])){
            //arriva da "creazioneDB.php" che, se non c'era ancora, crea il DB CrazyGoose
        $mysqli = new mysqli("localhost", "root", "", "CrazyGoose");
        if($mysqli->connect_error){
            if($mysqli->connect_errno == 1049){
                //è la prima visita sul server, nessuno è ancora passato da registrati/login
                // quindi il DB non è stato creato ancora
            }else{
                die("Errore:".$mysqli->connect_errno." per ".$mysqli->connect_error);
            }
        }else{
            $ID = $_SESSION["ID"];
            //TODO usare una query decente
            //$queryResults = $mysqli->query("SELECT nome, cognome FROM Utenti WHERE (Utenti.ID_giocatore == $ID);");
            $queryResults = $mysqli->query("SELECT * FROM Utenti;");
            $ris_arr_assoc = $queryResults->fetch_all(MYSQLI_ASSOC);

            if(count($ris_arr_assoc) > 0){
                $i = 0;
                $nome = null;
                while($i < count($ris_arr_assoc) && $nome == null){
                    if($ris_arr_assoc[$i]["ID_giocatore"] == $ID){
                        $nome = $ris_arr_assoc[$i]["nome"];
                        $cognome = $ris_arr_assoc[$i]["cognome"];
                    }

                    $i += 1;
                }  
            }
        }
    }
    
    //TODO ancora il footer ! 
    $styleDivImgTitolo = "";
    $styleDelMenuUtente = "";
    $msgDelMenuUtente = "";
    if($nome != null){
        $styleDivImgTitolo = "margin-left: 130px;";
        $styleDelMenuUtente = "display: inline-block;";
        $msgDelMenuUtente = "Benvenuto<br>$nome $cognome";
    }

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Crazy Goose</title>

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
                    <a href="http://localhost:3000/passaAPaginaPHP?pagina=sitoWeb/phpPages/home">Home</a>
                    <a href="http://localhost:3000/contattaci">Contattaci</a>
                    <a href="http://localhost:3000/esci">Esci</a>
                </div>
            </div>
        </div>

        <div id="divImgTitolo" style="<?php echo $styleDivImgTitolo; ?>">
            <center>
                <img id="scritta" src="../../public/res_static_menu/images/scrittaCrazyGoose_1920x1080_bagliore.png">
            </center>
        </div>

        <div id="divStart">
            <a href="http://localhost:3000/start" id="start" class="link">START</a>
        </div>

        <div id="divOptions">
            <a href="http://localhost:3000/options" id="options" class="link">OPTIONS</a>
        </div>

        <div id="divCredits">
            <a href="http://localhost:3000/credits" id="credits" class="link">CREDITS</a>
        </div>

    </div>
</body>

</html>