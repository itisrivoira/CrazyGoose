<?php 
    //Mi serve l'IP del server. Questo lo leggo solo nel nodejs all'inizio e non riesco a passarlo
	// a tutte le pagine... lo scrivo su un file e quando ne ho bisogno lo leggo
    $IP = file("../../indirizzo_server.txt")[0];
    
    if( !isset($_GET["ocaScelta"]) ){
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Crazy Goose: Scelta Oca</title>
    
    <link rel="stylesheet" href="../../public/res_static_gioco/css/scelta_oca.css">

    <!-- Per l'icona piccoliina nella scheda -->
    <link rel="icon" type="image/png" href="../../public/favicon/favicon-196x196.png" sizes="196x196" />
    <link rel="icon" type="image/png" href="../../public/favicon/favicon-128.png" sizes="128x128" />
    <link rel="icon" type="image/png" href="../../public/favicon/favicon-96x96.png" sizes="96x96" />
    <link rel="icon" type="image/png" href="../../public/favicon/favicon-32x32.png" sizes="32x32" />
    <link rel="icon" type="image/png" href="../../public/favicon/favicon-16x16.png" sizes="16x16" />
</head>

<body style="margin:0px;">
    <div id="areaScelta">
        <div id="titolo">
            <h1>SCEGLI LA TUA OCA</h1>
        </div>

        <div id="sottoTitolo">
            <p>*** OGNI OCA HA UN' ABILITA DIVERSA ***</p>
        </div>

        <center>
            <div id="areaOche">
                <a href="http://<?php echo $IP; ?>:80/progetti/CrazyGoose/server_nodejs/webApp/giocoWeb/scelta_oca.php?ocaScelta=gialla">    
                    <div class="divGrandeOca" id="ocaGialla">
                        <div class="divOcaConP" id="gialla">
                            <p>OCA GIALLA</p>
                            <img src="../../public/res_static_gioco/images/pedine/pedineMenuSceltaPedina/pedina_gialla_150x141.png">
                            <p class="descrOca">Con la sua abilità si potrà avanzare di 3 caselle quando si finisce su una casella 'avanti di 1'</p>
                        </div>
                    </div>
                </a>

                <a href="http://<?php echo $IP; ?>:80/progetti/CrazyGoose/server_nodejs/webApp/giocoWeb/scelta_oca.php?ocaScelta=verde">    
                    <div class="divGrandeOca" id="ocaVerde">
                        <div class="divOcaConP" id="verde">
                            <p>OCA VERDE</p>
                            <img src="../../public/res_static_gioco/images/pedine/pedineMenuSceltaPedina/pedina_verde_150x141.png">
                            <p class="descrOca">Con la sua abilità si potrà tirare nuovamente il dado!</p>
                        </div>
                    </div>
                </a>
                <a href="http://<?php echo $IP; ?>:80/progetti/CrazyGoose/server_nodejs/webApp/giocoWeb/scelta_oca.php?ocaScelta=blu">    
                    <div class="divGrandeOca" id="ocaBlu">
                        <div class="divOcaConP" id="blu">
                            <p>OCA BLU</p>
                            <img src="../../public/res_static_gioco/images/pedine/pedineMenuSceltaPedina/pedina_blu_150x141.png">
                            <p class="descrOca">Con la sua abilità si potrà avanzare di 2 caselle!</p>
                        </div>
                    </div>
                </a>
                <a href="http://<?php echo $IP; ?>:80/progetti/CrazyGoose/server_nodejs/webApp/giocoWeb/scelta_oca.php?ocaScelta=rossa">
                    <div class="divGrandeOca" id="ocaRossa">
                        <div class="divOcaConP" id="rossa">
                            <p>OCA ROSSA</p>
                            <img src="../../public/res_static_gioco/images/pedine/pedineMenuSceltaPedina/pedina_rosso_150x141.png">
                            <p class="descrOca">Con la sua abilità si potrà annullare l'effetto di una casella!</p>
                        </div>
                    </div>
                </a>
            </div>
        </center>
    </div>
</body>

</html>
<?php 
    }else{
        //ha scelto un oca
        session_start();
        $_SESSION["ocaScelta"] = $_GET["ocaScelta"];
        
        header("Location: http://$IP:3000/CrazyGoose");
    }
?>