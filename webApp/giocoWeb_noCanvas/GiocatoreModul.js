//x/y delle CASELLE INIZIALI dei due giocatori
const X_PLAYER1 = 30
const X_PLAYER2 = 30
const Y_PLAYER1 = 485
const Y_PLAYER2 = 560

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
            ha ancora finito di muoversi)
        this.isMoving = false*/


        this.penultimoEff = ""
        this.ultimoEff = ""

        this.creaCasellaIniziale()
    }

    creaCasellaIniziale() {
        let x = 0
        let y = 0
        let indice = 0
        let giocatore = document.getElementById(this.tag)
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

        giocatore.style.zIndex = 10
        giocatore.style.fontWeight = "bold"
        giocatore.style.position = "absolute"
            //quel 14 e 19.5 sono la metà della LARGHEZZA del testo (NON SERVE A NIENTE SE CI METTIAMO POI LE IMG DELLE OCHE)
        if (this.tag == "PL1") {
            giocatore.style.left = (this.casellaIniziale.getCenterX() - 14) + "px"
        } else {
            giocatore.style.left = (this.casellaIniziale.getCenterX() - 19.5) + "px"
        }
        giocatore.style.top = (this.casellaIniziale.getCenterY() - 8.5) + "px"
    }

    posiziona(spostamento) {
        //Controlla che con il numero che ha fatto non "esca" dal percorso
        if (this.posizione + spostamento <= QTA_CASELLE_TOTALI) {
            //aggiorno la posizione
            this.posizione += spostamento
            this.sopraEffetto = false

            try {
                //prendo il codice della casella in cui si trova il giocatore 
                let codCasella = this.percorso.dictCaselle[this.posizione]
                    //La pedina si muove nella casella (che in questo caso avrà un effetto)
                this.ridisegnaTutto(spostamento)

                /*Qui ci andrebbe un FERMO per POCHISSIMO (cos' da fermare la pedina sulla casella con
                    l'effetto per un attimo e "far capire all'utente cosa sta succedendo").*/

                //Controlla l'effetto contenuto nella casella.
                this.controllaCodiceCasella(codCasella)

                /*Riferito a prima: TODO TROVARE UN MODO XKE QUESTI NON FUNZIONANO:
                
                        1) setTimeout(() => { this.controllaCodiceCasella(codCasella) }, 500)
                         funziona ma NON FERMA l'esecuzione del programma ! (i turni si sballano)
                        2)let prima = new Date().getTime(); while(new Date().getTime() < prima+2000){}
                         funzionerebbe se non fosse che gira TROPPO VELOCE, TROPPE VOLTE e il browser lo ferma
                    */
            } catch (err) {
                //Non ha trovato quella posizione nel dizionario, perciò dev'essere una casella VUOTA
                this.ridisegnaTutto(spostamento)
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


    ridisegnaTutto(spostamento) {
        //mi serve la pos di partenza, e io ho già aumentato la posizione. quindi
        // passo la posizione meno lo spostamento
        //this.crazyGoose.ctx.clearRect(0, 0, this.crazyGoose.canvas.width, this.crazyGoose.canvas.height)
        this.spostaPedina((this.posizione - spostamento), spostamento)
    }


    /*spostaPedina(partenza, spostamento) {
        //cioè deve tornare alla prima casella.
        // Si muoverà in diagonale tra penultima casella e prima
        if (spostamento == -38) {
            var x1 = this.caselle[partenza - 1].getCenterX()
            var y1 = this.caselle[partenza - 1].getCenterY()
            var x2 = this.caselle[0].getCenterX()
            var y2 = this.caselle[0].getCenterY()

            this.spostaFraDueCaselle(x1, y1, x2, y2, 7)
        } else {
            //Se parte dalla casella iniziale (prima dell'inizio del percorso) deve muoversi anche da lì
            if (partenza == 0) {
                var x1 = this.casellaIniziale.getCenterX()
                var y1 = this.casellaIniziale.getCenterY()

                var x2 = this.caselle[0].getCenterX()
                var y2 = this.caselle[0].getCenterY()

                this.spostaFraDueCaselle(x1, y1, x2, y2, 2, 2, spostamento)

            } else {
                //Ora muovo la pedina dello spostamento da fare.
                  //   NON muovo la pedina dalla partenza alla fine DIRETTAMENTE,
                  //   MA muovo di CASELLA IN CASELLA, per ogni casella che
                  //   deve superare

                if (spostamento > 0) {
                    //partenza è la posizione della casella da 1 a 40,
                    // ma le caselle sono 0-based per questo "partenza-1

                    console.log("spost > 0 " + (partenza - 1))
                    var x1 = this.caselle[partenza - 1].getCenterX()
                    var y1 = this.caselle[partenza - 1].getCenterY()

                    //prendo la casella successiva
                    var x2 = this.caselle[partenza - 1 + 1].getCenterX()
                    var y2 = this.caselle[partenza - 1 + 1].getCenterY()

                    this.spostaFraDueCaselle(x1, y1, x2, y2, 2, 2, spostamento, 0, partenza)

                } else {                   
                    //!!! ANCORA DA AGGIUSTARE COME SOPRA
                    

                    //devo prendere le caselle in modo inverso !

                    //lo trasformo in positivo, sennò "i" sarebbe maggiore di "spostamento"
                    var spost = -spostamento
                        // una sorta di flag per il primo giro
                    var x1 = null
                    var x2 = 0
                    var y1 = 0
                    var y2 = 0

                    var i = 0
                    while (i < spost) {
                        if (x1 == null) {
                            x1 = this.caselle[partenza - 1].getCenterX()
                            y1 = this.caselle[partenza - 1].getCenterY()
                        } else {
                            x1 = this.caselle[partenza - 1 - i].getCenterX()
                            y1 = this.caselle[partenza - 1 - i].getCenterY()
                        }

                        x2 = this.caselle[partenza - 1 - i - 1].getCenterX()
                        y2 = this.caselle[partenza - 1 - i - 1].getCenterY()

                        this.spostaFraDueCaselle(x1, y1, x2, y2)

                        i += 1
                    }
                }
            }
        }
    }


    spostaFraDueCaselle(x1, y1, x2, y2, mov_x = 2, mov_y = 2, spostamento = -1, i = -1, partenza = -1) {
        //console.log(this.tag + " " + x1 + " a " + x2 + "; " + y1 + " a " + y2)

        var partenza_x = x1
        var partenza_y = y1
        var fine_x = x2
        var fine_y = y2

        var continua = true

        // metto un minuscolo fermo, altrimenti sarebbe troppo veloce
        //pygame.time.wait(14)
        // Non disegnerà il giocatore (lo disegno dopo)
        this.crazyGoose.disegnaTutto(this.tag)

        if (partenza_x < fine_x) {
            partenza_x += mov_x
        } else if (partenza_x > fine_x) {
            partenza_x -= mov_x
        }

        //Controllo se è già arrivato alla fine.
        if (partenza_x >= fine_x - 5 && partenza_x <= fine_x + 5) {
            partenza_x = fine_x
        }

        if (partenza_y > fine_y) {
            partenza_y -= mov_y
        } else if (partenza_y < fine_y) {
            partenza_y += mov_y
        }

        //Controllo se è già arrivato alla fine
        if (partenza_y >= fine_y - 5 && partenza_y <= fine_y + 5) {
            partenza_y = fine_y
        }

        // Non mi muovo in modo da arrivare PRECISAMENTE alle coordinate x y,
        // quindi controllo se sono arrivato intorno alle coord x y
        if (partenza_x >= fine_x - 5 && partenza_x <= fine_x + 5 &&
            partenza_y >= fine_y - 5 && partenza_y <= fine_y + 5) {

            // fermo il loop
            continua = false
            draw_text(this.ctx, this.tag, 12, "#ff0000", fine_x, fine_y, "Arial", "bold")
                //self.game.display.blit(self.imgPedina,
                        //(fine_x - WIDTH_PEDINA / 2,
                            //fine_y - HEIGHT_PEDINA / 2))
        } else {
            draw_text(this.ctx, this.tag, 12, "#ff0000", partenza_x, partenza_y, "Arial", "bold")
                //self.game.display.blit(self.imgPedina,
                  //  (partenza_x - WIDTH_PEDINA / 2,
                    //    partenza_y - HEIGHT_PEDINA / 2))
        }

        //dentro quella funzione perdo il riferimento a "this.Giocatore" quindi me lo devo salvare
        let classe = this
        if (continua) { //TODO vedere se serve poi ancora  && this.crazyGoose.giocoPartito
            requestAnimationFrame(function() {
                //spostamento mi serve passarlo per il secondo giro e basta in realtà
                classe.spostaFraDueCaselle(partenza_x, partenza_y, fine_x, fine_y, mov_x, mov_y, spostamento)
            })
        } else {
            //l'unica volta che spostamento è diverso da -1 è quando fa lo spostamento
            // della pedina dalla casellaIniziale alla prima casella
            if (spostamento != -1) {
                if (i == -1) { //primo giro
                    //Ora si muoverà dalla prima casella a quella in cui deve arrivare
                    // (spostamento-1 xkè un spostamento l'ha già fatto)
                    this.spostaPedina(1, spostamento - 1)
                } else {
                    if (i < spostamento) {
                        i += 1
                        console.log("Prendo " + (partenza - 1 + i) + " la i == " + i)
                        var x1 = this.caselle[partenza - 1 + i].getCenterX()
                        var y1 = this.caselle[partenza - 1 + i].getCenterY()

                        //prendo la casella successiva
                        var x2 = this.caselle[partenza - 1 + i + 1].getCenterX()
                        var y2 = this.caselle[partenza - 1 + i + 1].getCenterY()

                        this.spostaFraDueCaselle(x1, y1, x2, y2, 2, 2, spostamento, i)
                    } //else finito lo spostamento

                }
            }
        }
    }


    mostraPedina(posAvvessario) {
        if (this.posizione > 0) {
            let x = this.caselle[this.posizione - 1].getCenterX()
            let y = this.caselle[this.posizione - 1].getCenterY()

            /* DA VEDÈ COME FARE
			if(posAvvessario == this.posizione or this.sopraEffetto):
				if(this.tag == "PL1"):
					#più in alto
					y -= 15
				else:
					# più in basso
					y += 15
            draw_text(this.ctx, this.tag, 12, "#ff0000", x, y, "Arial", "bold")
        } else {
            //posizione "prima" del percorso
            this.creaCasellaIniziale()
        }
    }*/

    spostaPedina(posAvvessario) {
        if (this.posizione > 0) {
            this.casellaIniziale.nascondi()

            let x = this.caselle[this.posizione - 1].getCenterX()
            let y = this.caselle[this.posizione - 1].getCenterY()

            //Se sono nella stessa casella devono distanziarsi un minimo tra loro
            if (posAvvessario == this.posizione) {
                if (this.tag == "PL1") {
                    //più in alto
                    y -= 15
                } else {
                    //più in basso
                    y += 15
                }
            }
            let giocatore = document.getElementById(this.tag)
            giocatore.style.top = y + "px"
            giocatore.style.left = x + "px"
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
            this.posiziona(-(this.posizione - 1))
        } else if (codCasella == VITTORIA) {
            this.vincitore = true
        }

        if (eff != "") {
            this.penultimoEff = this.ultimoEff
            this.ultimoEff = eff

            //per mostrare i effetti
            this.crazyGoose.scriviEffetti(this, (this.tag == "PL1"))
        }

        if (spostamento != 0) {
            this.posiziona(spostamento)
        }
    }

}