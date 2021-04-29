//x/y delle CASELLE INIZIALI dei due giocatori
const X_PLAYER1 = 320
const X_PLAYER2 = 320
const Y_PLAYER1 = 570
const Y_PLAYER2 = 670

const TEMPO_SPOST_FRA_CASELLE = 600
const PICCOLA_PAUSA = 50

class Giocatore {
    constructor(crazyGoose, caselle, percorso, tag, pedinaScelta) {
        //constructor(crazyGoose, caselle, percorso, tag) {
        //Mi serve per lanciare un suo metodo
        this.crazyGoose = crazyGoose
        this.caselle = caselle
        this.percorso = percorso
        this.tag = tag
        if (this.tag == "PL1") {
            this.pedinaScelta = pedinaScelta
        } else {
            // pedina scelta mi serve per scegliere le img ma il COM non sceglie un oca
            this.pedinaScelta = null
        }

        this.imgPedina = new Image();

        if (tag == "COM") {
            this.percorsoImgSxDx = "/res_static_gioco/images/pedine/pedineNelGioco/sxVersoDx/pedina_COM.png"
            this.percorsoImgDxSx = "/res_static_gioco/images/pedine/pedineNelGioco/dxVersoSx/pedina_COM.png"
        } else {
            this.percorsoImgSxDx = "/res_static_gioco/images/pedine/pedineNelGioco/sxVersoDx/pedina_" + this.pedinaScelta + ".png"
            this.percorsoImgDxSx = "/res_static_gioco/images/pedine/pedineNelGioco/dxVersoSx/pedina_" + this.pedinaScelta + ".png"
        }
        this.percorsoImgScontroNoEffDxSx = "/res_static_gioco/images/pedine/pedineNelGioco/COM_vs_PL1/abilitaNonAttivata/dxVersoSx/COM_vs_" + pedinaScelta + ".png"
        this.percorsoImgScontroNoEffSxDx = "/res_static_gioco/images/pedine/pedineNelGioco/COM_vs_PL1/abilitaNonAttivata/sxVersoDx/" + pedinaScelta + "_vs_COM.png"
        this.percorsoImgScontroEffDxSx = "/res_static_gioco/images/pedine/pedineNelGioco/COM_vs_PL1/abilitaAttivata/dxVersoSx/COM_vs_" + pedinaScelta + ".png"
        this.percorsoImgScontroEffSxDx = "/res_static_gioco/images/pedine/pedineNelGioco/COM_vs_PL1/abilitaAttivata/sxVersoDx/" + pedinaScelta + "_vs_COM.png"


        this.imgPedina.src = this.percorsoImgSxDx

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

        this.attendoAbilita = false
        this.abilitaAttivata = false

        //qui ci sarà l'effetto e il bg_color
        this.penultimoEff = ["", ""]
        this.ultimoEff = ["", ""]

        //mi serve per bloccare l'avversario mentre questo torna indietro se ha fatto
        // un tiro troppo lungo
        this.flagTiroLungo = false
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
        this.gioc.appendChild(this.imgPedina);
        this.gioc.style.position = "absolute"
        this.gioc.style.top = this.casellaIniziale.getCenterY() - 26 + "px"
        this.gioc.style.left = this.casellaIniziale.getCenterX() - 30 + "px"

        document.getElementById("gioco").appendChild(this.gioc)
    }

    posiziona(spostamento, controllaCodCasella) {

        this.casellaIniziale.nascondi()

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
            this.flagTiroLungo = true
                // - - - Ha tirato un numero troppo alto che lo farebbe "andare oltre" la casella di vittoria - - -

            //sposto fino alla casella finale (Non constrollo il codice
            // casella xkè sennò mi darebbe la vittoria ma in realtà non ha vinto)
            // E POI ri-sposto INDIETRO di tot caselle
            // es. sono casella 37 faccio 7 (dovrei andare a 44 ma è oltre le 40 casella)
            //  ==> mi sposto di 3 fino alla casella di vittoria	e poi torno indietro di 4

            if (this.newSpostamento == 0) {
                this.newSpostamento = -((this.posizione + spostamento) - QTA_CASELLE_TOTALI)
            }

            this.flagEAndatoOltre = true
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
                        this.posiziona(this.newSpostamento, true)
                            //una sorta di flag
                        this.newSpostamento = 0
                            //this.controllaCodiceCasella(codCasella)
                    }, TEMPO_SPOST_FRA_CASELLE - 100)
                }
            }, PICCOLA_PAUSA)
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

                this.spostaFraDueCaselle(partenza, spostamento, settaIsMovingFalse, codCasella, prossimaCasella,
                    this.caselle[casellaCorrente].getCenterX(), this.caselle[casellaCorrente].getCenterY(),
                    this.caselle[prossimaCasella].getCenterX(), this.caselle[prossimaCasella].getCenterY())

            } else {
                //Caso in cui è finito su "DA CAPO !" e deve andare dritto dritto verso la prima casella
                let x1 = this.caselle[partenza - 1].getCenterX()
                let y1 = this.caselle[partenza - 1].getCenterY()
                let x2 = this.caselle[0].getCenterX()
                let y2 = this.caselle[0].getCenterY()

                //devo settarlo a 1 così quando incrementerà il contatore lui finirà il ciclo
                // (il codice è quello per spostare la pedina fra due caselle, se non lo settassi
                // lui continuerebbe da 38 a 37, da 37 a 36... fino a da 2 a 1)
                spostamento = 1
                    //Può settare a false this.isMoving xke intanto sulla prima casella non ci
                    // può essere alcun effetto, qunidi non deve controllare il codice della casella
                this.spostaFraDueCaselle(partenza, spostamento, true, codCasella, 0, x1, y1, x2, y2)
            }
        }
    }

    spostaFraDueCaselle(partenza, spostamento, settaIsMovingFalse, codCasella, posCasellaFinale = 0,
        x1 = this.casellaIniziale.getCenterX(),
        y1 = this.casellaIniziale.getCenterY(),
        x2 = this.caselle[0].getCenterX(),
        y2 = this.caselle[0].getCenterY()) {


        this.imgPedina.src = this.cambiaVersoPedina(x1, x2, posCasellaFinale)

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
            document.getElementById("gioco").removeChild(this.gioc)
        }
        this.gioc = document.createElement("LABEL")
        this.gioc.appendChild(this.imgPedina)
        this.gioc.style.position = "absolute"
        this.gioc.style.top = y1 - 26 + "px"
        this.gioc.style.left = x1 - 30 + "px"

        document.getElementById("gioco").appendChild(this.gioc)


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
                    document.getElementById("gioco").removeChild(this.gioc)
                    this.gioc = null

                    this.prossimoSpostamento(partenza, spostamento, settaIsMovingFalse, codCasella)
                } else {
                    //Ha fatto tutti gli spostamenti
                    if (settaIsMovingFalse) {
                        //ha finito di muoversi (lo faccio solo quando SONO SICURO che abbia finito di muoversi.
                        // Normalmente infatti non lo faccio xke controllando l'effetto della casella potrebbe    
                        // muoversi ancora)
                        this.isMoving = false
                        this.imgPedina.src = this.cambiaVersoPedina()
                        this.flagTiroLungo = false
                    } else {
                        //sono nel caso in cui ha trovato è finito in una casella con
                        // effetto

                        //Controlla l'effetto contenuto nella casella (dopo un attimo così da
                        // lasciare la pedina un attimino sulla casella con l'effetto)
                        setTimeout(() => {
                            this.controllaCodiceCasella(codCasella)
                        }, 550)

                    }
                }
            }, (TEMPO_SPOST_FRA_CASELLE - 50))

        }, PICCOLA_PAUSA)

    }

    avanza(spostamento, controllaCodCasella = true) {
        /*Di default appena si muove, il giocatore ha finito il turno e quindi setto
        	subito turnoMio = False, tuttavia potrebbe essere risettato a True se il
        	giocatore finisce sulla casella TIRA_DI_NUOVO*/
        this.turnoMio = false

        this.posiziona(spostamento, controllaCodCasella)
    }

    cambiaVersoPedina(x_partenza = 0, x_fine = 0, posCasellaFinale = 0) {
        if (x_partenza == 0) {
            x_partenza = this.caselle[this.posizione - 1].getCenterX()
            x_fine = this.caselle[this.posizione].getCenterX()
            posCasellaFinale = this.posizione + 1
        }


        //Sceglie in base alla casella in cui deve andare la pedina, se quest'ultima
        // sarà girata (avrà la testa) verso dx oppure sx
        // SE NECCESSARIO (prima si è attivata l'abilità del COM) CAMBIA ANCHE QUELLA DEL COM

        let avversario = null
        if (this.tag == "PL1") {
            avversario = this.crazyGoose.com
        } else {
            avversario = this.crazyGoose.player
        }

        let percorsoImg = this.percorsoImgSxDx

        if (x_partenza > x_fine) {
            percorsoImg = this.percorsoImgDxSx
        } else if (x_partenza == x_fine) { //partenza e fine sono sulla stessa x
            //controlla la posizione della casella finale e decide

            //!!!!!   È SOLAMENTE LEGATO AL LAYOUT DEL PERCORSO   !!!!!

            if (posCasellaFinale >= 18 && posCasellaFinale <= 20) {
                percorsoImg = this.percorsoImgSxDx
            } else if (posCasellaFinale == 26 || posCasellaFinale == 27) {
                percorsoImg = this.percorsoImgDxSx
            }
        } //else prende img da sx a dx


        if (this.isMoving == false && this.posizione == avversario.posizione) {
            if (this.posizione > 2) {
                //attiva l'abilita
                if (percorsoImg == this.percorsoImgSxDx) {
                    percorsoImg = this.percorsoImgScontroEffSxDx
                } else {
                    percorsoImg = this.percorsoImgScontroEffDxSx
                }
            } else {
                //NON attiva l'abilita
                if (percorsoImg == this.percorsoImgSxDx) {
                    percorsoImg = this.percorsoImgScontroNoEffSxDx
                } else {
                    percorsoImg = this.percorsoImgScontroNoEffDxSx
                }
            }
        }

        return percorsoImg
    }


    prossimoSpostamento(partenza, spostamento, settaIsMovingFalse, codCasella) {
        //Ora muovo la pedina dello spostamento da fare.
        //   NON muovo la pedina dalla partenza alla fine DIRETTAMENTE,
        //   MA muovo di CASELLA IN CASELLA, per ogni casella che
        //   deve superare
        if (spostamento > 0) {
            //partenza è la posizione della casella da 1 a 40,
            // ma la lista di caselle è 0-based per questo "partenza-1"

            let x1 = this.caselle[partenza - 1 + this.counter].getCenterX()
            let y1 = this.caselle[partenza - 1 + this.counter].getCenterY()

            //prendo la casella successiva
            let casellaSuccessiva = partenza - 1 + this.counter + 1
            let x2 = this.caselle[casellaSuccessiva].getCenterX()
            let y2 = this.caselle[casellaSuccessiva].getCenterY()

            this.spostaFraDueCaselle(partenza, spostamento, settaIsMovingFalse, codCasella, casellaSuccessiva, x1, y1, x2, y2)
        } else {
            //partenza è la posizione della casella da 1 a 40,
            // ma le caselle sono 0-based per questo "partenza-1

            let x1 = this.caselle[partenza - 1 - this.counter].getCenterX()
            let y1 = this.caselle[partenza - 1 - this.counter].getCenterY()

            //prendo la casella successiva
            let casellaSuccessiva = partenza - 1 - this.counter - 1
            let x2 = this.caselle[casellaSuccessiva].getCenterX()
            let y2 = this.caselle[casellaSuccessiva].getCenterY()

            this.spostaFraDueCaselle(partenza, spostamento, settaIsMovingFalse, codCasella, casellaSuccessiva, x1, y1, x2, y2)
        }
    }

    controlloEffettoCasella(codCasella) {
        let spostamento = 0
        let eff = ""
        let color = ""

        if (codCasella == TIRA_DI_NUOVO[0]) {
            eff = "TIRA ANCORA IL DADO"
            color = BG_COLOR_X2
            this.turnoMio = true
            this.sopraEffetto = true

        } else if (codCasella == INDIETRO_DI_UNO[0]) {
            eff = "INDIETRO DI UNA CASELLA"
            color = BG_COLOR_MENO1
            spostamento = -1
            this.sopraEffetto = true

        } else if (codCasella == INDIETRO_DI_TRE[0]) {
            eff = "INDIETRO DI TRE CASELLE"
            color = BG_COLOR_MENO3
            spostamento = -3
            this.sopraEffetto = true

        } else if (codCasella == AVANTI_DI_UNO[0]) {
            eff = "AVANTI DI UNA CASELLA"
            color = BG_COLOR_PIU1
            spostamento = 1
            this.sopraEffetto = true

        } else if (codCasella == AVANTI_DI_QUATTRO[0]) {
            eff = "AVANTI DI QUATTRO CASELLE"
            color = BG_COLOR_PIU4
            spostamento = 4
            this.sopraEffetto = true

        } else if (codCasella == FERMO_DA_UNO[0]) {
            eff = "FERMO PER UN GIRO"
            color = BG_COLOR_FERMO1
            this.turniFermo = 1
            this.sopraEffetto = true

        } else if (codCasella == FERMO_DA_DUE[0]) {
            eff = "FERMO PER DUE GIRI"
            color = BG_COLOR_FERMO2
            this.turniFermo = 2
            this.sopraEffetto = true

        } else if (codCasella == TORNA_ALL_INIZIO) {
            eff = "RICOMINCIA DA CAPO !!!"
            color = BG_COLOR_DACAPO
            this.sopraEffetto = true
                // Lo fa ritornare alla 1° casella. Dalla posizione 39 va alla 1° ==> si muove di 38 posizioni indietro
            spostamento = -(this.posizione - 1)
        } else if (codCasella == VITTORIA) {
            this.vincitore = true
        }

        if (eff != "") {
            this.penultimoEff[0] = this.ultimoEff[0]
            this.penultimoEff[1] = this.ultimoEff[1]
            this.ultimoEff[0] = eff
            this.ultimoEff[1] = color

            //per mostrare i effetti (di chi è l'effetto ? true se è del PL1, false se del COM)
            this.crazyGoose.scriviEffetti(this, (this.tag == "PL1"))
        }

        if (spostamento != 0) {
            if (this.abilitaAttivata == false && this.pedinaScelta == "gialla" && spostamento == 1) {
                //attende 2 sec (nel mentre deve fare controlli quindi non posso
                // usare semplicemente una wait di 2000, ogni 100ms faccio un giro
                // e controllo, arrivati a 20 giri avro' aspettato 2000ms)
                let numGiri = 0

                //(* * * setinterval esegue, in una sorta di altro processo (quindi non blocca il codice),
                // la funzione passata OGNI tot millisecondi (finchè non lo si ferma con clearTimeout
                // continuerà ad eseguire ogni tot ms la funzione data) * * *)
                let idIntervalAbilita = setInterval(() => {
                    //(controllo anche che il gioco non sia stato fermato)    
                    if (this.crazyGoose.giocoPartito && numGiri < 20) {
                        this.attendoAbilita = true
                        this.crazyGoose.buttonAbilita.evidenziaTempoRimanente((2000 - numGiri * 100), true)

                        if (this.abilitaAttivata) {
                            spostamento = 3
                            numGiri = 20
                        } else {
                            numGiri += 1
                        }
                    } else {
                        clearInterval(idIntervalAbilita)
                            //In crazyGoose l'evento click sul button dell'abilita non fa nulla
                            // se attendoAbilita = false. Quindi io devo settarlo a false xke
                            // dev'essere true SOLO se può attivare l'abilita (cioè sta girando nel
                            // interval idIntervalAbilita)

                        this.attendoAbilita = false

                        //Se ha attivato l'abilita:
                        //  this.abilitaAttivata sarà = true ! ==> cambia img in NO.png
                        //Se non ha attivato l'abilita:
                        //  this.abilitaAttivata sarà = false, i millisecondi che gli passo sono = 0
                        //   ==> cambia img in NON_PIU.png
                        this.crazyGoose.buttonAbilita.evidenziaTempoRimanente(0)

                        //se ha attivato l'abilita "spostamento" sarà diventato 3, altrimenti sarà rimasto 1
                        this.posiziona(spostamento, true)
                    }
                }, 100)
            } else {
                this.posiziona(spostamento, true)
            }
        } else {
            this.isMoving = false
            this.imgPedina.src = this.cambiaVersoPedina()
            this.flagTiroLungo = false
        }
    }

    controllaCodiceCasella(codCasella) {
        //codCasella è -1 se nella casella non c'è alcun effetto. Se non c'è nessun effetto non ha da annullare nulla
        if (codCasella != -1 && this.abilitaAttivata == false && this.pedinaScelta == "rossa" && this.codCasella != VITTORIA) {
            //attende 2 sec (nel mentre deve fare controlli quindi non posso
            // usare semplicemente una wait di 2000, ogni 100ms faccio un giro
            // e controllo, arrivati a 20 giri avro' aspettato 2000ms)
            let numGiri = 0

            //(* * * setinterval esegue, in una sorta di altro processo (quindi non blocca il codice),
            // la funzione passata OGNI tot millisecondi (finchè non lo si ferma con clearTimeout
            // continuerà ad eseguire ogni tot ms la funzione data) * * *)

            let idIntervalAbilita = setInterval(() => {
                //(controllo anche che il gioco non sia stato fermato)
                if (this.crazyGoose.giocoPartito && numGiri < 20) {
                    this.attendoAbilita = true
                    this.crazyGoose.buttonAbilita.evidenziaTempoRimanente((2000 - numGiri * 100), true)
                    if (this.abilitaAttivata) {
                        numGiri = 20
                    } else {
                        numGiri += 1
                    }
                } else {
                    clearInterval(idIntervalAbilita)
                        //In crazyGoose l'evento click sul button dell'abilita non fa nulla
                        // se attendoAbilita = false. Quindi io devo settarlo a false xke
                        // dev'essere true SOLO se può attivare l'abilita (cioè sta girando nel
                        // interval idIntervalAbilita)

                    this.attendoAbilita = false

                    //Se ha attivato l'abilita:
                    //  this.abilitaAttivata sarà = true ! ==> cambia img in NO.png
                    //Se non ha attivato l'abilita:
                    //  this.abilitaAttivata sarà = false, i millisecondi che gli passo sono = 0
                    //   ==> cambia img in NON_PIU.png
                    this.crazyGoose.buttonAbilita.evidenziaTempoRimanente(0)

                    if (this.abilitaAttivata == false) {
                        this.controlloEffettoCasella(codCasella)
                    } else {
                        this.isMoving = false
                        this.imgPedina.src = this.cambiaVersoPedina()
                        this.flagTiroLungo = false
                    }
                }
            }, 100)
        } else {
            this.controlloEffettoCasella(codCasella)
        }
    }

}