const INFO_PL1 = "Tu (PL1)"
const INFO_COM = "Computer (COM)"

class Dado {
    tiraDado() {
        //num casuale tra 0 e 5 => +1 => num casuale tra 1 e 6
        return (Math.floor(Math.random() * 6) + 1)
    }
}

class ButtonAbilitaPL1 {
    constructor(crazyGoose, pedinaScelta) {
        this.crazyGoose = crazyGoose

        let cartella = ""
        if (pedinaScelta == "gialla") {
            cartella = "/OcaGialla"
        } else if (pedinaScelta == "verde") {
            cartella = "/OcaVerde"
        } else if (pedinaScelta == "blu") {
            cartella = "/OcaBlu"
        } else if (pedinaScelta == "rossa") {
            cartella = "/OcaRossa"
        }

        this.imgOk = "res_static_gioco/images/imgAbilita" + cartella + "/OK.png"
        this.imgQuasi = "res_static_gioco/images/imgAbilita" + cartella + "/QUASI.png"
        this.imgNonPiu = "res_static_gioco/images/imgAbilita" + cartella + "/NON_PIU.png"
        this.imgNo = "res_static_gioco/images/imgAbilita" + cartella + "/NO.png"

        //sempplice label dove ci sarà il countdown di quanto gli resta per attivare l'abilità
        this.tmpRimanenteAbilita = document.getElementById("tmpRimanenteAbilita")
        this.imgAbilita = document.getElementById("imgAbilita")
            //Gli passo 0 così (siamo all'inizio partita) mette l'img NON_PIU (img rossa, senza sbarre però)
        this.evidenziaTempoRimanente(0)

        this.imgAbilita.addEventListener("click", () => {
            //se non ha ancora attivato l'abilità, e il countdown per attivarla sta girando
            // (attendoAbilita è true) allora cambio il flag di abilitAttivata al player
            if (this.crazyGoose.player.abilitaAttivata == false &&
                this.crazyGoose.player.attendoAbilita) {

                this.crazyGoose.player.abilitaAttivata = true
            }
        })
    }

    evidenziaTempoRimanente(ms) {
        if (ms > 100) {
            /*Qui c'era il codice per ricavare i gradi per fare un arco intorno
             all'abilità ma non so come fare un arco in html/css
            //(non parto da 0° ma da 90°, quindi non 360° ma 360°+90°)
            let gradi = (360 * ms / 2000) + 90

            pygame.draw.arc(self.game.display, self.game.BLACK, pygame.Rect(
            	self.rect.x-2, self.rect.y-2, self.rect.width+4, self.rect.height+4
            ), math.radians(90), math.radians(gradi), 3)*/
            this.tmpRimanenteAbilita.innerHTML = ((ms / 1000) + " s")
        } else {
            this.tmpRimanenteAbilita.innerHTML = ("0.0 s")
        }

        let img = this.imgNo
        if (this.crazyGoose.player.abilitaAttivata == false) {
            if (ms == 0) { //rosso, ma senza sbarre (la può usare alla prossima occasione)
                img = this.imgNonPiu
            } else if (ms > 1000) { //verde
                img = this.imgOk
            } else { //arancio
                img = this.imgQuasi
            }
        } //else la img è inizializzata con NO.png (già usato l'abilità)

        this.imgAbilita.src = img
    }
}


class CrazyGoose {
    constructor() {
        this.giocoPartito = false
    }

    start() {
        if (this.giocoPartito == false) {
            this.giocoPartito = true
            this.partitaTerminata = false

            //Dentro questa lista ci saranno gli oggetti Casella
            this.caselle = []
                //Crea il percorso (casuale)
            this.percorso = new Percorso()

            this.imgDadoPL1 = new Image()
            this.mouseOverDadoPL1 = false
            this.imgDadoCOM = new Image()

            this.buttonDadoCOM = null
            this.buttonDadoPL1 = null
            this.buttonAbilitaPL1 = null
            this.player = null
            this.com = null
            this.turnoCOM = null
            this.timeoutCOM = null

            this.disegnaTutto()
        }
    }

    disegnaTutto() {
        //Riempe la lista di caselle, cioè "disegna" gli ellissi.
        this.posizionaLeCaselle()
            //Scrive nelle caselle il loro effetto
        this.riempiCaselle()

        this.imgCroce = document.getElementById("imgCroce")
            //la croce sul dado verrà mostrata solo quando necessario, altrimenti è nascosta
        this.imgCroce.style.display = "none"
            //il container sarà riempito d verde quando l'utente passa sopra al dado quand'è il suo turno
        this.containerDado = document.getElementsByClassName("scene")[0]
        this.buttonDadoPL1 = document.getElementById("dado_pl1")

        this.buttonDadoPL1.addEventListener("click", () => {

            //controlla che : non abbia un fermo, non stia per attivare l'abilità,
            // sia il suo turno (se ha il flag a true o se l'avvessario ha un fermo)
            if (this.player != null && this.player.turniFermo == 0 && this.player.attendoAbilita == false &&
                this.player.turnoMio == true || (this.player.turnoMio == false && this.com.turniFermo > 0)) {
                this.tiraDado()
            }
        })

        this.buttonDadoPL1.addEventListener("mouseover", () => {
            this.mouseOverDadoPL1 = true
                //controlla se deve mostrare il rett. verde oppure la croce (se può lanciare il dado o meno)

            if ((this.player.turnoMio || this.com.turniFermo > 0) && this.player.isMoving == false && this.player.attendoAbilita == false) {
                this.imgCroce.style.display = "none"
                this.containerDado.style.backgroundColor = "green"
            } else {
                this.imgCroce.style.display = "block"
                    //non posso cancellare il colore di background, ma posso metterlo "invisibile"
                this.containerDado.style.backgroundColor = "transparent"
            }
        })

        this.buttonDadoPL1.addEventListener("mouseout", () => {
            this.mouseOverDadoPL1 = false

            this.imgCroce.style.display = "none"
            this.containerDado.style.backgroundColor = "transparent"
        })

        this.buttonDadoCOM = document.getElementById("dado_com")

        this.player = new Giocatore(this, this.caselle, this.percorso, "PL1", sessionStorage.getItem("ocaScelta"))
            //(gli serve sapere che oca ha scelto l'avversario per scegliere le giuste img)
        this.com = new Giocatore(this, this.caselle, this.percorso, "COM", sessionStorage.getItem("ocaScelta"))

        //(gli serve sapere che oca ha scelto l'avversario per scegliere le giuste img)
        this.buttonAbilita = new ButtonAbilitaPL1(this, sessionStorage.getItem("ocaScelta"))

        // Decide chi incomincia, tira il dado e vede se il numero tirato è pari o dispari
        // (tra 1 e 6 ci sono 3 pari e 3 dispari, perciò 50% possbilità a testa)
        let random = (new Dado()).tiraDado()
        if (random % 2 == 0) {
            this.player.turnoMio = true
            this.com.turnoMio = false

            this.segnalaChiTocca(true)
        } else {
            this.player.turnoMio = false
            this.com.turnoMio = true

            this.segnalaChiTocca(false)

            this.toccaAlCOM()
        }
    }

    scriviEffetti(player_com, isPL1) {
        let eff1 = null
        let eff2 = null
        if (isPL1) {
            eff1 = document.getElementById("eff1_pl1")
            eff2 = document.getElementById("eff2_pl1")
        } else {
            eff1 = document.getElementById("eff1_com")
            eff2 = document.getElementById("eff2_com")
        }
        //di certo mostra il primo effetto (l'ultimo)
        eff1.style.display = "block"
            //se ha un penultimo effetto mostra anche il secondo effetto
        if (player_com.penultimoEff[0] != "") {
            eff2.style.display = "block"
        }

        //ultimoEff | penultimoEff sono una lista di due elem:
        // primoElem = stringaDellEffetto; secondoElem = coloreDelEffetto

        eff1.innerHTML = player_com.ultimoEff[0]
        eff1.style.backgroundColor = player_com.ultimoEff[1]

        eff2.innerHTML = player_com.penultimoEff[0]
        eff2.style.backgroundColor = player_com.penultimoEff[1]
    }

    stopCOM() {
        //se stoppasse il gioco mentre il COM stia aspettando di lanciare lo ferma
        if (this.timeoutCOM != null) {
            clearTimeout(this.timeoutCOM)
        }
    }

    tiraDado() {
        //Se la partita è terminata "blocca" la funzionalità del dado (anche se in realtà non serve xke
        // non può più vederlo, e quindi cliccarlo)
        if (!this.partitaTerminata) {
            let numEstratto = (new Dado()).tiraDado()

            if (this.player.turnoMio) {
                this.avanzaPlayer1(numEstratto)
            } else {
                this.toccaAlCOM()
            }
        }
    }

    toccaAlCOM(numEstratto = -1) {
        //Se il num del dado non viene passato (è settato a -1) lancia il dado
        if (numEstratto == -1) {
            numEstratto = (new Dado()).tiraDado()
        }

        //Non devo bloccare il PL1 per 1 secondo, quindi se il COM ha un fermo non
        // faccio la sleep di 1 sec (xke dopo aver decrementato il fermo del COM lancia il metodo
        // per far avanzare PL1 quindi tecnicamente si muove il PL1 e si deve muovere
        // SUBITO non dopo 1 sec)
        if (this.com.turniFermo == 0) {
            //(* * * setTimeout esegue, in una sorta di altro processo (quindi non blocca il codice),
            // la funzione passata dopo tot millisecondi * * *)
            this.timeoutCOM = setTimeout(() => { this.avanzaCOM(numEstratto) }, 1000)
        } else {
            this.avanzaCOM(numEstratto)
        }
    }

    avanzaPlayer1(numEstratto, controllaCodCasella = true) {
        /*(Per testare abilità grimilde; lancia il numero esatto per finire
             sulla casella dell'avversario)
        if (this.player.posizione < this.com.posizione) {
            numEstratto = this.com.posizione - this.player.posizione
        }*/
        /*(Per testare vittoria)
        numEstratto = 40*/

        //se fossero sulla stessa casella (la prima o la seconda) in cui non si attiva l'effetto
        // sono rimasti fermi e con la stessa img di prima, quindi ora (che il PL1 si muove) devo cambiarla 
        if (this.com.posizione == this.player.posizione) {
            this.com.imgPedina.src = this.com.percorsoImgSxDx
            this.player.imgPedina.src = this.player.percorsoImgSxDx
        }

        //se controllaCodCasella è false vuol dire che questo metodo è stato lanciato
        // da attivaAbilitaCOM(), quindi deve muovere il player di due posizioni indietro
        // anche se ha un fermo (e poi passa il flag ad avanza() per non far controllare il codCasella)
        if (controllaCodCasella && this.player.turniFermo > 0) {
            // Se il PL1 ha beccato un fermo in precedenza deve "consumarlo", quindi decrementa
            // il numero di turni rimasti e fa muovere l'avversario
            // (sarà come se avesse tirato l'avversario)
            this.player.turniFermo -= 1

            this.player.turnoMio = false
            this.com.turnoMio = true

            this.segnalaChiTocca(false)

            this.toccaAlCOM(numEstratto)
        } else {
            this.cambiaImgDado(numEstratto, this.imgDadoPL1, this.buttonDadoPL1, this.player)

            this.player.avanza(numEstratto, controllaCodCasella)

            //(* * * setinterval esegue, in una sorta di altro processo (quindi non blocca il codice),
            // la funzione passata OGNI tot millisecondi (finchè non lo si ferma con clearTimeout
            // continuerà ad eseguire ogni tot ms la funzione data) * * *)
            let idIntervalFineAvanza = setInterval(() => {
                //Controllo che abbia finito il turno, cioè che abbia smesso di muoversi
                /*Se il flagTiroLungo è true vuol dire che la pedina si muoverà fino alla casella finale
                    e poi tornerà indietro di tot caselle. Realmente, il turno NON finisce quando è arrivato
                    sulla casella finale, quindi deve aspettare che sia anche tornato indietro di tot*/
                if (this.player.isMoving == false && this.player.flagTiroLungo == false) {
                    //!!! bisogna sempre "cancellare" l'interval, sennò continua ALL'INFINITO
                    clearInterval(idIntervalFineAvanza)

                    //anche se fosse sulla casella del COM gli da la "possibilita di scappare" (oca verde ritira il dado,
                    // quindi si muove, oca blu avanza di 2)

                    //Controllo che controllaCodCasella sia true xke, quando si attiva l'abilità del COM
                    // e controllaCodCasella è false, NON DEVO POTER USARE LA MIA ABILITA (a fine dello 
                    // spostamento), proprio come non devo controllare su che casella sono finito
                    if (controllaCodCasella) {
                        //Controllo che non abbia già usato l'abilità e che non abbia vinto
                        if (this.player.abilitaAttivata == false && this.player.vincitore == false) {
                            if (this.player.pedinaScelta == "verde" &&
                                //Controllo che non sia finito su un "Tira di nuovo" o "Stai fermo x giri"    
                                this.player.turnoMio == false && this.player.turniFermo == 0 &&
                                // e che non ci sia finito neanche l'avversario
                                this.com.turniFermo == 0) {

                                //farò 20 giri, ogni 100millisecondi ==> 2 secondi di tempo do
                                // all'utente per usare l'abilità
                                let numGiri = 0
                                let idIntervalAbilita = setInterval(() => {
                                    //(controllo anche che il gioco non sia stato fermato)
                                    if (this.giocoPartito && numGiri < 20) {
                                        //(flag che serve nel click sull'img dell'abilità)
                                        this.player.attendoAbilita = true
                                        this.buttonAbilita.evidenziaTempoRimanente((2000 - numGiri * 100), true)

                                        if (this.player.abilitaAttivata) {
                                            //fermo il loop
                                            numGiri = 20
                                                //oca verde ==> ritira il dado; mi basta settare un flag
                                            this.player.turnoMio = true
                                        } else {
                                            numGiri += 1
                                        }
                                    } else {
                                        clearInterval(idIntervalAbilita)

                                        //non può più cliccare sull'abiltà
                                        this.player.attendoAbilita = false

                                        //Se ha attivato l'abilità cambierà img in NO.png altrimenti "ms" è 
                                        // passato a 0 quindi metterà NON_PIU.png
                                        this.buttonAbilita.evidenziaTempoRimanente(0)

                                        //se ha attivato l'abilità turnoMio sarà a true. In questo metodo
                                        // controllo questi flag e quindi farò rigiocare il PL1
                                        this.controllaAChiTocca(false)
                                    }
                                }, 100)
                            } else if (this.player.pedinaScelta == "blu" &&
                                this.player.turnoMio == false && this.player.turniFermo == 0) {

                                //* * * PER COMMENTI VEDERE ABILITÀ SOPRA OCA VERDE  * * *

                                let numGiri = 0
                                let idIntervalAbilita = setInterval(() => {
                                    if (this.giocoPartito && numGiri < 20) {
                                        this.player.attendoAbilita = true
                                        this.buttonAbilita.evidenziaTempoRimanente((2000 - numGiri * 100), true)

                                        if (this.player.abilitaAttivata) {
                                            numGiri = 20
                                        } else {
                                            numGiri += 1
                                        }
                                    } else {
                                        clearInterval(idIntervalAbilita)

                                        this.player.attendoAbilita = false

                                        //se ha attivato l'abilità cambierà img in NO.png altrimenti "ms" è passato a 0
                                        // quindi metterà NON_PIU.png
                                        this.buttonAbilita.evidenziaTempoRimanente(0)

                                        if (this.player.abilitaAttivata) {
                                            //fa avanzare di due caselle l'oca
                                            this.avanzaPlayer1(2)
                                        } else {
                                            this.controllaAChiTocca()
                                        }
                                    }
                                }, 100)
                            } else {
                                //ne oca "blu" ne "verde"
                                this.controllaAChiTocca()
                            }
                        } else {
                            //già attivato l'abilita oppure ha vinto
                            this.controllaAChiTocca()
                        }
                    } //else avanzaPlayer1() lanciato da attivaAbilitaCOM(), i controlli li fa lui
                }
            }, 100)
        }
    }

    controllaAChiTocca(controllaAbilitaCOM = true) {
        //controllaAbilitaCOM è false QUANDO ATTIVA L'ABILITA VERDE
        // (diciamo che gli lasciamo la possibiltà di scappare ed evitare l'abilità
        // del COM)

        if (controllaAbilitaCOM && this.player.posizione == this.com.posizione) {
            this.attivaAbilitaCOM(true, this.player.turnoMio)
        } else {
            if (!this.player.vincitore) {
                //this.com.turnoMio = !this.player.turnoMio

                //se prende un fermo ANNULLA il fermo dell'avversario 
                //(SENNÒ NESSUNO GIOCHEREBBE PIÙ per alcuni turni)
                if (this.player.turniFermo > 0) {
                    this.com.turniFermo = 0
                        //Ora il PL1 ha un fermo, quindi tocca all'avversario sicuro
                    this.segnalaChiTocca(false)

                    //questo mi serve xke così in tiraDado() avvierà
                    // avanzaPLayer1() che decrementerà il contatore di
                    // turni fermi del player (e farà muovere il com)
                    this.player.turnoMio = true
                    this.tiraDado()
                } else {
                    if (this.com.turniFermo > 0) {
                        //Se l'avversario ha un fermo al 100% tocca al PL1...
                        this.segnalaChiTocca(true)
                            //(devo settarlo a false così in tiraDado() mi andrà nel false, e in avanzaCOM() decrementerà il contatore dei turni fermo edl PL1)
                        this.player.turnoMio = false
                    } else {
                        //L'avversario non ha un fermo MA non è detto che tocchi a lui 
                        // (PL1 potrebbe aver preso un TIRA DI NUOVO) quindi controllo
                        if (this.player.turnoMio) {
                            this.segnalaChiTocca(true)
                        } else {
                            this.segnalaChiTocca(false)
                            this.toccaAlCOM()
                        }
                    }
                }
            } else {
                //Segnala PL1 come vincitore e fa TERMINARE la partita
                this.segnalaVincitore(true)
                this.partitaTerminata = true
            }
        }
    }

    avanzaCOM(numEstratto) {
        //* * *  Per i commenti VEDI "avanzaPlayer1()" * * *

        /*if (this.player.posizione > this.com.posizione) {
            numEstratto = this.player.posizione - this.com.posizione
        }*/
        /*(Per testare sconfitta)
        numEstratto = 40*/

        if (this.com.posizione == this.player.posizione) {
            this.com.imgPedina.src = this.com.percorsoImgSxDx
            this.player.imgPedina.src = this.player.percorsoImgSxDx
        }


        if (this.com.turniFermo > 0) {
            this.com.turniFermo -= 1

            this.player.turnoMio = true
            this.com.turnoMio = false

            this.segnalaChiTocca(true)

            this.avanzaPlayer1(numEstratto)
        } else {
            this.cambiaImgDado(numEstratto, this.imgDadoCOM, this.buttonDadoCOM, this.com)

            this.com.avanza(numEstratto)

            let idIntervalFineAvanza = setInterval(() => {
                if (this.com.isMoving == false && this.com.flagTiroLungo == false) {
                    clearInterval(idIntervalFineAvanza)

                    if (this.player.posizione == this.com.posizione) {
                        this.attivaAbilitaCOM(false, this.com.turnoMio)
                    } else {
                        if (!this.com.vincitore) {
                            if (this.com.turniFermo > 0) {
                                this.player.turniFermo = 0
                                this.segnalaChiTocca(true)
                            } else {
                                if (this.player.turniFermo > 0) {
                                    this.segnalaChiTocca(false)
                                        //questo mi serve xke così in tiraDado() avvierà
                                        // avanzaPLayer1() che decrementerà il contatore di
                                        // turni fermi del player (e farà muovere il com)
                                    this.player.turnoMio = true
                                    this.tiraDado()
                                } else {
                                    if (this.com.turnoMio) {
                                        this.segnalaChiTocca(false)
                                        this.toccaAlCOM()
                                    } else {
                                        this.player.turnoMio = true
                                        this.segnalaChiTocca(true)
                                    }
                                }
                            }
                        } else {
                            this.segnalaVincitore(false)
                            this.partitaTerminata = true
                        }
                    }
                }
            }, 100)
        }
    }

    attivaAbilitaCOM(turnoPL1, toccaAncoraA_Me) {
        //Mette le immagini dello scontro (dentro a cambiaVersoPedina()) poi DOPO UN ATTIMO
        // sposta il player di due caselle indietro. Si salva le immagini senza lo scontro precedenti
        // costì da ricambiare le immagini quando il player si sposta (e quindi non
        // sono più una sopra l'altro)

        let prevImg = [this.com.imgPedina.src, this.player.imgPedina.src]
        this.com.imgPedina.src = this.com.cambiaVersoPedina()
        this.player.imgPedina.src = this.player.cambiaVersoPedina()

        //(* * * setTimeout esegue, in una sorta di altro processo (quindi non blocca il codice),
        // la funzione passata dopo tot millisecondi * * *)
        let idTimeoutImgScontro = setTimeout(() => {
            if (this.player.posizione > 2) {
                this.com.imgPedina.src = prevImg[0]
                this.player.imgPedina.src = prevImg[1]
                    //false xke non dovrà controllare l'effetto della casella o provare ad attivare l'abilità
                    // (oca verde o blu)
                this.avanzaPlayer1(-2, false)
            } else {
                this.player.isMoving = false
            }

            let idIntervalFineAvanza = setInterval(() => {
                if (this.player.isMoving == false) {
                    clearInterval(idIntervalFineAvanza)

                    if (turnoPL1) {
                        if (this.player.turniFermo > 0) {
                            this.com.turniFermo = 0
                            this.segnalaChiTocca(false)
                            this.player.turnMio = true
                            this.tiraDado()
                        } else {
                            if (this.com.turniFermo > 0) {
                                this.segnalaChiTocca(true)
                                this.player.turnoMio = true
                            } else {
                                if (!toccaAncoraA_Me) { //tocca al COM
                                    this.segnalaChiTocca(false)
                                    this.toccaAlCOM()
                                } else { //tocca a me PL1 (ramo vero del if turnoPL1)
                                    this.segnalaChiTocca(true)
                                    this.player.turnoMio = true
                                }
                            }
                        }
                    } else {
                        if (this.com.turniFermo > 0) {
                            this.player.turniFermo = 0
                            this.segnalaChiTocca(true)
                        } else {
                            if (this.player.turniFermo > 0) {
                                this.segnalaChiTocca(false)
                                this.player.turnMio = true
                                this.tiraDado()
                            } else {
                                if (toccaAncoraA_Me) { //tocca al COM (ramo false del if turnoPL1)
                                    this.segnalaChiTocca(false)
                                    this.toccaAlCOM()
                                } else { //tocca al PL1
                                    this.segnalaChiTocca(true)
                                    this.player.turnoMio = true
                                }
                            }
                        }
                    }
                }
            }, 100)
        }, 700)
    }

    cambiaImgDado(numEstratto, imgDado, buttonDado, giocatore) {

        let cube = null;
        //QuerySelector vengono usati per ricollegarsi ai css
        if (giocatore.tag == "PL1") {
            cube = document.querySelector('.cube');
        } else {
            cube = document.querySelector('.cubeCOM');
        }

        //our main roll dice function on click
        function rollDice() {
            var showClass = 'show-' + numEstratto;

            if (giocatore.currClassValue != null) {
                cube.classList.remove(giocatore.currClassValue);
            }

            //add the new showclass with the generated number
            cube.classList.add(showClass);

            //set the current class to the randomly generated number
            giocatore.currClassValue = showClass;

        }

        //if controlla solo se il numEstratto è > 0, allora il dado ruota
        if (numEstratto > 0) {
            rollDice()
        }
    }

    segnalaVincitore(pl1_ha_vinto) {
        //nasconde l'intero gioco
        document.getElementById("gioco").style.display = "none"

        if (pl1_ha_vinto) {
            document.getElementById("vittoria").style.display = "block"
        } else {
            document.getElementById("sconfitta").style.display = "block"
        }

    }

    segnalaChiTocca(tocca_al_pl1) {
        let chiTocca = null
        let chiAspetta = null
        if (tocca_al_pl1) {
            chiTocca = document.getElementById("info_pl1")
            chiAspetta = document.getElementById("info_com")

            /*CODCIE PER TOGLIERE LA CROCE E MOSTRARE IL RETT. VERDE QUANDO SI È COL MOUSE SUL
                DADO E SI PASSA DAL TURNO DEL COM AL TUO (PL1)
                * * * DA SISTEMARE * * *
            //all'inizio (appena si avvia il gioco) non deve mostrare il contorno verde
            // Una volta iniziato se si clicca sul dado per muoversi va subito a mostrare
            // la croce xke tocca al COM, ma poi, finito il turno del com, bisognerebbe
            // uscire e rientrare dal dado se non ci fosse questa parte
            if (this.mouseOverDadoPL1 && this.player.posizione > 0 || this.com.posizione > 0) {
                this.imgCroce.style.display = "none"
                this.containerDado.style.backgroundColor = "green"
            }*/
        } else {
            chiTocca = document.getElementById("info_com")
            chiAspetta = document.getElementById("info_pl1")
        }
        chiTocca.style.padding = "1px"
        chiTocca.style.border = "4px solid red"

        //rimuovo il bordo (lo nascondo in pratica)
        chiAspetta.style.padding = "0px"
        chiAspetta.style.border = "4px none red"
    }

    riempiCaselle() {
        /*Cicla per ogni casella e controlla, se la posizione della casella
         c'è tra le chiavi del dizionario del percorso allora "carico" l'effetto
         (prendendo il codice contenuto nel valore con quella chiave, il codice della casella),
         altrimenti non metto nulla (uso il codice -1)*/
        for (let i = 1; i <= 40; i++) {
            let casella = this.caselle[i - 1]
            try {
                casella.settaEffetto(this.percorso.dictCaselle[i])
            } catch (err) {
                //chiave inesistente (cioè posizione VUOTA)
                casella.settaEffetto(-1)
            }
        }
    }

    posizionaLeCaselle() {
        //POSIZIONA LE CASELLA CON I PIXEL
        this.caselle.push(new Casella(1, 450, 625))
        this.caselle.push(new Casella(2, 560, 625))
        this.caselle.push(new Casella(3, 670, 625))
        this.caselle.push(new Casella(4, 780, 625))
        this.caselle.push(new Casella(5, 900, 625))
        this.caselle.push(new Casella(6, 1015, 625))

        this.caselle.push(new Casella(7, 1105, 570))
        this.caselle.push(new Casella(8, 1155, 500))
        this.caselle.push(new Casella(9, 1165, 430))
        this.caselle.push(new Casella(10, 1155, 360))
        this.caselle.push(new Casella(11, 1105, 290))

        this.caselle.push(new Casella(12, 1030, 235))
        this.caselle.push(new Casella(13, 920, 205))
        this.caselle.push(new Casella(14, 820, 205))
        this.caselle.push(new Casella(15, 700, 205))
        this.caselle.push(new Casella(16, 590, 205))
        this.caselle.push(new Casella(17, 490, 245))

        this.caselle.push(new Casella(18, 445, 325))
        this.caselle.push(new Casella(19, 445, 410))
        this.caselle.push(new Casella(20, 455, 495))

        this.caselle.push(new Casella(21, 535, 555))
        this.caselle.push(new Casella(22, 645, 555))
        this.caselle.push(new Casella(23, 755, 555))
        this.caselle.push(new Casella(24, 865, 555))
        this.caselle.push(new Casella(25, 975, 545))

        this.caselle.push(new Casella(26, 1055, 490))
        this.caselle.push(new Casella(27, 1055, 405))
        this.caselle.push(new Casella(28, 1000, 330))

        this.caselle.push(new Casella(29, 905, 285))
        this.caselle.push(new Casella(30, 795, 285))
        this.caselle.push(new Casella(31, 685, 285))

        this.caselle.push(new Casella(32, 585, 320))
        this.caselle.push(new Casella(33, 550, 395))
        this.caselle.push(new Casella(34, 590, 470))

        this.caselle.push(new Casella(35, 700, 485))
        this.caselle.push(new Casella(36, 810, 485))
        this.caselle.push(new Casella(37, 910, 465))

        this.caselle.push(new Casella(38, 945, 395))
        this.caselle.push(new Casella(39, 845, 360))
        this.caselle.push(new Casella(40, 695, 380, true))
    }
}