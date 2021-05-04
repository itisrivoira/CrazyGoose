const BG_COLOR_MENO1 = "#faa046"
const BG_COLOR_MENO3 = "#c8501e"
const BG_COLOR_PIU1 = "#1ebe1e"
const BG_COLOR_PIU4 = "#148714"
const BG_COLOR_FERMO1 = "#DC3C3C"
const BG_COLOR_FERMO2 = "#DC0000"
const BG_COLOR_X2 = "#aaff00"
const BG_COLOR_DACAPO = "#FF0000"
const BG_COLOR_VITTORIA = "#328CE6"

class Casella {
    constructor(indice, x, y, casellaVittoria, width = 90, height = 60) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.indice = indice

        this.numeroCasella = null

        if (indice > 0) {
            this.questaCasella = document.getElementById(("_" + indice))
            this.numeroCasella = document.getElementById(("-" + indice))

            if (indice != 40) {
                //ad es. da "100px" ==> mi devo togliere quel "px" e trasformare il tutto in intero
                let pos = getComputedStyle(document.querySelector(".caselle")).width
                this.width = parseInt(pos.slice(0, pos.length - 2))
                pos = getComputedStyle(document.querySelector(".caselle")).height
                this.height = parseInt(pos.slice(0, pos.length - 2))
            } else {
                let pos = getComputedStyle(document.querySelector(".casella40")).width
                this.width = parseInt(pos.slice(0, pos.length - 2))
                pos = getComputedStyle(document.querySelector(".casella40")).height
                this.height = parseInt(pos.slice(0, pos.length - 2))
            }

        } else {
            //prendo la casella iniziale dei giocatori
            if (indice == 0) {
                this.questaCasella = document.getElementById("inizPL1")
            } else { //indice == -1
                this.questaCasella = document.getElementById("inizCOM")
            }
            //ad es. da "100px" ==> mi devo togliere quel "px" e trasformare il tutto in intero
            let pos = getComputedStyle(document.querySelector(".caselleIniziali")).width
            this.width = parseInt(pos.slice(0, pos.length - 2))
            pos = getComputedStyle(document.querySelector(".caselleIniziali")).height
            this.height = parseInt(pos.slice(0, pos.length - 2))
        }
        this.x = this.questaCasella.getBoundingClientRect().left
        this.y = this.questaCasella.getBoundingClientRect().top
    }

    settaEffetto(codCasella) {
        //Metodo con il inserisco il testo relativo al codCasella associato
        // nella casella, cioè l'effetto
        let testo = ""
        if (codCasella == TIRA_DI_NUOVO[0]) {
            testo = TIRA_DI_NUOVO[2]
            this.questaCasella.style.background = BG_COLOR_X2

        } else if (codCasella == INDIETRO_DI_UNO[0]) {
            testo = INDIETRO_DI_UNO[2]
            this.questaCasella.style.background = BG_COLOR_MENO1

        } else if (codCasella == INDIETRO_DI_TRE[0]) {
            testo = INDIETRO_DI_TRE[2]
            this.questaCasella.style.background = BG_COLOR_MENO3

        } else if (codCasella == AVANTI_DI_UNO[0]) {
            testo = AVANTI_DI_UNO[2]
            this.questaCasella.style.background = BG_COLOR_PIU1

        } else if (codCasella == AVANTI_DI_QUATTRO[0]) {
            testo = AVANTI_DI_QUATTRO[2]
            this.questaCasella.style.background = BG_COLOR_PIU4

        } else if (codCasella == FERMO_DA_UNO[0]) {
            testo = FERMO_DA_UNO[2]
            this.questaCasella.style.background = BG_COLOR_FERMO1

        } else if (codCasella == FERMO_DA_DUE[0]) {
            testo = FERMO_DA_DUE[2]
            this.questaCasella.style.background = BG_COLOR_FERMO2

        } else if (codCasella == TORNA_ALL_INIZIO[0]) {
            testo = TORNA_ALL_INIZIO[1]
            this.questaCasella.style.background = BG_COLOR_DACAPO
            this.questaCasella.style.fontSize = "15px"

        } else if (codCasella == VITTORIA[0]) {
            testo = VITTORIA[1]
            this.questaCasella.style.background = BG_COLOR_VITTORIA
            this.questaCasella.style.fontSize = "15px"
        }

        let x = document.createElement("DIV")
        x.style.textAlign = "center"
        x.style.float = "left"
        if (codCasella != TORNA_ALL_INIZIO[0]) {
            x.style.marginLeft = "30px"
        } else {
            x.style.marginLeft = "5px"
        }

        if (this.indice == 18 || this.indice == 34) {

            x.style.marginLeft = "5px"
            x.style.marginTop = this.height - 30 + "px"

        } else if (this.indice == 12 || this.indice == 22 || this.indice == 30 || this.indice == 36) {
            x.style.marginTop = this.height - 50 + "px"

            if (codCasella == FERMO_DA_UNO[0]) {
                x.style.marginLeft = this.width - 50 + "px"
            } else if (codCasella == FERMO_DA_DUE[0]) {
                x.style.marginLeft = this.width - 105 + "px"
                x.style.marginTop = this.height - 30 + "px"
            } else {
                x.style.marginLeft = this.width - 35 + "px"
            }

        } else if (this.indice == 7 || this.indice == 27) {

            if (codCasella == FERMO_DA_UNO[0]) {
                x.style.marginLeft = "75px"
            } else if (codCasella == FERMO_DA_DUE[0]) {
                x.style.marginLeft = "38px"
            } else {
                x.style.marginLeft = "95px"
            }

        } else if (this.indice == 40) {
            x.style.marginLeft = "95px"
            x.style.marginTop = "20px"
        }

        let text = document.createElement("label")
        text.innerHTML = testo

        text.style.fontSize = "20px"
        text.style.fontWeight = "bold"
        if (this.indice == 40) {
            text.style.fontSize = "40px"
        }

        x.appendChild(text)
        this.questaCasella.appendChild(x)
    }

    getCenterX() {
        return this.x + this.width / 2
    }
    getCenterY() {
        return this.y + this.height / 2
    }

    nascondi() { //mi serve per le casella iniziali
        this.questaCasella.style.display = "none"
    }

}