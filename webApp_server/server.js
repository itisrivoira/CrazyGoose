const express = require("express")
const app = express()


app.listen("3000", () => {})
app.use(express.static("public"))

app.get("/", (req, resp) => {
    resp.sendFile(__dirname + "/menu/index.html")
})

app.get("/start", (req, resp) => {
    resp.sendFile(__dirname + "/giocoWeb/scelta_oca.html")
})

app.get("/options", (req, resp) => {
    resp.sendFile(__dirname + "/menu/options.html")
})

app.get("/credits", (req, resp) => {
    resp.sendFile(__dirname + "/menu/credits.html")
})