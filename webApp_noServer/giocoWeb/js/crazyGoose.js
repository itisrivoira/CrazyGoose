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

            this.buttonDadoPL1 = null
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

        //Il primo argomento è this xke necessita di questa classe per
        // richiamarne il metodo "tiraDado"
        this.buttonDadoPL1 = document.getElementById("dado_pl1")
        this.buttonDadoPL1.addEventListener("click", () => {

            //Controllo che sia il turno del PL1 (cioè che sia il suo turno o che l'avversario abbia un fermo)
            if (this.player != null && this.player.turniFermo == 0) {
                if (this.player.turnoMio == true || (this.player.turnoMio == false && this.com.turniFermo > 0)) {
                    this.tiraDado()
                }
            }

        })

        this.player = new Giocatore(this, this.caselle, this.percorso, "PL1")
        this.com = new Giocatore(this, this.caselle, this.percorso, "COM")


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

    avanzaPlayer1(numEstratto) {
        if (this.player.turniFermo > 0) {
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
            this.buttonDadoPL1.innerHTML = numEstratto

            this.player.avanza(numEstratto)

            //(* * * setinterval esegue, in una sorta di altro processo (quindi non blocca il codice),
            // la funzione passata OGNI tot millisecondi (finchè non lo si ferma con clearTimeout
            // continuerà ad eseguire ogni tot ms la funzione data) * * *)
            let idIntervalFineAvanza = setInterval(() => {
                if (this.player.isMoving == false) {
                    clearInterval(idIntervalFineAvanza)

                    if (!this.player.vincitore) {
                        this.com.turnoMio = !this.player.turnoMio

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
            }, 100)
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
            document.getElementById("dado_com").innerHTML = numEstratto

            this.com.avanza(numEstratto)

            let idIntervalFineAvanza = setInterval(() => {
                if (this.com.isMoving == false) {
                    clearInterval(idIntervalFineAvanza)

                    if (!this.com.vincitore) {
                        this.player.turnoMio = !this.com.turnoMio
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
            }, 100)
        }
    }

    segnalaVincitore(pl1_ha_vinto) {
        if (pl1_ha_vinto) {
            alert("ANCORA DA IMPLEMENTARE !!!!          PL1 HA VINTO.")
        } else {
            alert("ANCORA DA IMPLEMENTARE !!!!          COM HA VINTO.")
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
        this.caselle.push(new Casella(1, 130, 525))
        this.caselle.push(new Casella(2, 240, 525))
        this.caselle.push(new Casella(3, 350, 525))
        this.caselle.push(new Casella(4, 460, 525))
        this.caselle.push(new Casella(5, 570, 525))
        this.caselle.push(new Casella(6, 680, 525))

        this.caselle.push(new Casella(7, 785, 470))
        this.caselle.push(new Casella(8, 835, 400))
        this.caselle.push(new Casella(9, 845, 330))
        this.caselle.push(new Casella(10, 835, 260))
        this.caselle.push(new Casella(11, 785, 190))

        this.caselle.push(new Casella(12, 710, 135))
        this.caselle.push(new Casella(13, 600, 105))
        this.caselle.push(new Casella(14, 490, 105))
        this.caselle.push(new Casella(15, 380, 105))
        this.caselle.push(new Casella(16, 270, 105))
        this.caselle.push(new Casella(17, 170, 145))

        this.caselle.push(new Casella(18, 125, 225))
        this.caselle.push(new Casella(19, 125, 310))
        this.caselle.push(new Casella(20, 125, 395))

        this.caselle.push(new Casella(21, 215, 455))
        this.caselle.push(new Casella(22, 325, 455))
        this.caselle.push(new Casella(23, 435, 455))
        this.caselle.push(new Casella(24, 545, 455))
        this.caselle.push(new Casella(25, 653, 445))

        this.caselle.push(new Casella(26, 735, 390))
        this.caselle.push(new Casella(27, 735, 305))
        this.caselle.push(new Casella(28, 680, 230))

        this.caselle.push(new Casella(29, 585, 185))
        this.caselle.push(new Casella(30, 475, 185))
        this.caselle.push(new Casella(31, 365, 185))

        this.caselle.push(new Casella(32, 265, 220))
        this.caselle.push(new Casella(33, 230, 295))
        this.caselle.push(new Casella(34, 270, 370))

        this.caselle.push(new Casella(35, 380, 385))
        this.caselle.push(new Casella(36, 490, 385))
        this.caselle.push(new Casella(37, 590, 365))

        this.caselle.push(new Casella(38, 625, 295))
        this.caselle.push(new Casella(39, 525, 260))
        this.caselle.push(new Casella(40, 375, 280, true))
    }
}