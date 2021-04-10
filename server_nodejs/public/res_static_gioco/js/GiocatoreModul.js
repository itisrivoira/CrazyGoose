//x/y delle CASELLE INIZIALI dei due giocatori
const X_PLAYER1 = 30
const X_PLAYER2 = 30
const Y_PLAYER1 = 485
const Y_PLAYER2 = 560

const TEMPO_SPOST_FRA_CASELLE = 600
const PICCOLA_PAUSA = 50

class Giocatore {
    constructor(crazyGoose, caselle, percorso, tag) {
        //Mi serve per lanciare un suo metodo
        this.crazyGoose = crazyGoose
        this.caselle = caselle
        this.percorso = percorso
        this.tag = tag

        this.posizione = 0
        this.turnoMio = false
        this.turniFermo = 0
        this.vincitore = false
            /* il flag mi serve per spostare la scritta che indentifica il giocatore
			 quando esso si trova su una casella con un effetto (così da non stare
			 sopra l'effetto (sennò non si capisce più nnt) */
        this.sopraEffetto = false
            /*il flag mi serve per "bloccare" il click sul dado mentre il giocatore non
            ha ancora finito di muoversi)*/
        this.isMoving = false
            //sarà la label con "PL1" o "COM"
        this.gioc = null

        this.penultimoEff = ""
        this.ultimoEff = ""
        this.newSpostamento = 0

        this.creaCasellaIniziale()
    }

    creaCasellaIniziale() {
        let x = 0
        let y = 0
        let indice = 0
        if (this.tag == "PL1") {
            x = X_PLAYER1
            y = Y_PLAYER1
            indice = 0
        } else {
            x = X_PLAYER2
            y = Y_PLAYER2
            indice = -1
        }

        //crea e posiziona l'ellisse (la casella) prima dell'inizio del percorso
        // poi inserisce la scritta che identifica il giocatore
        this.casellaIniziale = new Casella(indice, x, y)

        this.gioc = document.createElement("LABEL")
        var img = new Image();

        img.onload = function() {
            this.gioc.appendChild(img);
        };
        img.src = "/res_static_gioco/images/pedine/pedineNelGioco/pedina_gialla.png"
        this.gioc.appendChild(img)
        this.gioc.style.position = "absolute"
        this.gioc.style.top = this.casellaIniziale.getCenterY() - 30 + "px"
        this.gioc.style.left = this.casellaIniziale.getCenterX() - 35 + "px"

        document.body.appendChild(this.gioc)
    }

    posiziona(spostamento, controllaCodCasella = true) {
        //Controlla che con il numero che ha fatto non "esca" dal percorso
        if (this.posizione + spostamento <= QTA_CASELLE_TOTALI) {
            //aggiorno la posizione
            this.posizione += spostamento
            this.sopraEffetto = false

            try {
                if (controllaCodCasella) {
                    //prendo il codice della casella in cui si trova il giocatore 
                    let codCasella = this.percorso.dictCaselle[this.posizione]
                        //La pedina si muove nella casella (che in questo caso avrà un effetto)
                    this.ridisegnaTutto(spostamento, false, codCasella)

                } else {
                    this.ridisegnaTutto(spostamento, true)
                }

            } catch (err) {
                //Non ha trovato quella posizione nel dizionario, perciò dev'essere una casella VUOTA
                this.ridisegnaTutto(spostamento, true)
            }
        } else {
            // - - - Ha tirato un numero troppo alto che lo farebbe "andare oltre" la casella di vittoria - - -

            //sposto fino alla casella finale (Non constrollo il codice
            // casella xkè sennò mi darebbe la vittoria ma in realtà non ha vinto)
            // E POI ri-sposto INDIETRO di tot caselle
            // es. sono casella 37 faccio 7 (dovrei andare a 44 ma è oltre le 40 casella)
            //  ==> mi sposto di 3 fino alla casella di vittoria	e poi torno indietro di 4

            if (this.newSpostamento == 0) {
                this.newSpostamento = -((this.posizione + spostamento) - QTA_CASELLE_TOTALI)
            }

            //quindi ora sposto la pedina sulla casella finale
            this.posiziona((QTA_CASELLE_TOTALI - this.posizione), false)

            //Aspetta che finisca l'animazione della pedina e poi la fa ritornare indietro
            //(* * * setinterval esegue, in una sorta di altro processo (quindi non blocca il codice),
            // la funzione passata OGNI tot millisecondi (finchè non lo si ferma con clearTimeout
            // continuerà ad eseguire ogni tot ms la funzione data) * * *)
            this.idIntervalPedinaFuoriPercorso = setInterval(() => {
                if (this.isMoving == false) {
                    this.isMoving = true
                        //ferma un attimo il giocatore sulla casella finale
                        //(* * * setTimeout esegue, in una sorta di altro processo (quindi non blocca il codice),
                        // la funzione passata dopo tot millisecondi * * *)
                    setTimeout(() => {
                        //elimino l'interval
                        clearInterval(this.idIntervalPedinaFuoriPercorso)
                            //Ora ri-sposto indietro il giocatore di TOT
                        this.posiziona(this.newSpostamento)
                            //una sorta di flag
                        this.newSpostamento = 0
                    }, 400)
                }
            }, 70)
        }
    }


    ridisegnaTutto(spostamento, settaIsMovingFalse = false, codCasella = -1) {
        //mi serve la pos di partenza, e io ho già aumentato la posizione. quindi
        // partenza è uguale alla posizione meno lo spostamento

        this.isMoving = true
        this.counter = 0
        let partenza = (this.posizione - spostamento)

        if (partenza == 0) {
            this.spostaFraDueCaselle(partenza, spostamento, settaIsMovingFalse, codCasella)
        } else {
            if (spostamento != -(QTA_CASELLE_TOTALI - 2)) {
                let casellaCorrente = partenza - 1
                let prossimaCasella = partenza - 1
                if (spostamento > 0) {
                    prossimaCasella += 1
                } else {
                    //la prossima casella sarà quella nella posizione appena precedente
                    prossimaCasella -= 1
                }

                this.spostaFraDueCaselle(partenza, spostamento, settaIsMovingFalse, codCasella,
                    this.caselle[casellaCorrente].getCenterX(), this.caselle[casellaCorrente].getCenterY(),
                    this.caselle[prossimaCasella].getCenterX(), this.caselle[prossimaCasella].getCenterY())

            } else {
                //Caso in cui è finito su "DA CAPO !" e deve andare dritto dritto verso la prima casella
                var x1 = this.caselle[partenza - 1].getCenterX()
                var y1 = this.caselle[partenza - 1].getCenterY()
                var x2 = this.caselle[0].getCenterX()
                var y2 = this.caselle[0].getCenterY()

                //devo settarlo a 1 così quando incrementerà il contatore lui finirà il ciclo
                // (il codice è quello per spostare la pedina fra due caselle, se non lo settassi
                // lui continuerebbe da 38 a 37, da 37 a 36... fino a da 2 a 1)
                spostamento = 1
                    //Può settare a false this.isMoving xke intanto sulla prima casella non ci
                    // può essere alcun effetto, qunidi non deve controllare il codice della casella
                this.spostaFraDueCaselle(partenza, spostamento, true, codCasella, x1, y1, x2, y2)
            }
        }
    }

    spostaFraDueCaselle(partenza, spostamento, settaIsMovingFalse, codCasella,
        x1 = this.casellaIniziale.getCenterX(),
        y1 = this.casellaIniziale.getCenterY(),
        x2 = this.caselle[0].getCenterX(),
        y2 = this.caselle[0].getCenterY()) {


        /*
        
    ! ! ! Non posso usare la "semplice" proprietà CSS per le animazioni sul giocatore ! ! ! 
    ! ! !  xkè si "attiverebbe" solo la prima volta. ! ! ! 
    ! ! ! Cosa faccio quindi ? OGNI VOLTA CREO UNA NUOVA LABEL, le faccio fare l'animazione ! ! ! 
    ! ! !  e LA DISTRUGGO. AL GIRO DOPO NE VERRÀ CREATA UN ALTRA E CONTINUA COSÌ. ! ! ! 
        */


        if (this.gioc != null) {
            //tra un turno e l'altro la pedina non deve essere rimossa
            // (deve stare ferma sulla casella) quindi la distruggo ora
            // (dopo verrà ricreata)
            document.body.removeChild(this.gioc)
        }
        this.gioc = document.createElement("LABEL")
        var img = new Image();

        img.onload = function() {
            this.gioc.appendChild(img);
        };
        img.src = "/res_static_gioco/images/pedine/pedineNelGioco/pedina_gialla.png"
        this.gioc.appendChild(img)
        this.gioc.style.position = "absolute"
        this.gioc.style.top = y1 - 30 + "px"
        this.gioc.style.left = x1 - 35 + "px"

        document.body.appendChild(this.gioc)


        //se non mi fermo un attimo non si vedrà lo spostamento, andrà direttamente a fine animazione
        //(* * * setTimeout esegue, in una sorta di altro processo (quindi non blocca il codice),
        // la funzione passata dopo tot millisecondi * * *)
        setTimeout(() => {
            //fa l'animazione
            this.gioc.style.transform = "translateX(" + (x2 - x1) + "px) translateY(" + (y2 - y1) + "px)"
            this.gioc.style.transition = TEMPO_SPOST_FRA_CASELLE + "ms"

            //aspetta che l'animazione sia finita (decido io quanto dura quindi so quando finisce)
            setTimeout(() => {
                this.counter += 1
                    //(lo spostamento potrebbe essere <0 quindi lo rendo assoluto)
                if (this.counter < Math.abs(spostamento)) {
                    document.body.removeChild(this.gioc)
                    this.gioc = null

                    this.prossimoSpostamento(partenza, spostamento, settaIsMovingFalse, codCasella)
                } else {
                    //Ha fatto tutti gli spostamenti
                    if (settaIsMovingFalse) {
                        //ha finito di muoversi (lo faccio solo quando SONO SICURO che abbia finito di muoversi.
                        // Normalmente infatti non lo faccio xke controllando l'effetto della casella potrebbe    
                        // muoversi ancora)
                        this.isMoving = false
                    } else {
                        //sono nel caso in cui ha trovato è finito in una casella con
                        // effetto

                        //Controlla l'effetto contenuto nella casella (dopo un attimo così da
                        // lasciare la pedina un attimino sulla casella con l'effetto)
                        setTimeout(() => {
                            this.controllaCodiceCasella(codCasella)
                        }, 250)

                    }
                }
            }, TEMPO_SPOST_FRA_CASELLE)

        }, PICCOLA_PAUSA)

    }

    prossimoSpostamento(partenza, spostamento, settaIsMovingFalse, codCasella) {
        //Ora muovo la pedina dello spostamento da fare.
        //   NON muovo la pedina dalla partenza alla fine DIRETTAMENTE,
        //   MA muovo di CASELLA IN CASELLA, per ogni casella che
        //   deve superare
        if (spostamento > 0) {
            //partenza è la posizione della casella da 1 a 40,
            // ma la lista di caselle è 0-based per questo "partenza-1"

            var x1 = this.caselle[partenza - 1 + this.counter].getCenterX()
            var y1 = this.caselle[partenza - 1 + this.counter].getCenterY()

            //prendo la casella successiva
            var x2 = this.caselle[partenza - 1 + this.counter + 1].getCenterX()
            var y2 = this.caselle[partenza - 1 + this.counter + 1].getCenterY()

            this.spostaFraDueCaselle(partenza, spostamento, settaIsMovingFalse, codCasella, x1, y1, x2, y2)
        } else {
            //partenza è la posizione della casella da 1 a 40,
            // ma le caselle sono 0-based per questo "partenza-1

            var x1 = this.caselle[partenza - 1 - this.counter].getCenterX()
            var y1 = this.caselle[partenza - 1 - this.counter].getCenterY()

            //prendo la casella successiva
            var x2 = this.caselle[partenza - 1 - this.counter - 1].getCenterX()
            var y2 = this.caselle[partenza - 1 - this.counter - 1].getCenterY()

            this.spostaFraDueCaselle(partenza, spostamento, settaIsMovingFalse, codCasella, x1, y1, x2, y2)
        }
    }

    avanza(spostamento) {
        /*Di default appena si muove, il giocatore ha finito il turno e quindi setto
        	subito turnoMio = False, tuttavia potrebbe essere risettato a True se il
        	giocatore finisce sulla casella TIRA_DI_NUOVO*/
        this.turnoMio = false

        this.posiziona(spostamento)
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
        let eff = ""

        if (codCasella == TIRA_DI_NUOVO[0]) {
            eff = "TIRA ANCORA IL DADO"
            this.turnoMio = true
            this.sopraEffetto = true

        } else if (codCasella == INDIETRO_DI_UNO[0]) {
            eff = "INDIETRO DI UNA CASELLA"
            spostamento = -1
            this.sopraEffetto = true

        } else if (codCasella == INDIETRO_DI_TRE[0]) {
            eff = "INDIETRO DI TRE CASELLE"
            spostamento = -3
            this.sopraEffetto = true

        } else if (codCasella == AVANTI_DI_UNO[0]) {
            eff = "AVANTI DI UNA CASELLA"
            spostamento = 1
            this.sopraEffetto = true

        } else if (codCasella == AVANTI_DI_QUATTRO[0]) {
            eff = "AVANTI DI QUATTRO CASELLE"
            spostamento = 4
            this.sopraEffetto = true

        } else if (codCasella == FERMO_DA_UNO[0]) {
            eff = "FERMO PER UN GIRO"
            this.turniFermo = 1
            this.sopraEffetto = true

        } else if (codCasella == FERMO_DA_DUE[0]) {
            eff = "FERMO PER DUE GIRI"
            this.turniFermo = 2
            this.sopraEffetto = true

        } else if (codCasella == TORNA_ALL_INIZIO) {
            eff = "RICOMINCIA DA CAPO !!!"
            this.sopraEffetto = true
                // Lo fa ritornare alla 1° casella. Dalla posizione 39 va alla 1° ==> si muove di 38 posizioni indietro
            spostamento = -(this.posizione - 1)
        } else if (codCasella == VITTORIA) {
            this.vincitore = true
        }

        if (eff != "") {
            this.penultimoEff = this.ultimoEff
            this.ultimoEff = eff

            //per mostrare i effetti (di chi è l'effetto ? true se è del PL1, false se del COM)
            this.crazyGoose.scriviEffetti(this, (this.tag == "PL1"))
        }

        if (spostamento != 0) {
            this.posiziona(spostamento)
        } else {
            this.isMoving = false
        }
    }

}