var IP = null

const crypto = require("crypto")
const fs = require("fs")
const GestioneDatabase = require("./GestioneDatabase")
const bodyParser = require("body-parser")
const jsdom = require("jsdom")
    //destrutturazione (prendo solo quello che mi serve)
const { JSDOM } = jsdom

const express = require("express")
const app = express()
var gestDB_per_client = {}


app.listen(3000, () => {
    require('dns').lookup(require('os').hostname(), function(err, address, fam) {
        IP = address
        console.log("SERVER IN ASCOLTO su: " + IP + ":3000")
    })
})
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ extended: true }))
app.use(express.static("public"))


function getGestDB_client(IP){
    let gestDB_ritorno = gestDB_per_client[IP]
    
    if(gestDB_per_client[IP] == undefined){
        gestDB_ritorno = gestDB_per_client[IP] = new GestioneDatabase()    
    }
    
    return gestDB_ritorno
}

function aggiungiFooterAllaPagina(pagina) {
    let jsDom = new JSDOM(pagina)

    let footer = fs.readFileSync("./sitoWeb/soloFooter.html", "utf-8")

    jsDom.window.document.getElementById("footer").innerHTML = footer

    return (jsDom.window.document.documentElement.outerHTML)
}

function rimpiazzaLocalhostConIP(pagina) {
    //leggo il file come semplice testo (stringa) e rimpiazzo ogni
    //  "localhost" con l'IP

    //uso la "replace()", molto semplice ma sostituisce solo la prima occorenza
    // di quello specificato come primo argomento. Quindi ciclo finchè non li
    // ha sostituiti
    let paginaModif = pagina
    while (paginaModif.includes("localhost")) {
        paginaModif = paginaModif.replace("localhost", IP)
    }

    return paginaModif
}

function controllaSeLoggato(req, resp) {
    //req.connection.remoteAddress ritorna l'IP del client che si è connesso
    let gestDB = getGestDB_client(req.connection.remoteAddress)
    
    if (gestDB.nome == null) {
        //non è loggato ed ha modificato l'URL manualmente... lo mando alla pagina per loggarsi
        resp.redirect(301, "/accedi")
    } else {
        return true
    }
}


app.get("/logoutUtente", (req, resp) => {
    //req.connection.remoteAddress ritorna l'IP del client che si è connesso
    let gestDB = getGestDB_client(req.connection.remoteAddress)
    
    gestDB.resettaValori()

    resp.redirect(301, "/accedi")
})

app.get("/", (req, resp) => {
    //req.connection.remoteAddress ritorna l'IP del client che si è connesso
    let gestDB = getGestDB_client(req.connection.remoteAddress)
    
    let pagina = fs.readFileSync("./sitoWeb/home.html", "utf-8")
    let paginaConIP = rimpiazzaLocalhostConIP(pagina)
    let paginaConFooter = aggiungiFooterAllaPagina(paginaConIP)
    let jsDom = new JSDOM(paginaConFooter)

    //(mi basta controllare che il nome non sia null, se è null lo è anche il congome)
    if (gestDB.nome != null) {
        jsDom.window.document.getElementById("testataSito").className = "col-10 d-flex justify-content-center"

        jsDom.window.document.getElementById("menuUtente").className = "col-2"

        jsDom.window.document.getElementById("divDropdown").style.display = "inline-block"

        let msg = "Benvenuto<br><i><b>" + gestDB.nome + " " + gestDB.cognome + "</b></i>"
        if (gestDB.username != null) {
            msg = "Benvenuto<br><i><b>" + gestDB.nome + " " + gestDB.cognome + "</b></i><br>Con profilo:<br><i><b>" + gestDB.username + "</b></i>"
        } else {
            jsDom.window.document.getElementById("linkVaiAlGioco").style.display = "none"
        }

        jsDom.window.document.getElementById("dropdownBtn").innerHTML = msg

    } else {
        jsDom.window.document.getElementById("testataSito").className = "col-12 d-flex justify-content-center"
    }

    resp.send(jsDom.window.document.documentElement.outerHTML)
})

app.get("/profili", (req, resp) => {
    //req.connection.remoteAddress ritorna l'IP del client che si è connesso
    let gestDB = getGestDB_client(req.connection.remoteAddress)
    
    if (controllaSeLoggato(req, resp)) {

        if (req.query.username != undefined) {
            gestDB.username = req.query.username
        }

        let aggProfilo = req.query.agg
        if (aggProfilo != undefined) {
            gestDB.username = null
        }

        //la query ci impiega un attimo a finire, e io devo fare la resp.send
        // QUANDO ha finito la query
        gestDB.profiliRegistrati(function(arrayProfili) {
            let pagina = fs.readFileSync("./sitoWeb/profili.html", "utf-8")
            let paginaConIP = rimpiazzaLocalhostConIP(pagina)
            let paginaModif = paginaConIP

            /*TODO AUTOMIZZARE CON CICLO
            <div class="col-4">
                <center>
                    <div class="divBtnScegliProfilo">
                        <div id="mostra0">
                            <img onclick="chiediConferma('__USERNAME0__')" class="imgCestino" src="/res_static_sitoweb/images/cestino.png">
                            <button onclick="profiloScelto('__USERNAME0__')" class="btnScegliProfilo">Profilo N.1<br><i><b>__USERNAME0__</i></b></button>
                        </div>

                        <button id="btnScegli0" onclick="aggProfilo()" class="btnScegliProfilo">AGGIUNGI<br>PROFILO N.1 <h3>➕</h3></button>
                    </div>
                </center>
            </div>*/

            if (arrayProfili.length > 0) {
                while (paginaModif.includes("__USERNAME0__")) {
                    paginaModif = paginaModif.replace("__USERNAME0__", arrayProfili[0].username)
                }

                if (arrayProfili.length > 1) {
                    while (paginaModif.includes("__USERNAME1__")) {
                        paginaModif = paginaModif.replace("__USERNAME1__", arrayProfili[1].username)
                    }

                    if (arrayProfili.length > 2) {
                        while (paginaModif.includes("__USERNAME2__")) {
                            paginaModif = paginaModif.replace("__USERNAME2__", arrayProfili[2].username)
                        }
                    }
                }
            }

            let jsDom = new JSDOM(paginaModif)
            if (arrayProfili.length > 0) {
                jsDom.window.document.getElementById("btnScegli0").style.display = "none"
            } else {
                jsDom.window.document.getElementById("mostra0").style.display = "none"
            }
            if (arrayProfili.length > 1) {
                jsDom.window.document.getElementById("btnScegli1").style.display = "none"
            } else {
                jsDom.window.document.getElementById("mostra1").style.display = "none"
            }
            if (arrayProfili.length > 2) {
                jsDom.window.document.getElementById("btnScegli2").style.display = "none"
            } else {
                jsDom.window.document.getElementById("mostra2").style.display = "none"
            }

            jsDom.window.document.getElementById("infoQualeUtente").innerHTML = "PROFILI di " + gestDB.nome + " " + gestDB.cognome

            if (gestDB.username != null && aggProfilo == undefined) {

                gestDB.datiProfilo(function(queryResult, partite) {
                    if (queryResult != null && partite != null) {

                        jsDom.window.document.getElementById("voceLogout").innerHTML = "Logout da <i><b>" + gestDB.username + " </i></b>"

                        jsDom.window.document.getElementById("infoStatistUsername").innerHTML = "<h4>Statistiche del profilo <i><b style=\"color:red;\"> " + gestDB.username + " </b></i></h4>"

                        let totalePartite = (queryResult.partiteVinte + queryResult.partitePerse)
                        jsDom.window.document.getElementById("totPartite").innerHTML = "In totale hai giocato " + totalePartite + " partite"

                        if (totalePartite > 0) {
                            jsDom.window.document.getElementById("partiteVinte").innerHTML = "&#8614; di cui ne hai vinte " + queryResult.partiteVinte
                            jsDom.window.document.getElementById("partitePerse").innerHTML = "&#8627; e ne hai perse " + queryResult.partitePerse
                        } else {
                            jsDom.window.document.getElementById("numPartite").style.display = "none"
                        }
                        let msgMotiv = ""

                        /* class="gradi" Rende "trasparente" i gradi non ancora raggiunti
                            <del> mette una barra sulla scritta (per i gradi SUPERATI)
                            class="gradiNoTrasp" per il grado corrente */
                        let elencoGradi = ""
                            //!!!!!!!! TODO FARE MEGLIO ELENCO DEI GRADI !!!!!!!!!!

                        if (queryResult.grado == "Novellino") {
                            msgMotiv = "Roma non è stata costruita in un giorno...";

                            elencoGradi = "<li class=\"gradiNoTrasp\">Novellino</li> \
                                        <li class=\"gradi\">Principiante</li> \
                                        <li class=\"gradi\">Intermedio</li> \
                                        <li class=\"gradi\">Esperto</li> \
                                        <li class=\"gradi\">Maestro</li>";

                        } else if (queryResult.grado == "Principiante") {
                            msgMotiv = "Sei un diamante ancora grezzo";

                            elencoGradi = "<li class=\"gradiNoTrasp\"><del>Novellino</del></li> \
                                        <li class=\"gradiNoTrasp\">Principiante</li> \
                                        <li class=\"gradi\">Intermedio</li> \
                                        <li class=\"gradi\">Esperto</li> \
                                        <li class=\"gradi\">Maestro</li>";

                        } else if (queryResult.grado == "Intermedio") {
                            msgMotiv = "Non si lascia il lavoro a met&agrave;";

                            elencoGradi = "<li class=\"gradiNoTrasp\"><del>Novellino</del></li> \
                                        <li class=\"gradiNoTrasp\"><del>Principiante</del></li> \
                                        <li class=\"gradiNoTrasp\">Intermedio</li> \
                                        <li class=\"gradi\">Esperto</li> \
                                        <li class=\"gradi\">Maestro</li>";

                        } else if (queryResult.grado == "Esperto") {
                            msgMotiv = "Sei quasi al top";

                            elencoGradi = "<li class=\"gradiNoTrasp\"><del>Novellino</del></li> \
                                        <li class=\"gradiNoTrasp\"><del>Principiante</del></li> \
                                        <li class=\"gradiNoTrasp\"><del>Intermedio</del></li> \
                                        <li class=\"gradiNoTrasp\">Esperto</li> \
                                        <li class=\"gradi\">Maestro</li>";

                        } else if (queryResult.grado == "Maestro") {
                            msgMotiv = "Lascia da parte la fortuna di qui in poi solo i migliori";

                            elencoGradi = "<li class=\"gradiNoTrasp\"><del>Novellino</del></li> \
                                        <li class=\"gradiNoTrasp\"><del>Principiante</del></li> \
                                        <li class=\"gradiNoTrasp\"><del>Intermedio</del></li> \
                                        <li class=\"gradiNoTrasp\"><del>Esperto</del></li> \
                                        <li class=\"gradiNoTrasp\">Maestro</li>";

                        }

                        jsDom.window.document.getElementById("ulElencoGradi").innerHTML = elencoGradi
                        jsDom.window.document.getElementById("msgMotivazionale").innerHTML = msgMotiv

                        let elencoPartite = ""

                        if (partite.length == 0) {
                            elencoPartite = "<label>Non hai ancora giocato nessuna partita... Forza <a href=\"http://" + IP + ":3000/CrazyGoose\">vai a divertirti !</a></label>"
                        } else {
                            partite.forEach(datiSingolaPartita => {
                                let ID_partita = datiSingolaPartita.ID_part
                                let vinto_perso = ""
								
                                if (datiSingolaPartita.flagVittoria == 1) {
                                    vinto_perso = "<label style=\"color:greenyellow;\">VINTO</label>";
                                } else {
                                    vinto_perso = "<label style=\"color:red;\">PERSO"+datiSingolaPartita.flagVittoria+"</label>";
                                }
                                let minuti = datiSingolaPartita.durata
                                let dadiLanciati = datiSingolaPartita.numMosse

                                elencoPartite += "<li>Partita N." + ID_partita + ": hai " + vinto_perso + ". Nella partita, durata <b>" + minuti + "min</b>, hai <b>tirato " + dadiLanciati + " volte</b> il dado;</li>"
                            });
                        }
                        jsDom.window.document.getElementById("divElencoPartite").innerHTML = elencoPartite

                        resp.send(jsDom.window.document.documentElement.outerHTML)
                    } else {
                        //quando può entrare qui ? Se ad esempio l'utente modifica l'URL inserendo un
                        // username che non esiste o un username di un profilo NON SUO

                        //lo rimando alla home dei profili (dopo aver fatto il logout)

                        resp.redirect(301, "/esciDalProfilo")
                    }
                })
            } else {
                jsDom.window.document.getElementById("linkVaiAlGioco").style.display = "none"
                jsDom.window.document.getElementById("voceLogout").style.display = "none"

                jsDom.window.document.getElementById("usernameNotNull").style.display = "none"
                jsDom.window.document.getElementById("noProfiloScelto").style.display = "block"

                jsDom.window.document.getElementById("usernameNotNull").display = "none"
                if (aggProfilo == undefined) {
                    jsDom.window.document.getElementById("noProfiloScelto").display = "block"
                } else {
                    jsDom.window.document.getElementById("noProfiloScelto").style.display = "none"
                    jsDom.window.document.getElementById("aggiungeProfilo").style.display = "block"

                    if (req.query.err != undefined) {
                        jsDom.window.document.getElementById("msgErroreUsername").style.display = "block"
                    }
                }

                resp.send(jsDom.window.document.documentElement.outerHTML)
            }
        })
    }
})

app.post("/aggProfilo", (req, resp) => {
    //req.connection.remoteAddress ritorna l'IP del client che si è connesso
    let gestDB = getGestDB_client(req.connection.remoteAddress)
    
    if (controllaSeLoggato(req, resp)) {
        //la query ci impiega un attimo a finire, e io devo fare la resp.send
        // QUANDO ha finito la query
        gestDB.aggiungiProfilo(req.body.username, function(flagAggiunto) {
            if (flagAggiunto) {
                resp.redirect(301, "/profili")
            } else {
                resp.redirect(301, "/profili?agg=true&err=true")
            }
        })
    }
})

app.get("/esciDalProfilo", (req, resp) => {
    //req.connection.remoteAddress ritorna l'IP del client che si è connesso
    let gestDB = getGestDB_client(req.connection.remoteAddress)
    
    if (controllaSeLoggato(req, resp)) {
        gestDB.esciDalProfilo()
        resp.redirect(301, "/profili")
    }
})

app.get("/eliminaProfilo", (req, resp) => {
    //req.connection.remoteAddress ritorna l'IP del client che si è connesso
    let gestDB = getGestDB_client(req.connection.remoteAddress)
    
    if (controllaSeLoggato(req, resp)) {
        //la query ci impiega un attimo a finire, e io devo fare la resp.send
        // QUANDO ha finito la query
        gestDB.eliminaProfilo(req.query.username, function() {
            resp.redirect(301, "/profili")
        })
    }
})

app.get("/regole", (req, resp) => {
    let paginaRegoleSenzaFooter = fs.readFileSync("./sitoWeb/regole.html", "utf-8")
    let paginaConFooter = aggiungiFooterAllaPagina(paginaRegoleSenzaFooter)
    let pagina = rimpiazzaLocalhostConIP(paginaConFooter)

    resp.send(pagina)
})

app.get("/contattaci", (req, resp) => {
    //req.connection.remoteAddress ritorna l'IP del client che si è connesso
    let gestDB = getGestDB_client(req.connection.remoteAddress)
    
    let paginaRegoleSenzaFooter = fs.readFileSync("./sitoWeb/contattaci.html", "utf-8")
    let paginaConFooter = aggiungiFooterAllaPagina(paginaRegoleSenzaFooter)
    let pagina = rimpiazzaLocalhostConIP(paginaConFooter)

    //Io voglio mostrare un alert all'invio dell'email (cioè quando torna su questo endpoint
    // con il valore in GET flag=true). Non riesco a aggiungere un onload al body dinamicamente
    // da qui quindi quello che ho pensato di fare è di mettere un if nella pagina contattaci.html
    // prima di fare l'alert e modificarlo in if(false){alert...} o if(true){alert...}
    // in base a se debba fare o meno l'alert

    if (req.query.flag == 1) {
        pagina = pagina.replace("__DO_ALERT_SENT__", "true")
    } else {
        pagina = pagina.replace("__DO_ALERT_SENT__", "false")
    }
    
    if(gestDB.email != null){
		//se l'utente è loggato non inserisce più la sua email, MA quindi non viene
		// inviata in POST a send.php... Allora faccio che aggiungerla in GET all'action del form
    	pagina = pagina.replace("__emailUtente__", gestDB.email)
    }
    
    jsDom = new JSDOM(pagina);
    
	let lblTuaEmail = "<label>La tua email:</label>"
//                        <input id="tuaEmail" class="caselle" type="text" name="email" placeholder="giovannirossi@gmail.com..">"
//<label id="tuaEmail"><?php echo $email; ?></label>
	
	if(gestDB.email != null){
		lblTuaEmail += "<label id=\"tuaEmail\">"+gestDB.email+"</label>"
	}else{
		lblTuaEmail += "<input id=\"tuaEmail\" class=\"caselle\" type=\"text\" name=\"email\" placeholder=\"giovannirossi@gmail.com..\">"
	}
	

    jsDom.window.document.getElementById("divTuaEmail").innerHTML = lblTuaEmail

    resp.send(jsDom.window.document.documentElement.outerHTML)
})

app.get("/registrati", (req, resp) => {
    let pagina = fs.readFileSync("./sitoWeb/registrati.html", "utf-8")
    let paginaConIP = rimpiazzaLocalhostConIP(pagina)

    resp.send(paginaConIP)
})
app.post("/formRegistrati", (req, resp) => {
    //req.connection.remoteAddress ritorna l'IP del client che si è connesso
    let gestDB = getGestDB_client(req.connection.remoteAddress)
    
    //la query ci impiega un attimo a finire, e io devo fare la resp.send
    // QUANDO ha finito la query
	let passwCritt = crypto.createHash("sha256").update(req.body.password).digest("hex")
	
    gestDB.registrati(req.body.nome, req.body.cognome, req.body.email, passwCritt, function(flagRegistrato) {

        if (!flagRegistrato) {
            let pagina = fs.readFileSync("./sitoWeb/registrati.html", "utf-8")
            let paginaConIP = rimpiazzaLocalhostConIP(pagina)

            let jsDom = new JSDOM(paginaConIP)

            jsDom.window.document.getElementById("emailGiaUsata").style.display = "block";
            resp.send(jsDom.window.document.documentElement.outerHTML)
        } else {
            resp.redirect(301, "/accedi")
        }
    })


})

app.get("/accedi", (req, resp) => {
    let pagina = fs.readFileSync("./sitoWeb/accedi.html", "utf-8")
    let paginaConIP = rimpiazzaLocalhostConIP(pagina)
    resp.send(paginaConIP)
})
app.post("/formAccedi", (req, resp) => {
    //req.connection.remoteAddress ritorna l'IP del client che si è connesso
    let gestDB = getGestDB_client(req.connection.remoteAddress)
    
    //la query ci impiega un attimo a finire, e io devo fare la resp.send
    // QUANDO ha finito la query
    let passwCritt = crypto.createHash("sha256").update(req.body.password).digest("hex")
    
    gestDB.accedi(req.body.email, passwCritt, function(flagAccesso) {

        if (!flagAccesso) {
            let pagina = fs.readFileSync("./sitoWeb/accedi.html", "utf-8")
            let paginaConIP = rimpiazzaLocalhostConIP(pagina)

            let jsDom = new JSDOM(paginaConIP)

            jsDom.window.document.getElementById("passwEmailErrati").style.display = "block";
            resp.send(jsDom.window.document.documentElement.outerHTML)
        } else {
            resp.redirect(301, "/")
        }
    })
})

app.get("/download", (req, resp) => {
    resp.sendFile(__dirname + "/downloads/GiocoPython.zip")
})
app.get("/guida", (req, resp) => {
    resp.sendFile(__dirname + "/downloads/DOC_CrazyGoose.pdf")
})


//----------------------------------------------------------

app.get("/CrazyGoose", (req, resp) => {
    //req.connection.remoteAddress ritorna l'IP del client che si è connesso
    let gestDB = getGestDB_client(req.connection.remoteAddress)
    
    if (controllaSeLoggato(req, resp)) {
        let pagina = fs.readFileSync("./webApp/menu/homePage.html", "utf-8")
        let jsDom = new JSDOM(pagina)

        jsDom.window.document.getElementById("dropdownBtn").innerHTML = "Benvenuto<br><i><b>" + gestDB.nome + " " + gestDB.cognome + "</b></i><br>Con profilo:<br><i><b>" + gestDB.username + "</b></i>"

        resp.send(rimpiazzaLocalhostConIP(jsDom.window.document.documentElement.outerHTML))
    }
})

app.get("/sceltaOche", (req, resp) => {
    if (controllaSeLoggato(req, resp)) {
        let pagina = fs.readFileSync("./webApp/giocoWeb/scelta_oche.html", "utf-8")
        let paginaConIP = rimpiazzaLocalhostConIP(pagina)

        resp.send(paginaConIP)
    }
})

app.get("/credits", (req, resp) => {
    if (controllaSeLoggato(req, resp)) {
        let pagina = fs.readFileSync("./webApp/menu/credits.html", "utf-8")
        let paginaConIP = rimpiazzaLocalhostConIP(pagina)

        resp.send(paginaConIP)
    }
})

app.get("/gioco", (req, resp) => {
    if (controllaSeLoggato(req, resp)) {
        let pagina = fs.readFileSync("./webApp/giocoWeb/gioco.html", "utf-8")
        let paginaConIP = rimpiazzaLocalhostConIP(pagina)
        let jsDom = new JSDOM(paginaConIP)

        jsDom.window.document.getElementById("lblOcaNascosta").innerHTML = req.query.ocaScelta

        resp.send(jsDom.window.document.documentElement.outerHTML)
    }
})

app.get("/finePartita", (req, resp) => {
    //req.connection.remoteAddress ritorna l'IP del client che si è connesso
    let gestDB = getGestDB_client(req.connection.remoteAddress)
    
    if (controllaSeLoggato(req, resp)) {
        let durata = req.query.durata
        let numMosse = req.query.numMosse
        let flagVittoria = null
        if(req.query.vitt == "true"){
			flagVittoria = true
        }else{
	        flagVittoria = false
        }
		

        gestDB.registraPartitaPartecipazione(durata, numMosse, flagVittoria, function() {
            let pagina = fs.readFileSync("./webApp/giocoWeb/finePartita.html", "utf-8")
            let paginaConIP = rimpiazzaLocalhostConIP(pagina)
            let jsDom = new JSDOM(paginaConIP)

            if (flagVittoria == true) {
                jsDom.window.document.getElementById("title").innerHTML = "VITTORIA !!!"
                jsDom.window.document.getElementById("vittoria").style.display = "block"
                jsDom.window.document.getElementById("sconfitta").style.display = "none"
            } else {
                jsDom.window.document.getElementById("title").innerHTML = "Sconfitta..."
                jsDom.window.document.getElementById("vittoria").style.display = "none"
                jsDom.window.document.getElementById("sconfitta").style.display = "block"
            }

            resp.send(jsDom.window.document.documentElement.outerHTML)
        })
    }
})

app.use("*", (req, resp) => {
    resp.send("<center><h1>ERROR 404</h1></center>")
})
