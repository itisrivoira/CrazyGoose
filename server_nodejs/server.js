const express = require("express")
const app = express()


app.listen("3000", () => {})
app.use(express.static("public"))

app.get("/", (req, resp) => {
    resp.sendFile(__dirname + "/sitoWeb/index.html")
})

app.get("/regole", (req, resp) => {
    resp.sendFile(__dirname + "/sitoWeb/regole.html")
})

app.get("/contattaci", (req, resp) => {
    resp.sendFile(__dirname + "/sitoWeb/contactus.html")
})
app.post("/invioEmail", (req, resp) => {
    resp.sendFile(__dirname + "/sitoWeb/send.php")
})

app.get("/login", (req, resp) => {
    resp.sendFile(__dirname + "/sitoWeb/login.html")
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



app.get("/menuGioco", (req, resp) => {
    resp.sendFile(__dirname + "/webApp/menu/index.html")
})

app.get("/start", (req, resp) => {
    resp.sendFile(__dirname + "/webApp/giocoWeb/scelta_oca.html")
})

app.get("/options", (req, resp) => {
    resp.sendFile(__dirname + "/webApp/menu/options.html")
})

app.get("/credits", (req, resp) => {
    resp.sendFile(__dirname + "/webApp/menu/credits.html")
})

app.get("/gioco", (req, resp) => {
    resp.sendFile(__dirname + "/webApp/giocoWeb/index.html")
})