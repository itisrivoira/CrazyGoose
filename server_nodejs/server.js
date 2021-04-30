var IP = null

const fs = require("fs")
const bodyParser = require("body-parser")
const jsdom = require("jsdom")
    //destrutturazione (prendo solo quello che mi serve)
const { JSDOM } = jsdom

//https://codeshack.io/basic-login-system-nodejs-express-mysql/
const session = require("express-session")
const express = require("express")
const app = express()


app.listen(3000, () => {
    require('dns').lookup(require('os').hostname(), function(err, address, fam) {
        IP = address
        console.log("SERVER IN ASCOLTO su: " + IP + ":3000")
    })
})

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false
}));

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

app.get("/", (req, resp) => {
    let paginaRegoleSenzaFooter = fs.readFileSync("./sitoWeb/home.html", "utf-8")
    let paginaConFooter = aggiungiFooterAllaPagina(paginaRegoleSenzaFooter)
    let pagina = rimpiazzaLocalhostConIP(paginaConFooter)

    let jsDom = new JSDOM(pagina)

    if (req.session.loggato) {
        msgBenvenuto = "Benvenuto<br><i>" + req.session.nome + " " + req.session.cognome + "</i>"
        jsDom.window.document.getElementById("dropdownBtn").innerHTML = msgBenvenuto
        jsDom.window.document.getElementById("divDropdown").style.display = "inline-block"

        jsDom.window.document.getElementById("testataSito").setAttribute("class", "col-10 d-flex justify-content-center")
        jsDom.window.document.getElementById("menuUtente").setAttribute("class", "col-2")
    } else {
        jsDom.window.document.getElementById("testataSito").setAttribute("class", "col-12 d-flex justify-content-center")
    }
    resp.send(jsDom.window.document.documentElement.outerHTML)
})

app.get("/regole", (req, resp) => {
    let paginaRegoleSenzaFooter = fs.readFileSync("./sitoWeb/regole.html", "utf-8")
    let paginaConFooter = aggiungiFooterAllaPagina(paginaRegoleSenzaFooter)
    let pagina = rimpiazzaLocalhostConIP(paginaConFooter)

    resp.send(pagina)
})

app.get("/contattaci", (req, resp) => {
    let paginaRegoleSenzaFooter = fs.readFileSync("./sitoWeb/contactus.html", "utf-8")
    let paginaConFooter = aggiungiFooterAllaPagina(paginaRegoleSenzaFooter)
    let pagina = rimpiazzaLocalhostConIP(paginaConFooter)

    resp.send(pagina)
})

app.get("/profilo", (req, resp) => {
    //TODO fare una pagina per il profilo, con statistiche ecc.
    // DA "RIEMPIRE" QUI (o lì con ejs) ==> SERVE DB
    //resp.sendFile(__dirname + "/sitoWeb/profilo.html")
    resp.send("WORK IN PROGRESS")
})

app.get("/login", (req, resp) => {
    let pagina = fs.readFileSync("./sitoWeb/login.html", "utf-8")
    let paginaConIP = rimpiazzaLocalhostConIP(pagina)

    resp.send(paginaConIP)
})
app.post("/loginFatta", (req, resp) => {
    //TODO controlla se dati sono giusti (user e passw) ==> SERVE DATABASE
    //resp.sendFile(__dirname + "/sitoWeb/loginFatta.html")
    resp.send("WORK IN PROGRESS")
})
app.get("/esci", (req, resp) => {
    req.session.destroy()
        //301 è il codice http per il reindirizzamento (https://developer.mozilla.org/it/docs/Web/HTTP/Status)
    resp.redirect(301, "/")
})

app.get("/registrati", (req, resp) => {
    let pagina = fs.readFileSync("./sitoWeb/registrati.html", "utf-8")
    let paginaConIP = rimpiazzaLocalhostConIP(pagina)

    resp.send(paginaConIP)
})

app.post("/registrazioneFatta", (req, resp) => {
    //TODO ci sarebbe da aggiungere nel database l'utente
    req.session.loggato = true
    req.session.nome = req.body.nome
    req.session.cognome = req.body.cognome
        //301 è il codice http per il reindirizzamento (https://developer.mozilla.org/it/docs/Web/HTTP/Status)
    resp.redirect(301, "/")
})

app.get("/download", (req, resp) => {
    resp.sendFile(__dirname + "/GiocoPython.zip")
})


//----------------- gioco web ----------------------------------

app.get("/menuGioco", (req, resp) => {
    if (req.session.loggato) {

        let sito = fs.readFileSync("./webApp/menu/index.html", "utf-8")
        let sitoConIP = rimpiazzaLocalhostConIP(sito)

        let jsDom = new JSDOM(sitoConIP)

        msgBenvenuto = "Benvenuto<br><i>" + req.session.nome + " " + req.session.cognome + "</i>"
        jsDom.window.document.getElementById("dropdownBtn").innerHTML = msgBenvenuto
        jsDom.window.document.getElementById("divDropdown").style.display = "inline-block"
            /*130px è la larghezza del divDropdown. (devo usarlo per centrare l'img alla pagina)*/
        jsDom.window.document.getElementById("divImgTitolo").style.marginLeft = "130px"

        resp.send(jsDom.window.document.documentElement.outerHTML)
    } else {
        //301 è il codice http per il reindirizzamento (https://developer.mozilla.org/it/docs/Web/HTTP/Status)
        resp.redirect(301, "/")
    }
})

app.get("/start", (req, resp) => {
    if (req.session.loggato) {
        let sito = fs.readFileSync("./webApp/giocoWeb/scelta_oca.html", "utf-8")
        let sitoConIP = rimpiazzaLocalhostConIP(sito)

        resp.send(sitoConIP)
    } else {
        //301 è il codice http per il reindirizzamento (https://developer.mozilla.org/it/docs/Web/HTTP/Status)
        resp.redirect(301, "/")
    }
})

app.get("/options", (req, resp) => {
    if (req.session.loggato) {
        let sito = fs.readFileSync("./webApp/menu/options.html", "utf-8")
        let sitoConIP = rimpiazzaLocalhostConIP(sito)

        resp.send(sitoConIP)
    } else {
        //301 è il codice http per il reindirizzamento (https://developer.mozilla.org/it/docs/Web/HTTP/Status)
        resp.redirect(301, "/")
    }
})

app.get("/credits", (req, resp) => {
    if (req.session.loggato) {
        let sito = fs.readFileSync("./webApp/menu/credits.html", "utf-8")
        let sitoConIP = rimpiazzaLocalhostConIP(sito)

        resp.send(sitoConIP)
    } else {
        //301 è il codice http per il reindirizzamento (https://developer.mozilla.org/it/docs/Web/HTTP/Status)
        resp.redirect(301, "/")
    }
})

app.get("/gioco", (req, resp) => {
    if (req.session.loggato) {
        let sito = fs.readFileSync("./webApp/giocoWeb/index.html", "utf-8")
        let sitoConIP = rimpiazzaLocalhostConIP(sito)

        resp.send(sitoConIP)
    } else {
        //301 è il codice http per il reindirizzamento (https://developer.mozilla.org/it/docs/Web/HTTP/Status)
        resp.redirect(301, "/")
    }
})

app.use("*", (req, resp) => {
    resp.send("<center><h1>ERROR 404</h1></center>")
})