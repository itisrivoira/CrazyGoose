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
    //console.log("SERVER IN FUNZIONE")
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

app.get("/", (req, resp) => {
    if (req.session.loggato) {
        let sito = fs.readFileSync("./sitoWeb/home.html", "utf-8")

        let paginaConFooter = aggiungiFooterAllaPagina(sito)

        let jsDom = new JSDOM(paginaConFooter)

        msgBenvenuto = "Benvenuto<br><i>" + req.session.nome + " " + req.session.cognome + "</i>"
        jsDom.window.document.getElementById("dropdownBtn").innerHTML = msgBenvenuto
        jsDom.window.document.getElementById("divDropdown").style.display = "inline-block"

        jsDom.window.document.getElementById("testataSito").setAttribute("class", "col-10 d-flex justify-content-center")
        jsDom.window.document.getElementById("menuUtente").setAttribute("class", "col-2")

        resp.send(jsDom.window.document.documentElement.outerHTML)
    } else {
        let sito = fs.readFileSync("./sitoWeb/home.html", "utf-8")

        let paginaConFooter = aggiungiFooterAllaPagina(sito)

        let jsDom = new JSDOM(paginaConFooter)

        jsDom.window.document.getElementById("testataSito").setAttribute("class", "col-12 d-flex justify-content-center")

        resp.send(jsDom.window.document.documentElement.outerHTML)
    }
    //console.log("Entrato in sito web")
})

app.get("/regole", (req, resp) => {
    let paginaRegoleSenzaFooter = fs.readFileSync("./sitoWeb/regole.html", "utf-8")

    let paginaConFooter = aggiungiFooterAllaPagina(paginaRegoleSenzaFooter)

    resp.send(paginaConFooter)
        //console.log("Entrato in sezione regole")
})

app.get("/contattaci", (req, resp) => {
    let paginaRegoleSenzaFooter = fs.readFileSync("./sitoWeb/contactus.html", "utf-8")

    let paginaConFooter = aggiungiFooterAllaPagina(paginaRegoleSenzaFooter)

    resp.send(paginaConFooter)
        //console.log("Entrato in Contattaci")
})

app.get("/profilo", (req, resp) => {
    //TODO fare una pagina per il profilo, con statistiche ecc.
    // DA "RIEMPIRE" QUI (o lì con ejs) ==> SERVE DB
    //resp.sendFile(__dirname + "/sitoWeb/profilo.html")
    resp.send("WORK IN PROGRESS")
})

app.get("/login", (req, resp) => {
    resp.sendFile(__dirname + "/sitoWeb/login.html")
        //console.log("Entrato in LOGIN")
})
app.post("/loginFatta", (req, resp) => {
    //TODO controlla se dati sono giusti (user e passw) ==> SERVE DATABASE
    //resp.sendFile(__dirname + "/sitoWeb/loginFatta.html")
    resp.send("WORK IN PROGRESS")
})
app.get("/esci", (req, resp) => {
    req.session.loggato = false
    req.session.nome = null
    req.session.cognome = null
        //301 è il codice http per il reindirizzamento (https://developer.mozilla.org/it/docs/Web/HTTP/Status)
    resp.redirect(301, "/")
})

app.get("/registrati", (req, resp) => {
    resp.sendFile(__dirname + "/sitoWeb/registrati.html")
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

        let jsDom = new JSDOM(sito)

        msgBenvenuto = "Benvenuto<br><i>" + req.session.nome + " " + req.session.cognome + "</i>"
        jsDom.window.document.getElementById("dropdownBtn").innerHTML = msgBenvenuto
        jsDom.window.document.getElementById("divDropdown").style.display = "inline-block"
            /*130px è la larghezza del divDropdown. (devo usarlo per centrare l'img alla pagina)*/
        jsDom.window.document.getElementById("divImgTitolo").style.marginLeft = "130px"

        resp.send(jsDom.window.document.documentElement.outerHTML)
            //console.log("Entrato in menu del gioco")
    } else {
        //301 è il codice http per il reindirizzamento (https://developer.mozilla.org/it/docs/Web/HTTP/Status)
        resp.redirect(301, "/")
    }
    //console.log("Entrato in menu del gioco")
})

app.get("/start", (req, resp) => {
    resp.sendFile(__dirname + "/webApp/giocoWeb/scelta_oca.html")
        //console.log("Entrato nella scelta della pedina")
})

app.get("/options", (req, resp) => {
    resp.sendFile(__dirname + "/webApp/menu/options.html")
})

app.get("/credits", (req, resp) => {
    resp.sendFile(__dirname + "/webApp/menu/credits.html")
})

app.get("/gioco", (req, resp) => {
    resp.sendFile(__dirname + "/webApp/giocoWeb/index.html")
        //console.log("Scelto pedina")
})

app.use("*", (req, resp) => {
    resp.send("<center>ERROR 404</center>")
})
