<?php
    session_start();

    //Mi serve l'IP del server. Questo lo leggo solo nel nodejs all'inizio e non riesco a passarlo
	// a tutte le pagine... lo scrivo su un file e quando ne ho bisogno lo leggo
    $IP = file("../../indirizzo_server.txt")[0];

    if(isset($_SESSION["ocaScelta"])){
        //Diversi dati non li posso prendere dalla classe CrazyGoose (javascript) e portarmeli
        // in php. Inoltre ho tentato di calcolare la durata usando
        //       time() o (new DateTime())->getTimestamp()
        // ma non funzionava. Quindi mi calcolo tutto in javascript
        // poi lo passo in GET  a questa pagina che li memorizza e passa alla pagina di vittoria/sconfitta

        if( isset($_GET["durata"]) && isset($_GET["numMosse"]) && isset($_GET["vitt"]) ){

            $_SESSION["durata"] = $_GET["durata"];
            $_SESSION["numMosse"] = (int)$_GET["numMosse"];

            if($_GET["vitt"] == "true"){
                $_SESSION["vitt"] = 1;
            }else{
                $_SESSION["vitt"] = 0;
            }
            header("Location: http://$IP:3000/passaAPaginaPHP?pagina=webApp/giocoWeb/finePartita.php");
        }else{
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

     <link rel="stylesheet" href="../../public/res_static_gioco/css/index.css">

    <!-- Per l'icona piccoliina nella scheda -->
    <link rel="icon" type="image/png" href="../../public/favicon/favicon-196x196.png" sizes="196x196" />
    <link rel="icon" type="image/png" href="../../public/favicon/favicon-128.png" sizes="128x128" />
    <link rel="icon" type="image/png" href="../../public/favicon/favicon-96x96.png" sizes="96x96" />
    <link rel="icon" type="image/png" href="../../public/favicon/favicon-32x32.png" sizes="32x32" />
    <link rel="icon" type="image/png" href="../../public/favicon/favicon-16x16.png" sizes="16x16" />
</head>

<body onload="inizioPartita()">
    <div id="gioco">
        <center>
            <a href="http://<?php echo $IP; ?>:3000/"><img id="imgTitolo" src="../../public/res_static_gioco/images/scrittaCrazyGoose_400x130_bagliore.png"></a>
        </center>

        <!-- INFO giocatori -->
        <label id="info_pl1">Tu (PL1)</label>
        <label id="info_com">Computer (COM)</label>

        <!-- DADI giocatori -->
        <div id="dado_pl1">
            <img src="../../public/res_static_gioco/images/cross.png" id="imgCroce" style="position: absolute; z-index: 5;">
            <div class="scene" style="border-radius: 15px;">
                <div class="cube">
                    <div class="cube__face--1"></div>
                    <div class="cube__face--2"></div>
                    <div class="cube__face--3"></div>
                    <div class="cube__face--4"></div>
                    <div class="cube__face--5"></div>
                    <div class="cube__face--6"></div>
                </div>
            </div>
        </div>

        <div id="dado_com">
            <div class="sceneCOM">
                <div class="cubeCOM">
                    <div class="cube__face--1"></div>
                    <div class="cube__face--2"></div>
                    <div class="cube__face--3"></div>
                    <div class="cube__face--4"></div>
                    <div class="cube__face--5"></div>
                    <div class="cube__face--6"></div>
                </div>
            </div>
        </div>

        <!-- src settata in run time-->
        <img id="imgAbilita">
        <label id="tmpRimanenteAbilita">0.0 s</label>

        <!-- EFFETTI giocatori -->
        <label id="eff1_pl1"></label>
        <label id="eff2_pl1"></label>

        <label id="eff1_com"></label>
        <label id="eff2_com"></label>

        <center>
            <div class="tabellone">
                <div class="divCasIniziali">
                    <div class="caselleIniziali" id="inizPL1"></div>
                    <div class="caselleIniziali" id="inizCOM"></div>
                </div>
                <div class="percorsoCaselle">
                    <!-- sesta riga -->
                    <div class="sestaRiga" id="6riga">
                        <div class="casella18 casella" id="_18">
                            <div class="numCasella" id="-18">18</div>
                        </div>
                        <div class="caselle" id="_17">
                            <div class="numCasella" id="-17">17</div>
                        </div>
                        <div class="caselle" id="_16">
                            <div class="numCasella" id="-16">16</div>
                        </div>
                        <div class="caselle" id="_15">
                            <div class="numCasella" id="-15">15</div>
                        </div>
                        <div class="caselle" id="_14">
                            <div class="numCasella" id="-14">14</div>
                        </div>
                        <div class="caselle" id="_13">
                            <div class="numCasella" id="-13">13</div>
                        </div>
                        <div class="casella casella12" id="_12">
                            <div class="numCasella" id="-12">12</div>
                        </div>

                    </div>

                    <!-- quinta riga -->

                    <div class="quintaRiga" id="5riga">
                        <div class="caselle" id="_19">
                            <div class="numCasella" id="-19">19</div>
                        </div>
                        <div class="casella casella34" id="_34">
                            <div class="numCasella" id="-34">34</div>
                        </div>
                        <div class="caselle" id="_33">
                            <div class="numCasella" id="-33">33</div>
                        </div>
                        <div class="caselle" id="_32">
                            <div class="numCasella" id="-32">32</div>
                        </div>
                        <div class="caselle" id="_31">
                            <div class="numCasella" id="-31">31</div>
                        </div>
                        <div class="casella30 casella" id="_30">
                            <div class="numCasella" id="-30">30</div>
                        </div>
                        <div class="caselle" id="_11">
                            <div class="numCasella" id="-11">11</div>
                        </div>

                    </div>

                    <!-- quarta riga -->

                    <div class="quartaRiga" id="4riga">
                        <div class="caselle" id="_20">
                            <div class="numCasella" id="-20">20</div>
                        </div>
                        <div class="caselle" id="_35">
                            <div class="numCasella" id="-35">35</div>
                        </div>
                        <div class="casella40 casella" id="_40">
                            <div class="numCasella40" id="-40">40</div>
                        </div>
                        <div class="caselle" id="_29">
                            <div class="numCasella" id="-29">29</div>
                        </div>
                        <div class="caselle" id="_10">
                            <div class="numCasella" id="-10">10</div>
                        </div>

                    </div>

                    <!-- terza riga-->

                    <div class="terzaRiga" id="3riga">
                        <div class="caselle" id="_21">
                            <div class="numCasella" id="-21">21</div>
                        </div>
                        <div class="casella casella36" id="_36">
                            <div class="numCasella" id="-36">36</div>
                        </div>
                        <div class="caselle" id="_37">
                            <div class="numCasella" id="-37">37</div>
                        </div>
                        <div class="caselle" id="_38">
                            <div class="numCasella" id="-38">38</div>
                        </div>
                        <div class="casella casella39" id="_39">
                            <div class="numCasella" id="-39">39</div>
                        </div>
                        <div class="caselle" id="_28">
                            <div class="numCasella" id="-28">28</div>
                        </div>
                        <div class="caselle" id="_9">
                            <div class="numCasella" id="-9">9</div>
                        </div>

                    </div>

                    <!-- seconda riga-->

                    <div class="secondaRiga" id="2riga">
                        <div class="casella casella22" id="_22">
                            <div class="numCasella" id="-22">22</div>
                        </div>
                        <div class="caselle" id="_23">
                            <div class="numCasella" id="-23">23</div>
                        </div>
                        <div class="caselle" id="_24">
                            <div class="numCasella" id="-24">24</div>
                        </div>
                        <div class="caselle" id="_25">
                            <div class="numCasella" id="-25">25</div>
                        </div>
                        <div class="caselle" id="_26">
                            <div class="numCasella" id="-26">26</div>
                        </div>
                        <div class="casella27 casella" id="_27">
                            <div class="numCasella" id="-27">27</div>
                        </div>
                        <div class="caselle" id="_8">
                            <div class="numCasella" id="-8">8</div>
                        </div>
                    </div>

                    <!-- prima riga a partire dallo start -->

                    <div class="primaRiga" id="1riga">
                        <div class="caselle" id="_1">
                            <div class="numCasella" id="-1">1</div>
                        </div>
                        <div class="caselle" id="_2">
                            <div class="numCasella" id="-2">2</div>
                        </div>
                        <div class="caselle" id="_3">
                            <div class="numCasella" id="-3">3</div>
                        </div>
                        <div class="caselle" id="_4">
                            <div class="numCasella" id="-4">4</div>
                        </div>
                        <div class="caselle" id="_5">
                            <div class="numCasella" id="-5">5</div>
                        </div>
                        <div class="caselle" id="_6">
                            <div class="numCasella" id="-6">6</div>
                        </div>
                        <div class="casella7 casella" id="_7">
                            <div class="numCasella" id="-7">7</div>
                        </div>
                    </div>
                </div>
            </div>
        </center>
    </div>

    <!--Se in uno script X ho bisogno di importare un nuovo file js Y basta che importi qui Y PRIMA di X -->
    <script src="../../public/res_static_gioco/js/percorsoModul.js"></script>
    <script src="../../public/res_static_gioco/js/casellaModul.js"></script>
    <script src="../../public/res_static_gioco/js/GiocatoreModul.js"></script>
    <script src="../../public/res_static_gioco/js/crazyGoose.js"></script>
    <script>
        var game = null
        var partenza = 0
        var fine = null
        var durata = 0
        var numMosse = 0

        function inizioPartita() {
            let ocaScelta = "<?php echo $_SESSION["ocaScelta"]; ?>"
            partenza = Date.now()
            game = new CrazyGoose()
            game.start(ocaScelta)

            alert("DE-ZOMMARE la pagina e dare Ctrl+R (per sistemare il layout del gioco)")
        }

        function finePartita(pl1_ha_vinto) {
            fine = Date.now()
            //(minuti)
            let min = ((fine - partenza) / 1000 / 60)
            numMosse = game.player.dadiLanciati

            let url = "http://<?php echo $IP; ?>:80/progetti/CrazyGoose/server_DB-PHP/webApp/giocoWeb/gioco.php?durata="+min+"&numMosse="+numMosse+"&vitt="+game.player.vincitore
            location.replace(url)
        }   
    </script>
</body>

</html>
<?php 
        }
    }
?>
