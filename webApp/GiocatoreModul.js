//x/y delle CASELLE INIZIALI dei due giocatori
const X_PLAYER1 = 45
const X_PLAYER2 = 45
const Y_PLAYER1 = 540
const Y_PLAYER2 = 605

/*Metodo per disegnare testo (per scrivere) con un
 determinato font, dimensione e colore, il tutto
 centrato in un rettangolo alle coordinate passate*/

function draw_text(ctx, text, size, color, x, y) {
    ctx.font = size + "px Arial"
    ctx.fillStyle = color
    ctx.textAlign = "center"
    ctx.fillText(text, x, y)
}

class Giocatore {
    constructor(crazyGoose, ctx, caselle, percorso, tag) {
        //Mi serve per lanciare un suo metodo
        this.crazyGoose = crazyGoose
        this.ctx = ctx
        this.caselle = caselle
        this.percorso = percorso
        this.tag = tag

        this.posizione = 0
        this.turnoMio = false
        this.turniFermo = 0
        this.vincitore = false

        this.creaCasellaIniziale()
    }

    creaCasellaIniziale() {
        let x = 0
        let y = 0
        if (this.tag == "PL1") {
            x = X_PLAYER1
            y = Y_PLAYER1
        } else {
            x = X_PLAYER2
            y = Y_PLAYER2
        }

        //crea e posiziona l'ellisse (la casella) prima dell'inizio del percorso
        // poi inserisce la scritta che identifica il giocatore
        this.casellaIniziale = new Casella(this.ctx, x, y)

        draw_text(this.ctx, this.tag, 12, "#ff0000", this.casellaIniziale.getCenterX(), this.casellaIniziale.getCenterY())
    }

    posiziona(spostamento) {
        //Controlla che con il numero che ha fatto non "esca" dal percorso
        if (this.posizione + spostamento <= QTA_CASELLE_TOTALI) {
            //aggiorno la posizione
            this.posizione += spostamento
            try {
                //prendo il codice della casella in cui si trova il giocatore 
                let codCasella = this.percorso.dictCaselle[this.posizione]
                this.ridisegnaTutto()
                    //Controlla l'effetto contenuto nella casella
                this.controllaCodiceCasella(codCasella)
            } catch (err) {
                //Non ha trovato quella posizione nel dizionario, perciò dev'essere una casella VUOTA
                this.ridisegnaTutto()
            }


        } else {
            //Calcolo lo spostamento che dovrà fare dalla casella attuale
            newSpostamento = (QTA_CASELLE_TOTALI - (spostamento - (QTA_CASELLE_TOTALI - this.posizione))) - this.posizione
                //( se servisse mai la posizione della casella in cui finirà... è newSpostamento+this.posizione
                // (cioè il calcolo qua sopra senza quel "- this.posizione") )

            //Riposiziona il giocatore
            this.posiziona(newSpostamento)
        }
    }

    ridisegnaTutto() {
        //Da trovare modo per stoppare mezzo secondo tutto per far capire all'utente cosa sta succedendo (se il giocatore finisce su +4 va SUBITO avanti di 4 caselle senza nenche far capire che la pedina è andata sul +4)
        this.crazyGoose.disegnaTutto()
    }


    spostaPedina(posAvvessario) {
        if (this.posizione > 0) {
            let x = this.caselle[this.posizione - 1].getCenterX()
            let y = this.caselle[this.posizione - 1].getCenterY()

            if (posAvvessario == this.posizione) {
                if (this.tag == "PL1") {
                    //più in alto
                    y -= 20
                } else {
                    //più in basso
                    y += 20
                }
            }
            draw_text(this.ctx, this.tag, 12, "#ff0000", x, y)
        }
    }

    avanza(spostamento) {
        /*Di default appena si muove, il giocatore ha finito il turno e quindi setto
        	subito turnoMio = False, tuttavia potrebbe essere risettato a True se il
        	giocatore finisce sulla casella TIRA_DI_NUOVO*/
        this.turnoMio = false
        this.posiziona(spostamento)

        //Ritorna indietro il flag, in questo modo si saprà a chi toccherà
        return this.turnoMio
    }

    controllaCodiceCasella(codCasella) {
        /*
        In questo metodo controllo l'effetto della casella su cui è capitato
         il giocatore. Setto lo spostamento a 0 xkè l'effetto potrebbe lasciare lì
         dov'è il giocatore (come il fermo e il tira_di_nuovo), se invece lo
         spostamento cambia (!= 0) vorrà dire che è capitato
         su una casella che fa muovere il giocatore ==> richiamo di nuovo il "this.posiziona()"
        */

        //TODO!!!PRINT DI CONTROLLO DA SOSTITUIRE CON AVVISO AL GIOCATORE OPPURE TOGLIERE PROPRIO
        let spostamento = 0

        if (codCasella == TIRA_DI_NUOVO[0]) {
            console.log("TIRA ANCORA IL DADO " + this.tag)
            this.turnoMio = true

        } else if (codCasella == INDIETRO_DI_UNO[0]) {

            spostamento = -1
            console.log("INDIETRO DI UNA CASELLA " + this.tag)

        } else if (codCasella == INDIETRO_DI_TRE[0]) {

            spostamento = -3
            console.log("INDIETRO DI TRE CASELLA " + this.tag)

        } else if (codCasella == AVANTI_DI_UNO[0]) {

            spostamento = 1
            console.log("AVANTI DI UNA CASELLA " + this.tag)

        } else if (codCasella == AVANTI_DI_QUATTRO[0]) {

            spostamento = 4
            console.log("AVANTI DI QUATTRO CASELLE " + this.tag)

        } else if (codCasella == FERMO_DA_UNO[0]) {

            console.log("STATTE FERMO PER UN GIRO " + this.tag)
            this.turniFermo = 1

        } else if (codCasella == FERMO_DA_DUE[0]) {

            console.log("STATTE FERMO PER DUE GIRI " + this.tag)
            this.turniFermo = 2

        } else if (codCasella == TORNA_ALL_INIZIO) {
            console.log(this.tag + " TORNA DA CAPO !!!")

            // Lo fa ritornare alla 1° casella# Dalla posizione == 39 va alla 1° == > si muove di 38 posizioni indietro
            this.posiziona(-(this.posizione - 1))

        } else if (codCasella == VITTORIA) {
            console.log("HAI VINTO " + this.tag + " !!!")
            this.vincitore = True
        }

        if (spostamento != 0) {
            this.posiziona(spostamento)
        }
    }

}