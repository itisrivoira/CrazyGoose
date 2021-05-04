var IP = null

const fs = require("fs")
const bodyParser = require("body-parser")
const jsdom = require("jsdom")
    //destrutturazione (prendo solo quello che mi serve)
const { JSDOM } = jsdom

const express = require("express")
const app = express()


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


app.get("/passaAPaginaPHP", (req, resp) => {
    let pagina = fs.readFileSync("./sitoWeb/passaAPaginaPHP.html", "utf-8")

    let jsDom = new JSDOM(pagina)

    jsDom.window.document.getElementById("chePagina").innerHTML = req.query.pagina

    resp.send(rimpiazzaLocalhostConIP(jsDom.window.document.documentElement.outerHTML))
})



app.get("/", (req, resp) => {
    let pagina = fs.readFileSync("./sitoWeb/passaAPaginaPHP.html", "utf-8")

    let jsDom = new JSDOM(pagina)

    jsDom.window.document.getElementById("chePagina").innerHTML = "sitoWeb/phpFiles/logout"

    resp.send(rimpiazzaLocalhostConIP(jsDom.window.document.documentElement.outerHTML))
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
    //resp.send("WORK IN PROGRESS")
    resp.sendFile(__dirname + "/fanculo.html", "utf-8")
})

app.get("/login", (req, resp) => {
    let pagina = fs.readFileSync("./sitoWeb/login.html", "utf-8")
    let paginaConIP = rimpiazzaLocalhostConIP(pagina)

    resp.send(paginaConIP)
})

app.get("/esci", (req, resp) => {
    let pagina = fs.readFileSync("./sitoWeb/passaAPaginaPHP.html", "utf-8")

    let jsDom = new JSDOM(pagina)

    jsDom.window.document.getElementById("chePagina").innerHTML = "sitoWeb/phpFiles/logout"

    resp.send(rimpiazzaLocalhostConIP(jsDom.window.document.documentElement.outerHTML))
})

app.get("/registrati", (req, resp) => {
    let pagina = fs.readFileSync("./sitoWeb/registrati.html", "utf-8")
    let paginaConIP = rimpiazzaLocalhostConIP(pagina)

    resp.send(paginaConIP)
})

app.get("/download", (req, resp) => {
    resp.sendFile(__dirname + "/GiocoPython.zip")
})

//----------------- gioco web ----------------------------------

app.get("/crazyGoose", (req, resp) => {
    //TODO: sarà loggato o ha solo cambiato url nella barra degli indirizzi ???
    let pagina = fs.readFileSync("./sitoWeb/passaAPaginaPHP.html", "utf-8")
    let jsDom = new JSDOM(pagina)

    jsDom.window.document.getElementById("chePagina").innerHTML = "webApp/giocoWeb/gioco"

    resp.send(rimpiazzaLocalhostConIP(jsDom.window.document.documentElement.outerHTML))
})

app.get("/start", (req, resp) => {
    //TODO: sarà loggato o ha solo cambiato url nella barra degli indirizzi ???
    let pagina = fs.readFileSync("./sitoWeb/passaAPaginaPHP.html", "utf-8")
    let jsDom = new JSDOM(pagina)

    jsDom.window.document.getElementById("chePagina").innerHTML = "webApp/giocoWeb/scelta_oca"

    resp.send(rimpiazzaLocalhostConIP(jsDom.window.document.documentElement.outerHTML))
})

app.get("/options", (req, resp) => {
    //TODO: sarà loggato o ha solo cambiato url nella barra degli indirizzi ???
    let sito = fs.readFileSync("./webApp/menu/options.html", "utf-8")
    let sitoConIP = rimpiazzaLocalhostConIP(sito)

    resp.send(sitoConIP)
})

app.get("/credits", (req, resp) => {
    //TODO: sarà loggato o ha solo cambiato url nella barra degli indirizzi ???
    let sito = fs.readFileSync("./webApp/menu/credits.html", "utf-8")
    let sitoConIP = rimpiazzaLocalhostConIP(sito)

    resp.send(sitoConIP)
})

app.use("*", (req, resp) => {
    resp.send("<center><h1>ERROR 404</h1></center>")
})