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

    jsDom.window.document.getElementById("percorso").innerHTML = req.query.pagina

    resp.send(rimpiazzaLocalhostConIP(jsDom.window.document.documentElement.outerHTML))
})


app.get("/esci", (req, resp) => {
    let pagina = fs.readFileSync("./sitoWeb/passaAPaginaPHP.html", "utf-8")

    let jsDom = new JSDOM(pagina)

    jsDom.window.document.getElementById("percorso").innerHTML = "sitoWeb/phpFiles/logout"

    resp.send(rimpiazzaLocalhostConIP(jsDom.window.document.documentElement.outerHTML))
})

app.get("/", (req, resp) => {
    //porta alla home DOPO AVER FATTO IL LOGOUT
    //(la home, essendo in php, si raggiunge con passaAPaginaPHP?pagina=sitoWeb/phpPages/home)
    let pagina = fs.readFileSync("./sitoWeb/passaAPaginaPHP.html", "utf-8")

    let jsDom = new JSDOM(pagina)

    jsDom.window.document.getElementById("percorso").innerHTML = "sitoWeb/phpFiles/logout"

    resp.send(rimpiazzaLocalhostConIP(jsDom.window.document.documentElement.outerHTML))
})

app.get("/regole", (req, resp) => {
    let paginaRegoleSenzaFooter = fs.readFileSync("./sitoWeb/regole.html", "utf-8")
    let paginaConFooter = aggiungiFooterAllaPagina(paginaRegoleSenzaFooter)
    let pagina = rimpiazzaLocalhostConIP(paginaConFooter)

    resp.send(pagina)
})

app.get("/profilo", (req, resp) => {
    let pagina = fs.readFileSync("./sitoWeb/passaAPaginaPHP.html", "utf-8")

    let jsDom = new JSDOM(pagina)

    jsDom.window.document.getElementById("percorso").innerHTML = "sitoWeb/phpPages/profilo"

    resp.send(rimpiazzaLocalhostConIP(jsDom.window.document.documentElement.outerHTML))
})

app.get("/accedi", (req, resp) => {
    let pagina = fs.readFileSync("./sitoWeb/accedi.html", "utf-8")
    let paginaConIP = rimpiazzaLocalhostConIP(pagina)

    let erroreLogin = req.query.err
    let jsDom = new JSDOM(paginaConIP)
    jsDom.window.document.getElementById("passEmailScorretti").style.display = "block";

    if (erroreLogin == undefined) {
        jsDom.window.document.getElementById("passEmailScorretti").style.display = "none";
    }

    resp.send(jsDom.window.document.documentElement.outerHTML)
})

app.get("/registrati", (req, resp) => {
    let pagina = fs.readFileSync("./sitoWeb/registrati.html", "utf-8")
    let paginaConIP = rimpiazzaLocalhostConIP(pagina)

    let erroreLogin = req.query.err
    let jsDom = new JSDOM(paginaConIP)
    jsDom.window.document.getElementById("emailGiaUsata").style.display = "block";

    if (erroreLogin == undefined) {
        jsDom.window.document.getElementById("emailGiaUsata").style.display = "none";
    }

    resp.send(jsDom.window.document.documentElement.outerHTML)
})

app.get("/download", (req, resp) => {
    resp.sendFile(__dirname + "/downloads/GiocoPython.zip")
})
app.get("/guida", (req, resp) => {
    resp.sendFile(__dirname + "/downloads/DOC_CrazyGoose.pdf")
})

//----------------- gioco web ----------------------------------

app.get("/crazyGoose", (req, resp) => {
    let pagina = fs.readFileSync("./sitoWeb/passaAPaginaPHP.html", "utf-8")
    let jsDom = new JSDOM(pagina)

    jsDom.window.document.getElementById("percorso").innerHTML = "webApp/giocoWeb/gioco"

    resp.send(rimpiazzaLocalhostConIP(jsDom.window.document.documentElement.outerHTML))
})

app.get("/start", (req, resp) => {
    let pagina = fs.readFileSync("./sitoWeb/passaAPaginaPHP.html", "utf-8")
    let jsDom = new JSDOM(pagina)

    jsDom.window.document.getElementById("percorso").innerHTML = "webApp/giocoWeb/scelta_oca"

    resp.send(rimpiazzaLocalhostConIP(jsDom.window.document.documentElement.outerHTML))
})

app.get("/credits", (req, resp) => {
    let sito = fs.readFileSync("./webApp/menu/credits.html", "utf-8")
    let sitoConIP = rimpiazzaLocalhostConIP(sito)

    resp.send(sitoConIP)
})

app.use("*", (req, resp) => {
    resp.send("<center><h1>ERROR 404</h1></center>")
})
