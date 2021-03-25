class Casella {
    constructor(indice, x, y, casellaVittoria, width = 90, height = 60) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height

        if (indice > 0) {
            this.questaCasella = document.getElementById(("_" + indice))
        } else {
            //casella iniziale dei giocatori
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

        if (casellaVittoria) {
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
            testo = "Ri-tira il dado"
        } else if (codCasella == INDIETRO_DI_UNO[0]) {
            testo = "Indetro di 1"
        } else if (codCasella == INDIETRO_DI_TRE[0]) {
            testo = "Indietro di 3"
        } else if (codCasella == AVANTI_DI_UNO[0]) {
            testo = "Avanti di 1 !"
        } else if (codCasella == AVANTI_DI_QUATTRO[0]) {
            testo = "Avanti di 4 !"
        } else if (codCasella == FERMO_DA_UNO[0]) {
            testo = "Fermo un giro"
        } else if (codCasella == FERMO_DA_DUE[0]) {
            testo = "Fermo due giri"
        } else if (codCasella == TORNA_ALL_INIZIO) {
            testo = "Torna all'inizio !"
        } else if (codCasella == VITTORIA) {
            testo = "HAI VINTO !!!"
        }

        let x = document.createElement("LABEL")
        x.innerHTML = testo
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