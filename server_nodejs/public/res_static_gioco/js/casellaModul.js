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

        this.numeroCasella = null

        if (indice > 0) {
            this.questaCasella = document.getElementById(("_" + indice))
            this.numeroCasella = document.getElementById(("-" + indice))
        } else {
            //prendo la casella iniziale dei giocatori
            if (indice == 0) {
                this.questaCasella = document.getElementById("inizPL1")
            } else if (indice == -1) {
                this.questaCasella = document.getElementById("inizCOM")
            }
        }

        if (casellaVittoria) { //dimensioni e posizione diverse se è la casella vittoria
            this.width = 120
            this.height = 100
            this.y = this.y - 20
        }
        this.questaCasella.style.width = this.width + "px"
        this.questaCasella.style.height = this.height + "px"
        this.questaCasella.style.position = "absolute"
        this.questaCasella.style.left = this.x + "px"
        this.questaCasella.style.top = this.y + "px"

        if (this.numeroCasella != null) {
            this.numeroCasella.style.position = "absolute"
                //centra il numero di casella nella casella (orizzontalmente)
            this.numeroCasella.style.left = (this.getCenterX() - (15 / 2)) + "px"
            this.numeroCasella.style.top = this.y + "px"
        } //else questo oggetto Casella è la casella iniziale dei giocatori
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

        let x = document.createElement("LABEL")
        x.innerHTML = testo
            //per allineare verticalmente (insieme a "display:table;" nella classe CSS "caselle")
        x.style.display = "table-cell"
        x.style.verticalAlign = "middle"
        x.style.fontWeight = "bold"
            //aggiunto al div della casella l'effetto della casella
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