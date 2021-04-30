//x/y delle CASELLE INIZIALI dei due giocatori
const X_PLAYER1 = 320
const X_PLAYER2 = 320
const Y_PLAYER1 = 570
const Y_PLAYER2 = 670

const TEMPO_SPOST_FRA_CASELLE = 600
const PICCOLA_PAUSA = 50

class Giocatore {
    constructor(crazyGoose, caselle, percorso, tag, pedinaScelta) {
        //Mi serve per lanciare alcuni metodi e avere il Giocatore avvessario
        this.crazyGoose = crazyGoose
        this.caselle = caselle
        this.percorso = percorso
        this.tag = tag
        if (this.tag == "PL1") {
            this.pedinaScelta = pedinaScelta
        } else {
            // pedina scelta mi serve solo per scegliere le img giuste anche per il COM, altrimenti
            // serve a nnt al COM
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
            //flag per sapere quando, appunto, non si è ancora fermata la paedina
        this.isMoving = false
        this.gioc = null

        this.attendoAbilita = false
        this.abilitaAttivata = false

        //qui ci sarà l'effetto e il bg_color
        this.penultimoEff = ["", ""]
        this.ultimoEff = ["", ""]

        //mi serve per bloccare l'avversario mentre questo Giocatore torna indietro
        // se ha fatto un tiro troppo lungo
        this.flagTiroLungo = false
        this.newSpostamento = 0

        this.creaCasellaIniziale()
    }

    creaCasellaIniziale() {
        let x = 0
        let y = 0
            //lo uso per prendere il div della casella giusta (div del PL1 o del COM)
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
        // poi inserisce la pedina del giocatore
        this.casellaIniziale = new Casella(indice, x, y)
        this.gioc = document.createElement("LABEL")
        this.gioc.appendChild(this.imgPedina);
        this.gioc.style.position = "absolute"
        this.gioc.style.top = this.casellaIniziale.getCenterY() - 26 + "px"
        this.gioc.style.left = this.casellaIniziale.getCenterX() - 30 + "px"

        document.getElementById("gioco").appendChild(this.gioc)
    }

    avanza(spostamento, controllaCodCasella = true) {
        /*Di default appena si muove, il giocatore ha finito il turno e quindi setto
        	subito turnoMio = False, tuttavia potrebbe essere risettato a true se il
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

    posiziona(spostamento, controllaCodCasella) {
        //se è stato richiamato posiziona() vuol dire che si deve spostare, e quindi se era
        // nella casella iniziale deve spostarsi da lì e nascondere la casella iniziale
        if (this.posizione == 0) {
            this.casellaIniziale.nascondi()
        } //else l'ha già fatto in precedenza

        //Controlla che con il numero che ha fatto non "esca" dal percorso
        if (this.posizione + spostamento <= QTA_CASELLE_TOTALI) {
            //aggiorno la posizione
            this.posizione += spostamento

            try {
                if (controllaCodCasella) {
                    //prendo il codice della casella in cui si trova il giocatore
                    // (CI PROVO, se fosse vuota la casella questo mi da errore e va
                    // nel catch)

                    let codCasella = this.percorso.dictCaselle[this.posizione]

                    //La pedina si muove nella casella (che in questo caso avrà un effetto, quindi non posso 
                    //sapere se l'effetto non la farà muovere ancora, quindi passo "false" come secondo parametro)
                    this.ridisegnaTutto(spostamento, false, codCasella)
                } else {
                    //Non devo controllare la casella, quindi gli passo "true" xke arrivato a
                    // destinazione NON mi interessa di che effetto ci sia, rimarrà su quella casella
                    this.ridisegnaTutto(spostamento, true)
                }

            } catch (err) {
                //casella vuota, quindi sono SICURO che arrivato a destinazione non si muoverà
                // altrove, quindi gli passo "true"
                this.ridisegnaTutto(spostamento, true)
            }
        } else {
            //* * * TIRO TROPPO LUNGO: va fino alla casella finale e poi si sposta indietro di tot * * *

            this.flagTiroLungo = true

            //Sposto fino alla casella finale (Non constrollo il codice
            // casella xkè sennò segnalerebbe la vittoria anche se in realtà non ha vinto)
            // E POI ri-sposto INDIETRO di tot caselle
            // es. sono casella 37 faccio 7 (dovrei andare a 44 ma è oltre le 40 casella)
            //  ==> mi sposto di 3 fino alla casella di vittoria	e poi torno indietro di 4

            if (this.newSpostamento == 0) {
                this.newSpostamento = -((this.posizione + spostamento) - QTA_CASELLE_TOTALI)
            }

            this.flagEAndatoOltre = true
                //(sposto la pedina sulla casella finale)
            this.posiziona((QTA_CASELLE_TOTALI - this.posizione), false)

            //Aspetta che finisca l'animazione della pedina e poi la fa ritornare indietro

            //(* * * setinterval esegue, in una sorta di altro processo (quindi non blocca il codice),
            // la funzione passata OGNI tot millisecondi (finchè non lo si ferma con clearTimeout
            // continuerà ad eseguire ogni tot ms la funzione data) * * *)
            this.idIntervalPedinaFuoriPercorso = setInterval(() => {
                if (this.isMoving == false) {
                    //setto di nuovo a true isMoving xke si ri-sposta di nuovo
                    this.isMoving = true
                        //ferma un attimo il giocatore sulla casella finale
                        //(* * * setTimeout esegue, in una sorta di altro processo (quindi non blocca il codice),
                        // la funzione passata dopo tot millisecondi * * *)
                    setTimeout(() => {
                        //elimino l'interval
                        clearInterval(this.idIntervalPedinaFuoriPercorso)
                            //Ora ri-sposto indietro il giocatore di TOT (questa volta controllo su che casella 
                            // finisce)
                        this.posiziona(this.newSpostamento, true)
                            //lo uso anche come una sorta di flag
                        this.newSpostamento = 0
                    }, TEMPO_SPOST_FRA_CASELLE - 100)
                }
            }, PICCOLA_PAUSA)
        }
    }

    ridisegnaTutto(spostamento, settaIsMovingFalse = false, codCasella = -1) {
        this.isMoving = true
            //contatore di quanti spostamenti (fra due caselle) ha fatto
        this.counter = 0
            //mi serve la pos di partenza, e io ho già aumentato la posizione. quindi
            // partenza è uguale alla posizione meno lo spostamento
        let partenza = (this.posizione - spostamento)

        if (partenza == 0) {
            //non gli passo nient'altro xke ci sono dei valori di default
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

                //"this.counter" deve arrivare fino a "spostamento", quindi se non cambio "spostamento"
                // lui continuerà a spostare la pedina fra le caselle (38 a 37, 37 a 36,... 2 a 1)
                spostamento = 1
                    //Può settare a false this.isMoving xke intanto sulla prima casella NON c'è
                    // alcun effetto, qunidi non deve controllare il codice della casella
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
                
            ! ! ! Non posso usare la "semplice" proprietà CSS per le animazioni sul giocatore
            ! ! !  xkè non potrei settare un movimento particolare, cioè andrebbe bene finchè
            ! ! !  è tutto uguale il percorso ma poi quando inizia girare devo cambiare lo spostamento.
            ! ! ! Cosa faccio quindi ? OGNI VOLTA CREO UNA NUOVA LABEL, le faccio fare l'animazione
            ! ! !  e LA DISTRUGGO. AL GIRO DOPO NE VERRÀ CREATA UN ALTRA E CONTINUA COSÌ. Quando avrà
            ! ! !  finito di spostarti allora NON la distruggo.
                */
        if (this.gioc != null) {
            //tra un turno e l'altro la pedina non deve essere rimossa
            // (deve stare ferma sulla casella) quindi la distruggo ora (dopo la ricreo)
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
            //fa l'animazione con il giusto spostamento (che sia da sx a dx, dx verso sx, dal basso verso 
            // l'alto o dall'alto verso il basso)
            this.gioc.style.transform = "translateX(" + (x2 - x1) + "px) translateY(" + (y2 - y1) + "px)"
            this.gioc.style.transition = TEMPO_SPOST_FRA_CASELLE + "ms"

            //aspetta che l'animazione sia finita (qui sopra ho specificato quanto deve durare quindi so quando 
            // finisce)
            setTimeout(() => {
                //ha fatto uno spostamento fra caselle, aumento il contatore
                this.counter += 1
                    //Controllo se ha finito gli spostamenti o meno (lo spostamento potrebbe essere <0 quindi lo 
                    // rendo senza segno, assoluto)
                if (this.counter < Math.abs(spostamento)) {
                    //DISTRUGGO la pedina
                    document.getElementById("gioco").removeChild(this.gioc)
                    this.gioc = null

                    this.prossimoSpostamento(partenza, spostamento, settaIsMovingFalse, codCasella)
                } else {
                    //Ha fatto tutti gli spostamenti
                    if (settaIsMovingFalse) {
                        //Se al metodo è stato passato true vuol dire che SONO SICURO che non si muoverà
                        // ancora, quindi setto il flag isMoving a false (in CrazyGoose ora entrerà nel if
                        // dentro all'interval)

                        this.turnoTerminato()
                    } else {
                        //Controlla l'effetto contenuto nella casella (dopo un attimo così da
                        // lasciare la pedina un attimino sulla casella con l'effetto)
                        setTimeout(() => {
                            this.controllaCodiceCasella(codCasella)
                        }, TEMPO_SPOST_FRA_CASELLE - 50)

                    }
                }
            }, (TEMPO_SPOST_FRA_CASELLE - 50))

        }, PICCOLA_PAUSA)

    }

    prossimoSpostamento(partenza, spostamento, settaIsMovingFalse, codCasella) {
        if (spostamento > 0) {
            //Prendo la casella corrente (si è appena spostata "this.counter" volte)
            //!!! "partenza" è la posizione della casella da 1 a 40,
            //!!!   ma la lista di caselle è 0-based per questo "partenza-1")
            let casellaCorrente = partenza - 1 + this.counter

            let x1 = this.caselle[casellaCorrente].getCenterX()
            let y1 = this.caselle[casellaCorrente].getCenterY()

            let casellaSuccessiva = casellaCorrente + 1
            let x2 = this.caselle[casellaSuccessiva].getCenterX()
            let y2 = this.caselle[casellaSuccessiva].getCenterY()

            this.spostaFraDueCaselle(partenza, spostamento, settaIsMovingFalse, codCasella, casellaSuccessiva, x1, y1, x2, y2)
        } else {
            //Prendo la casella corrente (si è appena spostata "this.counter" volte INDIETRO)
            //!!! "partenza" è la posizione della casella da 1 a 40,
            //!!!   ma la lista di caselle è 0-based per questo "partenza-1")
            let casellaCorrente = partenza - 1 - this.counter

            let x1 = this.caselle[casellaCorrente].getCenterX()
            let y1 = this.caselle[casellaCorrente].getCenterY()

            //prendo la casella successiva
            let casellaSuccessiva = casellaCorrente - 1
            let x2 = this.caselle[casellaSuccessiva].getCenterX()
            let y2 = this.caselle[casellaSuccessiva].getCenterY()

            this.spostaFraDueCaselle(partenza, spostamento, settaIsMovingFalse, codCasella, casellaSuccessiva, x1, y1, x2, y2)
        }
    }

    controllaCodiceCasella(codCasella) {
        //Abilità oca rossa: (annullare effetto)
        //CodCasella è -1 se nella casella non c'è alcun effetto.
        // se non c'è nessun effetto non ha da annullare nulla. Se invece
        // è sulla casella di vittoria, ovviamente, non può annullare la vittoria
        if (codCasella != -1 && this.abilitaAttivata == false && this.pedinaScelta == "rossa" && this.posizione != 40) {

            //farò 20 giri, ogni 100millisecondi ==> 2 secondi di tempo do
            // all'utente per usare l'abilità
            let numGiri = 0

            //(* * * setinterval esegue, in una sorta di altro processo (quindi non blocca il codice),
            // la funzione passata OGNI tot millisecondi (finchè non lo si ferma con clearTimeout
            // continuerà ad eseguire ogni tot ms la funzione data) * * *)
            let idIntervalAbilita = setInterval(() => {
                //(controllo anche che il gioco non sia stato fermato)
                if (this.crazyGoose.giocoPartito && numGiri < 20) {
                    //(flag che serve nel click sull'img dell'abilità)
                    this.attendoAbilita = true
                    this.crazyGoose.buttonAbilita.evidenziaTempoRimanente((2000 - numGiri * 100), true)

                    if (this.abilitaAttivata) {
                        //fermo il loop
                        numGiri = 20
                    } else {
                        numGiri += 1
                    }
                } else {
                    clearInterval(idIntervalAbilita)

                    //non può più cliccare sull'abiltà
                    this.attendoAbilita = false

                    //Se ha attivato l'abilità cambierà img in NO.png altrimenti "ms" è 
                    // passato a 0 quindi metterà NON_PIU.png
                    this.crazyGoose.buttonAbilita.evidenziaTempoRimanente(0)

                    //Se non ha attivato l'abilita allora controlla il codice della casella normalmente, 
                    // altrimenti ha finito il turno
                    if (this.abilitaAttivata == false) {
                        this.controlloEffettoCasella(codCasella)
                    } else {
                        this.turnoTerminato()
                    }
                }
            }, 100)
        } else {
            this.controlloEffettoCasella(codCasella)
        }
    }

    controlloEffettoCasella(codCasella) {
        let spostamento = 0
        let eff = ""
        let color = ""

        switch (codCasella) {
            case TIRA_DI_NUOVO[0]:
                eff = "TIRA ANCORA IL DADO"
                color = BG_COLOR_X2
                this.turnoMio = true
                break

            case INDIETRO_DI_UNO[0]:
                eff = "INDIETRO DI UNA CASELLA"
                color = BG_COLOR_MENO1
                spostamento = -1
                break

            case INDIETRO_DI_TRE[0]:
                eff = "INDIETRO DI TRE CASELLE"
                color = BG_COLOR_MENO3
                spostamento = -3
                break

            case AVANTI_DI_UNO[0]:
                eff = "AVANTI DI UNA CASELLA"
                color = BG_COLOR_PIU1
                spostamento = 1
                break

            case AVANTI_DI_QUATTRO[0]:
                eff = "AVANTI DI QUATTRO CASELLE"
                color = BG_COLOR_PIU4
                spostamento = 4
                break

            case FERMO_DA_UNO[0]:
                eff = "FERMO PER UN GIRO"
                color = BG_COLOR_FERMO1
                this.turniFermo = 1
                break

            case FERMO_DA_DUE[0]:
                eff = "FERMO PER DUE GIRI"
                color = BG_COLOR_FERMO2
                this.turniFermo = 2
                break

            case TORNA_ALL_INIZIO[0]:
                eff = "RICOMINCIA DA CAPO !!!"
                color = BG_COLOR_DACAPO
                    // Lo fa ritornare alla 1° casella. Dalla posizione 39 va alla 1° ==> si muove di 38 posizioni indietro
                spostamento = -(this.posizione - 1)
                break

            case VITTORIA[0]:
                this.vincitore = true
                break
            default:
                break
        }

        if (eff != "") {
            this.penultimoEff[0] = this.ultimoEff[0]
            this.penultimoEff[1] = this.ultimoEff[1]
            this.ultimoEff[0] = eff
            this.ultimoEff[1] = color

            //Mostro gli effetti. Il secondo parametro non è altro che true o false
            this.crazyGoose.scriviEffetti(this, (this.tag == "PL1"))
        }

        if (spostamento != 0) {
            //controllo che sia l'oca gialla e che sia capitato sulla casella AVANTI_DI_UNO (cioè
            // che spostamento sia settato a 1)
            if (this.abilitaAttivata == false && this.pedinaScelta == "gialla" && spostamento == 1) {
                //farò 20 giri, ogni 100millisecondi ==> 2 secondi di tempo do
                // all'utente per usare l'abilità
                let numGiri = 0

                //(* * * setinterval esegue, in una sorta di altro processo (quindi non blocca il codice),
                // la funzione passata OGNI tot millisecondi (finchè non lo si ferma con clearTimeout
                // continuerà ad eseguire ogni tot ms la funzione data) * * *)
                let idIntervalAbilita = setInterval(() => {
                    //(controllo anche che il gioco non sia stato fermato)    
                    if (this.crazyGoose.giocoPartito && numGiri < 20) {
                        //(flag che serve nel click sull'img dell'abilità)
                        this.attendoAbilita = true
                        this.crazyGoose.buttonAbilita.evidenziaTempoRimanente((2000 - numGiri * 100), true)

                        if (this.abilitaAttivata) {
                            //aumenta spostamento a 3
                            spostamento = 3
                                //fermo il loop
                            numGiri = 20
                        } else {
                            numGiri += 1
                        }
                    } else {
                        clearInterval(idIntervalAbilita)

                        //non può più cliccare sull'abiltà
                        this.attendoAbilita = false

                        //Se ha attivato l'abilità cambierà img in NO.png altrimenti "ms" è 
                        // passato a 0 quindi metterà NON_PIU.png
                        this.crazyGoose.buttonAbilita.evidenziaTempoRimanente(0)

                        //Se ha attivato l'abilita "spostamento" sarà diventato 3, altrimenti sarà rimasto 1.
                        this.posiziona(spostamento, true)
                    }
                }, 100)
            } else {
                //Non è l'oca gialla oppure non è finito su AVANTI_DI_UNO, quindi sposto normalmente la pedina
                this.posiziona(spostamento, true)
            }
        } else {
            //spostamento = 0 quindi ha finito di muoversi
            this.turnoTerminato()
        }
    }

    turnoTerminato() {
        //imposta semplicemente dei flag in modo corretto

        this.isMoving = false
            //(si gira già nel verso giusto dove dovrà muoversi la prossima volta)
        this.imgPedina.src = this.cambiaVersoPedina()
        this.flagTiroLungo = false
    }

}