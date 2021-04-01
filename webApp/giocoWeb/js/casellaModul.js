class Casella {
    constructor(indice, x, y, casellaVittoria, width = 90, height = 60) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height


        if (indice > 0) {
            this.questaCasella = document.getElementById(("_" + indice))
        } else {
            //prendo la casella iniziale dei giocatori
            if (indice == 0) {
                this.questaCasella = document.getElementById("inizPL1")
            } else if (indice == -1) {
                this.questaCasella = document.getElementById("inizCOM")
            }
        }

        this.questaCasella.style.width = width + "px"
        this.questaCasella.style.height = height + "px"
        this.questaCasella.style.position = "absolute"
        this.questaCasella.style.left = x + "px"
        this.questaCasella.style.top = y + "px"


        if (casellaVittoria) { //dimensioni diverse se è la casella iniziale
            this.questaCasella.style.width = "120px"
            this.questaCasella.style.height = "100px"
            this.questaCasella.style.left = x + "px"
            this.questaCasella.style.top = y - 20 + "px"
        }
    }

    settaEffetto(codCasella) {
        //Metodo con il inserisco il testo relativo al codCasella associato
        // nella casella, cioè l'effetto
        let testo = ""
        if (codCasella == TIRA_DI_NUOVO[0]) {
            testo = "X2"
        } else if (codCasella == INDIETRO_DI_UNO[0]) {
            testo = "-1"
        } else if (codCasella == INDIETRO_DI_TRE[0]) {
            testo = "-3"
        } else if (codCasella == AVANTI_DI_UNO[0]) {
            testo = "+1"
        } else if (codCasella == AVANTI_DI_QUATTRO[0]) {
            testo = "+4"
        } else if (codCasella == FERMO_DA_UNO[0]) {
            testo = "ALT"
        } else if (codCasella == FERMO_DA_DUE[0]) {
            testo = "ALT X2"
        } else if (codCasella == TORNA_ALL_INIZIO) {
            testo = "DA CAPO !"
        } else if (codCasella == VITTORIA) {
            testo = "HAI VINTO !!!"
        }

        let x = document.createElement("LABEL")
        x.innerHTML = testo
            //per allineare verticalmente (insieme a "display:table;" nella classe CSS "caselle")
        x.style.display = "table-cell"
        x.style.verticalAlign = "middle"
            //aggiunto al div della casella l'effetto della casella
        this.questaCasella.appendChild(x)
    }

    getCenterX() {
        return this.x + this.width / 2
    }
    getCenterY() {
        return this.y + this.height / 2
    }

    nascondi() {
        this.questaCasella.style.display = "none"
    }

}