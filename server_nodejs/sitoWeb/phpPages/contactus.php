<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="res_static_sitoweb/css/contattaci.css">
    <link rel="stylesheet" href="res_static_sitoweb/css/navbar.css">
    <link rel="stylesheet" href="res_static_sitoweb/css/soloFooter.css">

    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">

    <title>Contatta Crazy Goose</title>
</head>

<body onload="focusIniziale()">
    <div class="container-fluid">
        <div class="row" id="rowNavbar">
            <div class="col">
                <img id="logo" src="res_static_sitoweb/images/logo_32x32.png">
                <a class="linkNavbar" href="http://localhost:3000/passaAPaginaPHP?pagina=sitoWeb/phpPages/home"><b>Home</b></a>
                <a class="linkNavbar" href="http://localhost:80/progetti/CrazyGoose/server_nodejs/sitoWeb/phpFiles/creazioneDB.php?prox=accedi"><b>Accedi</b></a>
                <a class="linkNavbar" href="http://localhost:80/progetti/CrazyGoose/server_nodejs/sitoWeb/phpFiles/creazioneDB.php?prox=registrati"><b>Registrati</b></a>
            </div>
        </div>
        <div class="row">
            <div class="col d-flex justify-content-center">
                <h2 id="primoTitolo" class="titoli">Contatta direttamente i creatori !!!</h2>
            </div>
        </div>
        <div class="row">
            <div class="col d-flex justify-content-center">
                <p class="titoli">Se hai un dubbio scrivilo:</p>
            </div>
        </div>
        <div class="row">
            <div class="col-12 col-lg-6 column d-flex justify-content-center">
                <img id="logo" src="res_static_sitoweb/images/logo_dim_originale.png" style="width: 500px; height: 500px;">
            </div>
            <div class="col-12 col-lg-6 column">
                <form action="http://localhost:80/progetti/CrazyGoose/server_nodejs/sitoWeb/phpFiles/send.php" method="post" name="formContattaci" onsubmit="return(controllaDati())">
                    <div class="divVoce">
                        <label>Nome:</label>
                        <input class="caselle" type="text" name="nome" placeholder="Giovanni..">
                    </div>
                    <div class="divVoce">
                        <label>Cognome:</label>
                        <input class="caselle" type="text" name="cognome" placeholder="Rossi..">
                    </div>
                    <div class="divVoce">
                        <label>La tua email:</label>
                        <input id="tuaEmail" class="caselle" type="text" name="email" placeholder="giovannirossi@gmail.com..">
                    </div>
                    <div class="divVoce">
                        <label>A chi verrà inviata:</label>
                        <br><b>crazygoose.help@gmail.com</b>
                    </div>
                    <div class="divVoce">
                        <label>Contenuto email:</label>
                        <textarea class="caselle" id="testo" name="testo" placeholder="..."></textarea>
                    </div>
                    <br><br><br><br><br><br>
                    <center><input type="submit" value="Invia" id="submit" /></center>
                    
                </form>
            </div>
        </div>
    </div>
    <div class="row" id="footer"></div>

    <script>
        function focusIniziale() {
            document.formContattaci.nome.focus()
            <?php if (isset($_GET["flag"])){?>
                alert("EMAIL INVIATA!!")
            <?php }?>
        }

        function controllaDati() {
            /* AL TENTATIVO DI INVIO DEI DATI ("onSubmit" nel tag "form")
            Prendo il form che nella pagina ha quel "name" "formReg", all'itnerno del
             quale ci sono delle componenti con un certo "name" ("email", "password").
             Ne controllo il valore, cioè quello che contengono. Se non contengono nulla sposto
             il focus su una di loro (scriverà con la tastiera all'interno della componente vuota senza doverci 
             cliccare lui) */
            let flagAlert = false

            if (document.formContattaci.nome.value == "") {
                document.formContattaci.nome.focus()
                flagAlert = true
            } else {
                var x = document.formContattaci.nome.value
                document.formContattaci.nome.value = x.trim()
            }

            if (!flagAlert) {
                if (document.formContattaci.cognome.value == "") {
                    document.formContattaci.cognome.focus()
                    flagAlert = true
                } else {
                    var x = document.formContattaci.cognome.value
                    document.formContattaci.cognome.value = x.trim()
                }

                if (!flagAlert) {
                    if (document.formContattaci.email.value == "") {
                        document.formContattaci.email.focus()
                        flagAlert = true
                    } else {
                        var x = document.formContattaci.email.value
                        document.formContattaci.email.value = x.trim()
                    }

                    if (!flagAlert) {
                        if (document.formContattaci.testo.value == "") {
                            document.formContattaci.testo.focus()
                            flagAlert = true
                        } else {
                            var x = document.formContattaci.testo.value
                            document.formContattaci.testo.value = x.trim()
                        }
                    }
                }
            }
            function nomeFunz(){
                <?php if (isset($_GET["flag"])){ ?>
                    alert("EMAIL INVIATA!!!")
                <?php }?>


            }
            if (flagAlert) {
                alert("COMPLETA I CAMPI DEL FORM !")
            }
            return (!flagAlert)
        }
    </script>

    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js " integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo " crossorigin="anonymous "></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js " integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49 " crossorigin="anonymous "></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js " integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy " crossorigin="anonymous "></script>
</body>

</html>