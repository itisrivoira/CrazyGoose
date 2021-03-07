//x/y delle CASELLE INIZIALI dei due giocatori
const X_PLAYER1 = 45
const X_PLAYER2 = 45
const Y_PLAYER1 = 540
const Y_PLAYER2 = 605

/*Metodo per disegnare testo (per scrivere) con un
 determinato font, dimensione e colore, il tutto
 centrato in un rettangolo alle coordinate passate*/

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

        this.penultimoMsg = ""
        this.ultimoMsg = ""

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

        draw_text(this.ctx, this.tag, 12, "#ff0000", this.casellaIniziale.getCenterX(), this.casellaIniziale.getCenterY(), "Arial", "bold")
    }

    posiziona(spostamento) {
        //Controlla che con il numero che ha fatto non "esca" dal percorso
        if (this.posizione + spostamento <= QTA_CASELLE_TOTALI) {
            //aggiorno la posizione
            this.posizione += spostamento
            try {
                this.controllato = false
                    //prendo il codice della casella in cui si trova il giocatore 
                let codCasella = this.percorso.dictCaselle[this.posizione]
                    //La pedina si muoverà (prima di un eventuale nuovo spostamento)
                this.crazyGoose.disegnaTutto()

                //Controlla l'effetto contenuto nella casella.
                this.controllaCodiceCasella(codCasella)
                    /*DA TROVARE UN MODO xke non funzia:
                     Lo fa dopo un attimo (mezzo sec) così che l'utente possa "capire cosa sta succedendo" e non veda la pedina andare 8 posizioni avanti xke ha tirato 4 e ha preso "avanti di 4" 
                        (In questo modo si ferma un attimo sulla casella del "+4" e POI avanza)*/
                    //setTimeout(() => { this.controllaCodiceCasella(codCasella) }, 500)
                    /*!!! HO DOVUTO COMMENTARLA xke nel mentre che passano i 500ms l'esecuzione del programma VA 
                        AVANTI, NON SI FERMA ! E quindi si sballano i turni (magari è caduto su tira di nuovo ma il 
                        programma andrà avanti e farà giocare l'avversario )*/
            } catch (err) {
                //Non ha trovato quella posizione nel dizionario, perciò dev'essere una casella VUOTA
                this.crazyGoose.disegnaTutto()
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

    spostaPedina(posAvvessario) {
        if (this.posizione > 0) {
            let x = this.caselle[this.posizione - 1].getCenterX()
            let y = this.caselle[this.posizione - 1].getCenterY()

            if (posAvvessario == this.posizione) {
                if (this.tag == "PL1") {
                    //più in alto
                    y -= 15
                } else {
                    //più in basso
                    y += 15
                }
            }
            draw_text(this.ctx, this.tag, 12, "#ff0000", x, y, "Arial", "bold")
        }
    }

    avanza(spostamento) {
        /*Di default appena si muove, il giocatore ha finito il turno e quindi setto
        	subito turnoMio = False, tuttavia potrebbe essere risettato a True se il
        	giocatore finisce sulla casella TIRA_DI_NUOVO*/
        this.turnoMio = false
        this.posiziona(spostamento)
        while (this.controllato == false) {}
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

        let spostamento = 0
        let msg = ""

        if (codCasella == TIRA_DI_NUOVO[0]) {
            msg = "TIRA ANCORA IL DADO"
            this.turnoMio = true

        } else if (codCasella == INDIETRO_DI_UNO[0]) {
            msg = "INDIETRO DI UNA CASELLA"
            spostamento = -1

        } else if (codCasella == INDIETRO_DI_TRE[0]) {
            msg = "INDIETRO DI TRE CASELLE"
            spostamento = -3

        } else if (codCasella == AVANTI_DI_UNO[0]) {
            msg = "AVANTI DI UNA CASELLA"
            spostamento = 1

        } else if (codCasella == AVANTI_DI_QUATTRO[0]) {
            msg = "AVANTI DI QUATTRO CASELLE"
            spostamento = 4

        } else if (codCasella == FERMO_DA_UNO[0]) {
            msg = "FERMO PER UN GIRO"
            this.turniFermo = 1

        } else if (codCasella == FERMO_DA_DUE[0]) {
            msg = "FERMO PER DUE GIRI"
            this.turniFermo = 2

        } else if (codCasella == TORNA_ALL_INIZIO) {
            msg = "RICOMINCIA DA CAPO !!!"
                // Lo fa ritornare alla 1° casella# Dalla posizione == 39 va alla 1° == > si muove di 38 posizioni indietro
            this.posiziona(-(this.posizione - 1))
        } else if (codCasella == VITTORIA) {
            this.vincitore = true
        }

        if (msg != "") {
            this.penultimoMsg = this.ultimoMsg
            this.ultimoMsg = msg

            //per mostrare i msg
            this.crazyGoose.disegnaTutto()
        }

        if (spostamento != 0) {
            this.posiziona(spostamento)
        } else { this.controllato = true }
    }

}