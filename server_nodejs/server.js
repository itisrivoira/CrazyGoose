var IP = null

const fs = require("fs")
const GestioneDatabase = require("./GestioneDatabase")
const bodyParser = require("body-parser")
const jsdom = require("jsdom")
    //destrutturazione (prendo solo quello che mi serve)
const { JSDOM } = jsdom

const express = require("express")
const app = express()
const gestDB = new GestioneDatabase()
gestDB.creaDB()

app.listen(3000, () => {
    require('dns').lookup(require('os').hostname(), function(err, address, fam) {
        IP = address
        console.log("SERVER IN ASCOLTO su: " + IP + ":3000")
            //mi serve scriverlo su un file xke il php ha bisogno del IP
            // e non so come altro fare per "darglielo"
        fs.writeFileSync("./indirizzo_server.txt", IP)
    })
})
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
app.use(express.static("public"))

//----------------- sito web ----------------------------------

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

app.get("/esci", (req, resp) => {
    gestDB.resettaValori()
    resp.redirect(301, "/")
})

app.get("/", (req, resp) => {
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
    let aggProfilo = req.query.agg
        /*if (aggProfilo != undefined) {
            //ne aggiunge uno nuovo, voglio che si "slogghi" da quello precedente
            gestDB.esciDalProfilo()
        }*/

    //la query ci impiega un attimo a finire, e io devo fare la resp.send
    // QUANDO ha finito la query
    gestDB.profiliRegistrati(function(arrayProfili) {
        let pagina = fs.readFileSync("./sitoWeb/profili.html", "utf-8")
        let paginaConIP = rimpiazzaLocalhostConIP(pagina)
        let paginaModif = paginaConIP

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

        gestDB.datiProfilo(function(queryResult, partite) {
            let jsDom = new JSDOM(paginaModif)

            jsDom.window.document.getElementById("infoQualeUtente").innerHTML = "PROFILI di " + gestDB.nome + " " + gestDB.cognome

            if (gestDB.username != null && aggProfilo == undefined) {

                jsDom.window.document.getElementById("voceLogout").innerHTML = "Logout da <i><b>" + gestDB.username + " </i></b>"

                jsDom.window.document.getElementById("infoStatistUsername").innerHTML = "<h4>Statistiche del profilo <i><b style=\"color:red;\"> " + gestDB.username + " </b></i></h4>"

                let totalePartite = (queryResult.partiteVinte + queryResult.partitePerse)
                jsDom.window.document.getElementById("totPartite").innerHTML = "In totale hai giocato " + totalePartite + " partite"

                if (totalePartite > 0) {
                    jsDom.window.document.getElementById("partiteVinte").innerHTML = "&#8614; di cui ne hai vinte " + queryResult.partiteVinte
                    jsDom.window.document.getElementById("partiteVinte").innerHTML = "&#8627; e ne hai perse " + queryResult.partitePerse
                } else {
                    jsDom.window.document.getElementById("numPartite").style.display = "none"
                }

            } else {

                jsDom.window.document.getElementById("linkVaiAlGioco").style.display = "none"
                jsDom.window.document.getElementById("voceLogout").style.display = "none"

                jsDom.window.document.getElementById("usernameNotNull").style.display = "none"
                jsDom.window.document.getElementById("noProfiloScelto").style.display = "block"

            }

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

            if (gestDB.username != null && aggProfilo == undefined) {
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
                        let ID_partita = datiSingolaPartita.ID_partita
                        let vinto_perso = ""
                        if (datiSingolaPartita.flagVittoria == 1) {
                            vinto_perso = "<label style=\"color:greenyellow;\">VINTO</label>";
                        } else {
                            vinto_perso = "<label style=\"color:red;\">PERSO</label>";
                        }
                        let minuti = datiSingolaPartita.durata
                        let dadiLanciati = datiSingolaPartita.numMosse

                        elencoPartite += "<li>Partita N." + ID_partita + ": hai " + vinto_perso + ". Nella partita, durata <b>" + minuti + "min</b>, hai <b>tirato " + dadiLanciati + " volte</b> il dado;</li>"
                    });
                }
                jsDom.window.document.getElementById("divElencoPartite").innerHTML = elencoPartite
            } else {
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
            }

            resp.send(jsDom.window.document.documentElement.outerHTML)
        })
    })
})

app.post("/aggProfilo", (req, resp) => {
    //la query ci impiega un attimo a finire, e io devo fare la resp.send
    // QUANDO ha finito la query
    gestDB.aggiungiProfilo(req.body.username, function(flagAggiunto) {
        if (flagAggiunto) {
            resp.redirect(301, "/profili")
        } else {
            resp.redirect(301, "/profili?agg=true&err=true")
        }

    })
})

app.get("/profiloScelto", (req, resp) => {
    gestDB.username = req.query.username
    resp.redirect(301, "/profili")
})

app.get("/esciDalProfilo", (req, resp) => {
    gestDB.esciDalProfilo()
    resp.redirect(301, "/profili")
})

app.get("/eliminaProfilo", (req, resp) => {
    //la query ci impiega un attimo a finire, e io devo fare la resp.send
    // QUANDO ha finito la query
    gestDB.eliminaProfilo(req.query.username, function() {
        resp.redirect(301, "/profili")
    })
})

app.get("/regole", (req, resp) => {
    let paginaRegoleSenzaFooter = fs.readFileSync("./sitoWeb/regole.html", "utf-8")
    let paginaConFooter = aggiungiFooterAllaPagina(paginaRegoleSenzaFooter)
    let pagina = rimpiazzaLocalhostConIP(paginaConFooter)

    resp.send(pagina)
})

app.get("/contattaci", (req, resp) => {
    let paginaRegoleSenzaFooter = fs.readFileSync("./sitoWeb/contattaci.html", "utf-8")
    let paginaConFooter = aggiungiFooterAllaPagina(paginaRegoleSenzaFooter)
    let pagina = rimpiazzaLocalhostConIP(paginaConFooter)

    resp.send(pagina)
})

app.get("/registrati", (req, resp) => {
    let pagina = fs.readFileSync("./sitoWeb/registrati.html", "utf-8")
    let paginaConIP = rimpiazzaLocalhostConIP(pagina)

    resp.send(paginaConIP)
})
app.post("/formRegistrati", (req, resp) => {
    //la query ci impiega un attimo a finire, e io devo fare la resp.send
    // QUANDO ha finito la query
    gestDB.registrati(req.body.nome, req.body.cognome, req.body.email, req.body.password, function(flagRegistrato) {

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
    //la query ci impiega un attimo a finire, e io devo fare la resp.send
    // QUANDO ha finito la query
    gestDB.accedi(req.body.email, req.body.password, function(flagAccesso) {

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
    let pagina = fs.readFileSync("./webApp/menu/homePage.html", "utf-8")
    let jsDom = new JSDOM(pagina)

    jsDom.window.document.getElementById("dropdownBtn").innerHTML = "Benvenuto<br><i><b>" + gestDB.nome + " " + gestDB.cognome + "</b></i><br>Con profilo:<br><i><b>" + gestDB.username + "</b></i>"

    resp.send(rimpiazzaLocalhostConIP(jsDom.window.document.documentElement.outerHTML))
})

app.get("/sceltaOche", (req, resp) => {
    let pagina = fs.readFileSync("./webApp/giocoWeb/scelta_oche.html", "utf-8")
    let paginaConIP = rimpiazzaLocalhostConIP(pagina)

    resp.send(paginaConIP)
})

app.get("/credits", (req, resp) => {
    let pagina = fs.readFileSync("./webApp/menu/credits.html", "utf-8")
    let paginaConIP = rimpiazzaLocalhostConIP(pagina)

    resp.send(paginaConIP)
})

app.get("/gioco", (req, resp) => {
    let pagina = fs.readFileSync("./webApp/giocoWeb/gioco.html", "utf-8")
    let paginaConIP = rimpiazzaLocalhostConIP(pagina)
    let jsDom = new JSDOM(paginaConIP)

    jsDom.window.document.getElementById("lblOcaNascosta").innerHTML = req.query.ocaScelta

    resp.send(jsDom.window.document.documentElement.outerHTML)
})

app.get("/finePartita", (req, resp) => {
    let durata = req.query.durata
    let numMosse = req.query.numMosse
    let flagVittoria = req.query.vitt

    gestDB.registraPartitaPartecipazione(durata, numMosse, flagVittoria, function() {
        let pagina = fs.readFileSync("./webApp/giocoWeb/finePartita.html", "utf-8")
        let paginaConIP = rimpiazzaLocalhostConIP(pagina)
        let jsDom = new JSDOM(paginaConIP)

        console.log(flagVittoria)

        if (flagVittoria) {
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

})

app.use("*", (req, resp) => {
    resp.send("<center><h1>ERROR 404</h1></center>")
})