const fs = require("fs")
const bodyParser = require("body-parser")
const jsdom = require("jsdom")
    //destrutturazione (prendo solo quello che mi serve)
const { JSDOM } = jsdom

const express = require("express")
const app = express()


app.listen("3000", () => {
    //console.log("SERVER IN FUNZIONE")
})
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

app.use(express.static("public"))

app.get("/", (req, resp) => {
    resp.sendFile(__dirname + "/sitoWeb/index.html")
        //console.log("Entrato in sito web")
})



app.get("/regole", (req, resp) => {
    resp.sendFile(__dirname + "/sitoWeb/regole.html")
        //console.log("Entrato in sezione regole")
})

app.get("/contattaci", (req, resp) => {
    resp.sendFile(__dirname + "/sitoWeb/contactus.html")
        //console.log("Entrato in Contattaci")
})
app.post("/invioEmail", (req, resp) => {
    resp.sendFile(__dirname + "/sitoWeb/send.php")
})

app.get("/login", (req, resp) => {
    resp.sendFile(__dirname + "/sitoWeb/login.html")
        //console.log("Entrato in LOGIN")
})
app.post("/loginFatta", (req, resp) => {
    //se dati sono giusti (user e passw) ==> TODO SERVE DATABASE
    //resp.sendFile(__dirname + "/sitoWeb/loginFatta.html")
    resp.send("WORK IN PROGRESS")
})

app.get("/registrati", (req, resp) => {
    resp.sendFile(__dirname + "/sitoWeb/registrati.html")
})

app.post("/registrazioneFatta", (req, resp) => {

    //salvare tutti i dati ==> TODO SERVE DATABASE
    //resp.sendFile(__dirname + "/sitoWeb/registrazioneFatta.html")
    resp.send("WORK IN PROGRESS")
})


app.get("/meuGioco", (req, resp) => {
    resp.sendFile(__dirname + "/webApp / menu / index.html ")
        //console.log("Entrato in menu del gioco")
})
app.post("/menuGioco", (req, resp) => {
    let sito = fs.readFileSync("./webApp/menu/index.html", "utf-8")

    let jsDom = new JSDOM(sito)

    let nome = req.body.nome
    let cognome = req.body.cognome

    msgBenvenuto = "Benvenuto<br><i>" + nome + " " + cognome + "</i>"
    jsDom.window.document.getElementById("dropdownBtn").innerHTML = msgBenvenuto
    jsDom.window.document.getElementById("divDropdown").style.display = "inline-block"

    resp.send(jsDom.window.document.documentElement.outerHTML)
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