const INFO_PL1 = "Tu (PL1)"
const INFO_COM = "Computer (COM)"
const INFO_DADO_PL1 = "Dado PL1: "
const INFO_DADO_COM = "Dado COM: "

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

        this.imgAbilita = document.getElementById("imgAbilita")
            //ad inizio partita di certo non potrà attivare l'abilita quindi questa è l'img di default
        this.evidenziaTempoRimanente(0)

        this.imgAbilita.addEventListener("click", () => {
            if (this.crazyGoose.player.abilitaAttivata == false &&
                this.crazyGoose.player.attendoAbilita) {

                this.crazyGoose.player.abilitaAttivata = true
            } else {
                console.log("finito nel else")
            }

        })
    }

    evidenziaTempoRimanente(ms) {
        //sarà l'ultimo giro, non disegno più
        if (ms > 100) {
            //(non parto da 0° ma da 90°, quindi non 360° ma 360°+90°)
            let gradi = (360 * ms / 2000) + 90

            //TODO codice per disegnare arco (magari css) intorno imgAbilita
            /*pygame.draw.arc(self.game.display, self.game.BLACK, pygame.Rect(
            	self.rect.x-2, self.rect.y-2, self.rect.width+4, self.rect.height+4
            ), math.radians(90), math.radians(gradi), 3)*/
        }

        let img = null
        if (this.crazyGoose.player.abilitaAttivata == false) {
            if (ms == 0) {
                img = this.imgNonPiu
            } else if (ms > 1000) {
                img = this.imgOk
            } else {
                img = this.imgQuasi
            }
        } else {
            img = this.imgNo
        }

        this.imgAbilita.src = img
    }

}


class CrazyGoose {
    constructor() {
        this.giocoPartito = false
    }

    start() {
        //Questo metodo è richiamato all'interno di un ciclo, quindi ho settato un flag,
        // per INIZIALIZZARE le variabili una volta soltanto.
        //(volendo il metodo può essere usato per RIAVVIARE il gioco
        //	N.B. BISOGNA RISETTARE A false il FLAG)
        if (this.giocoPartito == false) {
            this.giocoPartito = true
            this.partitaTerminata = false

            //Dentro questa lista ci saranno gli oggetti Casella
            this.caselle = []
                //Crea il percorso (casuale)
            this.percorso = new Percorso()

            this.imgDadoPL1 = new Image()
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

    disegnaTutto(giocDaNonDisegnare = null) {
        //Riempe la lista di caselle, cioè "disegna" gli ellissi.
        this.posizionaLeCaselle()
            //Scrive nelle caselle il loro effetto
        this.riempiCaselle()

        //this.scriviEffetti(this.player, true)

        this.imgCroce = document.getElementById("imgCroce")
        this.imgCroce.style.display = "none"
        this.containerDado = document.getElementsByClassName("scene")[0]

        this.buttonDadoPL1 = document.getElementById("dado_pl1")

        this.buttonDadoPL1.addEventListener("click", () => {

            //Controllo che sia il turno del PL1 (cioè che sia il suo turno o che l'avversario abbia un fermo)
            if (this.player != null && this.player.turniFermo == 0 && this.player.attendoAbilita == false) {
                if (this.player.turnoMio == true || (this.player.turnoMio == false && this.com.turniFermo > 0)) {
                    this.tiraDado()
                }
            }
        })

        this.buttonDadoPL1.addEventListener("mouseover", () => {
            if (this.player.turnoMio && this.player.isMoving == false && this.player.attendoAbilita == false) {
                this.imgCroce.style.display = "none"
                this.containerDado.style.backgroundColor = "green"
            } else {
                this.imgCroce.style.display = "block"
                this.containerDado.style.backgroundColor = "transparent"
            }
        })

        this.buttonDadoPL1.addEventListener("mouseout", () => {
            this.imgCroce.style.display = "none"
            this.containerDado.style.backgroundColor = "transparent"
        })

        //this.imgDadoCOM.src = "/res_static_gioco/images/img_dado/dado_1.png"
        this.buttonDadoCOM = document.getElementById("dado_com")
        this.buttonDadoCOM.appendChild(this.imgDadoCOM);

        this.player = new Giocatore(this, this.caselle, this.percorso, "PL1", sessionStorage.getItem("ocaScelta"))
        this.com = new Giocatore(this, this.caselle, this.percorso, "COM", null)

        //(dev'essere creato dopo this.player)
        //COMMENTATO xke bisogna ancora posizionarlo bene, MA FUNZIONA lasciatelo
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

            this.toccaAlCOM()

            this.segnalaChiTocca(false)
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
        eff1.style.display = "block"
        if (player_com.penultimoEff != "") {
            eff2.style.display = "block"
        }

        eff1.innerHTML = player_com.ultimoEff
        eff2.innerHTML = player_com.penultimoEff
    }

    stopCOM() {
        if (this.timeoutCOM != null) {
            clearTimeout(this.timeoutCOM)
            clearTimeout(this.timeoutCOM)
        }
    }

    tiraDado() {
        //Se la partita è terminata "blocca" la funzionalità del dado (anche se in realtà non serve xke non dovrebbe più vederlo il dado, e quindi cliccarlo)
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
        // faccio la sleep di 1 sec (dopo aver decrementato il fermo lancia il metodo
        // per far avanzare PL1 quindi tecnicamente si muove il PL1 e si deve muovere
        // subito non dopo 1 sec)
        if (this.com.turniFermo == 0) {
            //(* * * setTimeout esegue, in una sorta di altro processo (quindi non blocca il codice),
            // la funzione passata dopo tot millisecondi * * *)
            this.timeoutCOM = setTimeout(() => { this.avanzaCOM(numEstratto) }, 1000)
        } else {
            this.avanzaCOM(numEstratto)
        }
    }

    avanzaPlayer1(numEstratto, controllaCodCasella = true) {
        //se controllaCodCasella è false vuol dire che questo metodo è stato lanciato
        // da attivaAbilitaCOM(), quindi deve muovere il player di due posizioni indietro
        // anche se ha un fermo (e poi passa il flag ad avanza() per non far controllare il codCasella)
        if (controllaCodCasella && this.player.turniFermo > 0) {
            // Se il PL1 ha beccato un fermo in precedenza deve "consumarlo"
            // (sarà come se avesse tirato l'avversario)
            this.player.turniFermo -= 1

            this.player.turnoMio = false
            this.com.turnoMio = true

            this.segnalaChiTocca(false)

            this.toccaAlCOM(numEstratto)
        } else {
            /*(La prossima volta che verrà richiamato "disegnaTutto" il numero
                del dado sarà cambiato) */

            this.cambiaImgDado(numEstratto, this.imgDadoPL1, this.buttonDadoPL1, this.player)

            this.player.avanza(numEstratto, controllaCodCasella)

            //(* * * setinterval esegue, in una sorta di altro processo (quindi non blocca il codice),
            // la funzione passata OGNI tot millisecondi (finchè non lo si ferma con clearTimeout
            // continuerà ad eseguire ogni tot ms la funzione data) * * *)
            let idIntervalFineAvanza = setInterval(() => {
                if (this.player.isMoving == false) {
                    clearInterval(idIntervalFineAvanza)

                    //anche se fosse sulla casella del COM gli da la "possibilita di scappare" (oca verde ritira il dado,
                    // quindi si muove, oca blu avanza di 2)
                    if (this.player.abilitaAttivata == false) {
                        //Controllo che non sia finito su un "Tira di nuovo" o "Stai fermo x giri" (e ovviamente che abbia scelto l'oca verde)
                        if (this.player.pedinaScelta == "verde" &&
                            //Controllo che non sia finito su un "Tira di nuovo" o "Stai fermo x giri"    
                            this.player.turnoMio == false && this.player.turniFermo == 0) {

                            let numGiri = 0
                            let idIntervalAbilita = setInterval(() => {
                                //(controllo anche che il gioco non sia stato fermato)
                                if (this.giocoPartito && numGiri < 20) {

                                    this.player.attendoAbilita = true
                                    this.buttonAbilita.evidenziaTempoRimanente((2000 - numGiri * 100), true)

                                    if (this.player.abilitaAttivata) {
                                        numGiri = 20
                                        this.player.turnoMio = true
                                    } else {
                                        numGiri += 1
                                    }
                                } else {
                                    clearInterval(idIntervalAbilita)

                                    this.player.attendoAbilita = false

                                    //se ha attivato l'abilità cambierà img in NO.png altrimenti "ms" è passato a 0
                                    // quindi metterà NON_PIU.png
                                    this.buttonAbilita.evidenziaTempoRimanente(0)
                                        //this.player.isMoving = false

                                    //se ha attivato l'abilità turnoMio sarà a true e quindi lascerà tirare di nuovo il dado
                                    this.controllaAChiTocca()
                                }
                            }, 100)
                        } else if (this.player.pedinaScelta == "blu" &&
                            //Controllo che non sia finito su un "Tira di nuovo" o "Stai fermo x giri"    
                            this.player.turnoMio == false && this.player.turniFermo == 0) {

                            let numGiri = 0

                            let idIntervalAbilita = setInterval(() => {
                                //(controllo anche che il gioco non sia stato fermato)    
                                if (this.giocoPartito && numGiri < 20) {
                                    this.player.attendoAbilita = true
                                    this.buttonAbilita.evidenziaTempoRimanente((2000 - numGiri * 100), true)

                                    if (this.player.abilitaAttivata) {
                                        //fermerà il ciclo
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
                                        //this.player.isMoving = false

                                    if (this.player.abilitaAttivata) {
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
                        //già attivato l'abilita
                        this.controllaAChiTocca()
                    }
                }
            }, 100)
        }
    }

    controllaAChiTocca() {
        if (false && this.player.posizione == this.com.posizione &&
            this.player.posizione > 2) {

            //controllaAChiTocca() lo richiamo solo in avanzaPlayer1()
            this.attivaAbilitaCOM(true, this.player.turnoMio)
        } else {
            this.com.turnoMio = !this.player.turnoMio
            if (!this.player.vincitore) {
                //this.com.turnoMio = !this.player.turnoMio

                //se prende un fermo ANNULLA il fermo dell'avversario 
                //(SENNÒ NESSUNO GIOCHEREBBE PIÙ per alcuni turni)
                if (this.player.turniFermo > 0) {
                    this.com.turniFermo = 0
                        //Ora il PL1 ha un fermo, quindi tocca all'avversario sicuro
                    this.segnalaChiTocca(false)

                    //Lancerà il dado, entrerà in avanzaPlayer1 che
                    // decrementerà il suo fermo e lancerà avanzaCOM
                    this.tiraDado()
                } else {
                    if (this.com.turniFermo > 0) {
                        //Se l'avversario ha un fermo al 100% tocca al PL1...
                        this.segnalaChiTocca(true)
                    } else {
                        //L'avversario non ha un fermo MA non è detto che tocchi a lui 
                        // (PL1 potrebbe aver preso un TIRA DI NUOVO) quindi controllo
                        if (this.com.turnoMio) {
                            this.segnalaChiTocca(false)

                            this.toccaAlCOM()
                        } else {
                            this.segnalaChiTocca(true)
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
        //* * *  Per i commenti VEDI "avanzaPlayer1" * * *

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
                if (this.com.isMoving == false) {
                    clearInterval(idIntervalFineAvanza)

                    this.player.turnoMio = !this.com.turnoMio
                    if (false && this.player.posizione == this.com.posizione &&
                        this.player.posizione > 2) {

                        this.attivaAbilitaCOM(false, this.com.turnoMio)
                    } else {
                        if (!this.com.vincitore) {
                            if (this.com.turniFermo > 0) {
                                this.player.turniFermo = 0
                                this.segnalaChiTocca(true)
                            } else {
                                if (this.player.turniFermo > 0) {
                                    this.segnalaChiTocca(false)
                                    this.tiraDado()
                                } else {
                                    if (this.player.turnoMio) {
                                        this.segnalaChiTocca(true)
                                    } else {
                                        this.segnalaChiTocca(false)
                                        this.toccaAlCOM()
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
        //cambia un disegno e un wait

        //sposta indietro di 2 il player
        this.player.isMoving = true
            //false xke non dovrà controllare l'effetto della casella
        this.avanzaPlayer1(-2, false)

        let idIntervalFineAvanza = setInterval(() => {
            if (this.player.isMoving == false) {
                clearInterval(idIntervalFineAvanza)

                //per i commenti vedi avanzaPlayer1
                if (turnoPL1) {
                    if (this.player.turniFermo > 0) {
                        this.com.turniFermo = 0
                        this.segnalaChiTocca(false)

                        this.tiraDado()
                    } else {
                        if (this.com.turniFermo > 0) {
                            this.segnalaChiTocca(true)
                            this.player.turnoMio(true)
                        } else {
                            if (!toccaAncoraA_Me) {
                                this.segnalaChiTocca(false)
                                this.toccaAlCOM()
                            } else {
                                this.segnalaChiTocca(true)
                                this.player.turnoMio(true)
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
                            this.tiraDado()
                        } else {
                            //siamo nel turno del COM, quindi se il flag è true tocca al COM
                            if (toccaAncoraA_Me) {
                                this.segnalaChiTocca(false)
                                this.toccaAlCOM()
                            } else {
                                this.segnalaChiTocca(true)
                                this.player.turnoMio(true)
                            }
                        }
                    }
                }
            }
        }, 100)


        //finito il turno, segnala chi tocca
    }

    cambiaImgDado(numEstratto, imgDado, buttonDado, giocatore) {

        let cube = null;
        //QuerySelector vengono usati per ricollegarsi ai css
        if (giocatore.tag == "PL1") {
            cube = document.querySelector('.cube');
            console.log("TORNO PLAYER")
        } else {
            cube = document.querySelector('.cubeCOM');
            console.log("TURNO COMPUTER")
        }

        //our main roll dice function on click
        function rollDice() {
            var showClass = 'show-' + numEstratto;

            if (giocatore.currClassValue != null) {
                cube.classList.remove(giocatore.currClassValue);
                //console.log("ENTRO PER RIMUOVERE")
            }

            //console.log("ESCO DALL'IF BOI")

            //add the new showclass with the generated number
            cube.classList.add(showClass);

            //set the current class to the randomly generated number
            giocatore.currClassValue = showClass;

        }

        //if controlla solo se il numEstratto è diverso da null, allora il dado ruota
        if (numEstratto > 0) {
            rollDice()
        }

        /*
            - cambiato il nome in cambiaImgDado xke imgDado sembra più un attributo, così si capisce meglio che è un metodo
            - visto che abbiamo a disposizione lo switch (su python no :( )...
            - width height non ce bisogno di settarli xke l'img ora è 70x70px
            - this.buttonDadoPL1 ce l'hai già, non ti serve rifare la document.getElementById
            
           this.imgDadoPL1.style.width="70px";
           this.imgDadoPL1.style.height="70px";
           this.buttonDadoPL1 = document.getElementById("dado_pl1")
            */
    }

    segnalaVincitore(pl1_ha_vinto) {
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
        } else {
            chiTocca = document.getElementById("info_com")
            chiAspetta = document.getElementById("info_pl1")
        }
        chiTocca.style.padding = "1px"
        chiTocca.style.border = "2px solid red"

        //rimuovo il bordo (lo nascondo in pratica)
        chiAspetta.style.padding = "0px"
        chiAspetta.style.border = "2px none red"
    }

    riempiCaselle() {
        /*Cicla per ogni casella e controlla, se la posizione della casella
         c'è tra le chiavi del dizionario del percorso allora "carico" l'effetto
         (prendendo il codice contenuto nel valore con quella chiave, il codice della casella),
         altrimenti non metto nulla (uso il codice -1)*/
        //TODO controllare bene se gira per tutte le caselle
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