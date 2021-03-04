function draw_text(ctx, text, size, color, x, y) {
    ctx.font = size.toString() + "px Verdana";
    ctx.textAlign = "center"
    ctx.fillStyle = color
    ctx.fillText(text, x, y);
}

class Casella {
    constructor(context, x, y, raggioMaggiore = 40, raggioMinore = 25, rotazione = 0, angoloInizio = 0, angoloFine = Math.PI * 2) {
        this.ctx = context
        this.x = x
        this.y = y
        this.width = raggioMaggiore * 2
        this.height = raggioMinore * 2

        this.ctx.beginPath()
        this.ctx.ellipse(x, y, raggioMaggiore, raggioMinore, rotazione, angoloInizio, angoloFine)
        this.ctx.stroke()
    }

    settaEffetto(codCasella) {
        //Metodo con il inserisco il testo relativo al codCasella associato
        // nella casella, cioè l'effetto
        let testo = ""
        if (codCasella == TIRA_DI_NUOVO[0]) {
            testo = "Ri-tira\nil dado"
        } else if (codCasella == INDIETRO_DI_UNO[0]) {
            testo = "Indetro\ndi 1"
        } else if (codCasella == INDIETRO_DI_TRE[0]) {
            testo = "Indietro\ndi 3"
        } else if (codCasella == AVANTI_DI_UNO[0]) {
            testo = "Avanti\ndi 1 !"
        } else if (codCasella == AVANTI_DI_QUATTRO[0]) {
            testo = "Avanti\ndi 4 !"
        } else if (codCasella == FERMO_DA_UNO[0]) {
            testo = "Fermo\nun giro"
        } else if (codCasella == FERMO_DA_DUE[0]) {
            testo = "Fermo\ndue giri"
        } else if (codCasella == TORNA_ALL_INIZIO) {
            testo = "Torna\nall'inizio !"
        } else if (codCasella == VITTORIA) {
            testo = "HAI\nVINTO !!!"
        }

        if (testo != "") {
            //CON il CANVAS NON SI POSSONO SCRIVERE STRINGHE CON DEGLI A CAPO
            // BISOGNA SPEZZARE E FARE PIÙ "AREE DI TESTO"
            let text = testo.split("\n")
                //N.B. SONO SICURO CHE text AVRÀ SOLO 2 RIGHE XKÈ SO COSA PUç CONTENERE "testo"
                // QUINDI QUESTO NON FUNZIONA CON FRASI CON PIÙ DI 1 "\n"

            draw_text(this.ctx, text[0], 13, "#000000", this.getCenterX(), this.getCenterY() - 2.5)
            draw_text(this.ctx, text[1], 13, "#000000", this.getCenterX(), this.getCenterY() + 7.5)
        }

    }

    //Con il canvas disegniamo l'ellise alle coordinate x|y. Al contrario di pygame l'ellisse con il canvas viene disegnato a partire dal CENTRO, quindi in pygame le coordinate x|y si riferiscono all'angolo in alto a sx dell'oggetto, qui invece si riferiscono al centro dell'ellisse 
    getCenterX() {
        return this.x
    }
    getCenterY() {
        return this.y
    }

}