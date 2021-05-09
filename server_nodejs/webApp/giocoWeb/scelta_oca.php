<?php 
    //Nel file c'è solo una riga, solo l'IP. Quindi prendo il primo elemento dell'array
    // che mi restituisce la funzione file()
    $IP = file("../../indirizzo_server.txt")[0];
    
    if( !isset($_GET["ocaScelta"]) ){
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="../../public/res_static_gioco/css/scelta_oca.css">

    <title>Scelta Oca</title>
</head>

<body>

    <div id="areaScelta">
        <div id="titolo">
            <h1>SCEGLI LA TUA OCA</h1>
        </div>

        <div id="sottoTitolo">
            <p>*OGNI OCA HA UN' ABILITA DIVERSA*</p>
        </div>

        <center>
            <div id="areaOche">
                <a href="http://<?php echo $IP; ?>:80/progetti/CrazyGoose/server_nodejs/webApp/giocoWeb/scelta_oca.php?ocaScelta=gialla">    
                    <div id="ocaGialla">
                        <div id="gialla">
                            <p>OCA GIALLA</p>
                            <!-- <style data-text="Con la sua abilità si potrà avanzare di 3 caselle al posto di1 quando si capita su una casella 'avanti di 1'"></style> -->
                            <img src="../../public/res_static_gioco/images/pedine/pedineMenuSceltaPedina/pedina_gialla_150x141.png">
                            <p class="descrOca">Con la sua abilità si potrà avanzare di 3 caselle quando si finisce su una casella 'avanti di 1'</p>
                        </div>
                    </div>
                </a>

                <a href="http://<?php echo $IP; ?>:80/progetti/CrazyGoose/server_nodejs/webApp/giocoWeb/scelta_oca.php?ocaScelta=verde">    
                    <div id="ocaVerde">
                        <div id="verde">
                            <p>OCA VERDE</p>
                            <img src="../../public/res_static_gioco/images/pedine/pedineMenuSceltaPedina/pedina_verde_150x141.png">
                            <p class="descrOca">Con la sua abilità si potrà tirare nuovamente il dado!</p>
                        </div>
                    </div>
                </a>
                <a href="http://<?php echo $IP; ?>:80/progetti/CrazyGoose/server_nodejs/webApp/giocoWeb/scelta_oca.php?ocaScelta=blu">    
                    <div id="ocaBlu">
                        <div id="blu">
                            <p>OCA BLU</p>
                            <img src="../../public/res_static_gioco/images/pedine/pedineMenuSceltaPedina/pedina_blu_150x141.png">
                            <p class="descrOca">Con la sua abilità si potrà avanzare di 2 caselle!</p>
                        </div>
                    </div>
                </a>
                <a href="http://<?php echo $IP; ?>:80/progetti/CrazyGoose/server_nodejs/webApp/giocoWeb/scelta_oca.php?ocaScelta=rossa">
                    <div id="ocaRossa">
                        <div id="rossa">
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
        session_start();
        $_SESSION["ocaScelta"] = $_GET["ocaScelta"];
        header("Location: http://$IP:80/progetti/CrazyGoose/server_nodejs/webApp/giocoWeb/gioco.php");
    }
?>