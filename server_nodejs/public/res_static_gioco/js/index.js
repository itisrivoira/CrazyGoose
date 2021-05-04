let game = new CrazyGoose()
game.start()
var partenza = Date.now()
var fine = null
var durata = 0
var numMosse = 0

function finePartita(pl1_ha_vinto, ) {
    fine = Date.now()
        //nasconde l'intero gioco
        /*document.getElementById("gioco").style.display = "none"
        if (pl1_ha_vinto) {
            document.getElementById("vittoria").style.display = "block"
        } else {
            document.getElementById("sconfitta").style.display = "block"
        }*/
        //devo prendere l'IP del server... nel gioco ho UN link verso la home, lo prendo da li
    let href = (document.links[0].href)
        //http://IP:3000  ==> mi tiro fuori solo l'IP
    let IP = href.slice(7, href.indexOf(":3000"))

    //minuti#secondi
    durata = ((fine - partenza) / 1000 / 60) + "#" + ((fine - partenza) / 1000 % 60)
    numMosse = game.player.dadiLanciati
    alert(numMosse)
    location.replace("http://" + IP + ":80/progetti/CrazyGoose/server_nodejs/webApp/giocoWeb/finePartita?flag=true")
}