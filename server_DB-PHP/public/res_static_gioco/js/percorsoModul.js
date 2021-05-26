const QTA_CASELLE_TOTALI = 40
    //caselle con effetto randomico (NON include l'ultima e la penultima casella che sono SEMPRE UGUALI)
const QTA_CASELLE_DINAMICHE = 22

//Per ogni effetto c'è un array con tre elementi: il codice identificativo,
// il totale di volte in cui deve apparire e il nome che compare nella casella
const TIRA_DI_NUOVO = [0, 4, "X2"]
const INDIETRO_DI_UNO = [1, 4, "-1"]
const INDIETRO_DI_TRE = [2, 2, "-3"]
const AVANTI_DI_UNO = [3, 4, "+1"]
const AVANTI_DI_QUATTRO = [4, 2, "+4"]
const FERMO_DA_UNO = [5, 4, "ALT"]
const FERMO_DA_DUE = [6, 2, "ALT X2"]

//compaiono una sola volta, non serve il secondo elemento
const TORNA_ALL_INIZIO = [7, "DA CAPO !"]
const VITTORIA = [8, "VITTORIA !!!"]

class Percorso {
    constructor() {
        /*Dizionario che avrà come chiave la posizione (la casella) e come valore
        il codice dell'effetto
        NON CI SONO TUTTE LE POSIZIONI, solo quelle che mi servono, cioè SOLO QUELLE
        CHE HANNO UN EFFETTO (tutte quelle che non ci sono sono vuote semplicemente)*/

        this.dictCaselle = {}

        /*Cicla finchè non sono stati "piazzati " tutti gli effetti. Ad ogni giro tira a sorte
            una posizione casuale, e se non è ancora mai stata sorteggiata, tira a sorte un codice
            (il codice dell 'effetto), e se il codice è valido, aggiunge nel dizionario un elemento
            con chiave la posizione N della casella e come valore il codice uscito.

        Il codice sorteggiato può non essere valido per due motivi:
        1 - quel determinato effetto è stato già piazzato il massimo di volte
        2 - quel determinato effetto causa UN LOOP INFINITO.Dato che gli effetti vengono applicati anche     
         quando si finisce su uno di essi a causa di un altro effetto potrebbero crearsi LOOP infiniti.Un ESEMPIO BANALE:
        sulla casella 5 c 'è "Avanti di 1" e sulla casella 6 c'è "Indietro di 1"
         ==> la pedina continuerà ad andare avanti di 1 e tornare indietro di 1 */

        let flagTuttiEffettiSettati = false
        while (!flagTuttiEffettiSettati) {
            let flagPosizioneNonValida = true
            while (flagPosizioneNonValida) {
                //ESCLUDO le ultime 2 pos che sono COSTANTI e la PRIMA, la lascio vuota
                //  (la lascio vuota dato che vi è un effetto che riporta il giocatore sulla 1° casella)
                var randomPos = Math.floor(Math.random() * (QTA_CASELLE_TOTALI - 1-2)) + 2
                if (Object.keys(this.dictCaselle).indexOf(randomPos) >= 0) {
                    flagPosizioneNonValida = true
                } else { flagPosizioneNonValida = false }
            }

            if (this.contaEffettiSettati() == QTA_CASELLE_DINAMICHE) {
                flagTuttiEffettiSettati = true
            } else {
                let flagEffettoNonValido = true
                let randomCodCasella = Math.floor(Math.random() * 7) //tra 0 e 6 (7 escluso)

                if (randomCodCasella == TIRA_DI_NUOVO[0]) {
                    if (this.contaEffettiSettati(TIRA_DI_NUOVO[0]) < TIRA_DI_NUOVO[1]) {
                        flagEffettoNonValido = false
                    }
                } else if (randomCodCasella == INDIETRO_DI_UNO[0]) {
                    if (this.contaEffettiSettati(INDIETRO_DI_UNO[0]) < INDIETRO_DI_UNO[1]) {
                        if (randomPos > 1) {
                            flagEffettoNonValido = false
                        }
                    }
                } else if (randomCodCasella == INDIETRO_DI_TRE[0]) {
                    if (this.contaEffettiSettati(INDIETRO_DI_TRE[0]) < INDIETRO_DI_TRE[1]) {
                        if (randomPos > 3) {
                            flagEffettoNonValido = false
                        }
                    }
                } else if (randomCodCasella == AVANTI_DI_UNO[0]) {
                    if (this.contaEffettiSettati(AVANTI_DI_UNO[0]) < AVANTI_DI_UNO[1]) {
                        flagEffettoNonValido = false
                    }
                } else if (randomCodCasella == AVANTI_DI_QUATTRO[0]) {
                    if (this.contaEffettiSettati(AVANTI_DI_QUATTRO[0]) < AVANTI_DI_QUATTRO[1]) {
                        //Creerebbe un loop (perchè la vittoria vi è con un tiro perfetto)
                        if (randomPos < QTA_CASELLE_TOTALI - 2) {
                            flagEffettoNonValido = false
                        }
                    }
                } else if (randomCodCasella == FERMO_DA_UNO[0]) {
                    if (this.contaEffettiSettati(FERMO_DA_UNO[0]) < FERMO_DA_UNO[1]) {
                        flagEffettoNonValido = false
                    }
                } else if (randomCodCasella == FERMO_DA_DUE[0]) {
                    if (this.contaEffettiSettati(FERMO_DA_DUE[0]) < FERMO_DA_DUE[1]) {
                        flagEffettoNonValido = false
                    }
                }
                if (flagEffettoNonValido == false) {
                    this.dictCaselle[randomPos] = randomCodCasella
                }
            }
        }
        this.controllaPossibiliLoop()
        this.controllaQtaCaselleVicino()

	console.log(this.dictCaselle[QTA_CASELLE_TOTALI - 1])
	console.log(this.dictCaselle[QTA_CASELLE_TOTALI])

        this.dictCaselle[QTA_CASELLE_TOTALI - 1] = TORNA_ALL_INIZIO[0]
        this.dictCaselle[QTA_CASELLE_TOTALI] = VITTORIA[0]
    }

    trovaNuovaPosPerCasella(codCasella, oldPos) {
        let newPos = oldPos
        let flagCeNelDict = true
        while (flagCeNelDict || newPos == oldPos) {
            if (codCasella == AVANTI_DI_QUATTRO[0]) {
                //se ci fosse un +4 in posizione 38 si creerebbe un loop
                newPos = Math.floor(Math.random() * (QTA_CASELLE_TOTALI - 2 - 2)) + 2
            } else if (codCasella == INDIETRO_DI_TRE[0]) {
                //se ci fosse un -3 in posizione 1/2/3 "uscirebbe" dal percorso
                newPos = Math.floor(Math.random() * (QTA_CASELLE_TOTALI - 1 - 4)) + 4
            } else {
                newPos = Math.floor(Math.random() * (QTA_CASELLE_TOTALI - 1 - 2)) + 2
            }

            let x = this.dictCaselle[newPos]
            if (x != undefined) {
                flagCeNelDict = true
            } else {
                flagCeNelDict = false
            }

        }
        this.dictCaselle[newPos] = codCasella
    }

    controllaQtaCaselleVicino() {
        //In questo metodo vado a "spezzare" le catene di caselle con effetti.
        //Se c'è una catena di 4 caselle con effetti allora prende 1 di quei
        // effetti e lo sposta da un altra parte
        let caselleVicino = true
        while (caselleVicino) {
            caselleVicino = false

            let i = 0
            for (i = 1; i < QTA_CASELLE_TOTALI - 1; i++) {
                if (this.controllaSeCasellaNonEVuota([i, i + 1, i + 2, i + 3])) {
                    let casDaTogliere = Math.floor(Math.random() * 4)
                    let codCasellaDaTogliere = this.dictCaselle[i + casDaTogliere]

                    delete this.dictCaselle[i + casDaTogliere]
                    this.trovaNuovaPosPerCasella(codCasellaDaTogliere, (i + casDaTogliere))

                    this.controllaPossibiliLoop()

                    caselleVicino = true
                    i = QTA_CASELLE_TOTALI
                }
            }
        }
    }

    controllaPossibiliLoop() {
        let loopTrovato = true
        while (loopTrovato) {
            loopTrovato = false

            for (let pos in this.dictCaselle) {
                loopTrovato = this.possibileLoop(parseInt(pos), parseInt(this.dictCaselle[pos]))
                if (loopTrovato) {
                    //Ferma xke deve ricominciare da capo (per corregere un loop che potrebbe
                    // essersi creato)
                    break
                } else {
                    loopTrovato = this.controllaLoopSfigato(parseInt(pos))
                    if (loopTrovato) {
                        //Ferma xke deve ricominciare da capo (per corregere un loop che potrebbe
                        // essersi creato)
                        break
                    }
                }
            }
        }
    }

    controllaLoopSfigato(pos) {
        let loop = false
        if (this.controllaSeCasellaNonEVuota([pos - 1, pos - 2, pos + 1, pos + 2, pos + 3, pos + 4])) {
            if (this.dictCaselle[pos] == AVANTI_DI_QUATTRO[0] &&
                this.dictCaselle[pos - 1] == AVANTI_DI_UNO[0] &&
                this.dictCaselle[pos - 2] == AVANTI_DI_UNO[0] &&
                this.dictCaselle[pos + 1] == INDIETRO_DI_TRE[0] &&
                this.dictCaselle[pos + 2] == INDIETRO_DI_UNO[0] &&
                this.dictCaselle[pos + 3] == INDIETRO_DI_UNO[0] &&
                this.dictCaselle[pos + 4] == INDIETRO_DI_UNO[0]) {

                delete this.dictCaselle[pos]
                delete this.dictCaselle[pos - 1]
                delete this.dictCaselle[pos - 2]
                delete this.dictCaselle[pos + 1]
                delete this.dictCaselle[pos + 2]
                delete this.dictCaselle[pos + 3]
                delete this.dictCaselle[pos + 4]

                this.trovaNuovaPosPerCasella(AVANTI_DI_QUATTRO[0], (pos))
                this.trovaNuovaPosPerCasella(AVANTI_DI_UNO[0], (pos - 1))
                this.trovaNuovaPosPerCasella(AVANTI_DI_UNO[0], (pos - 2))
                this.trovaNuovaPosPerCasella(INDIETRO_DI_TRE[0], (pos + 1))
                this.trovaNuovaPosPerCasella(INDIETRO_DI_UNO[0], (pos + 2))
                this.trovaNuovaPosPerCasella(INDIETRO_DI_UNO[0], (pos + 3))
                this.trovaNuovaPosPerCasella(INDIETRO_DI_UNO[0], (pos + 4))

                loop = true
            }
        }

        return loop
    }


    possibileLoop(pos, codCasella) {
        let loop = false
        if (codCasella == AVANTI_DI_QUATTRO[0]) {

            if (this.controllaSeCasellaNonEVuota([pos + 1, pos + 4]) &&
                this.dictCaselle[pos + 1] == INDIETRO_DI_UNO[0] &&
                this.dictCaselle[pos + 4] == INDIETRO_DI_TRE[0]) {

                //+4  -1  x  x  -3
                // inverto casella +4 con -1
                //-1  +4  x  x  -3

                this.dictCaselle[pos] = INDIETRO_DI_UNO[0]
                this.dictCaselle[pos + 1] = AVANTI_DI_QUATTRO[0]
                loop = true

            } else if (this.controllaSeCasellaNonEVuota([pos - 1, pos + 1, pos + 3, pos + 4]) &&
                this.dictCaselle[pos - 1] == AVANTI_DI_UNO[0] &&
                this.dictCaselle[pos + 3] == INDIETRO_DI_TRE[0] &&
                this.dictCaselle[pos + 4] == INDIETRO_DI_UNO[0]) {

                //+1  +4  x  x  -3  -1
                // inverto casella +4 con -3
                //+1  -3  x  x  +4  -1

                this.dictCaselle[pos] = INDIETRO_DI_TRE[0]
                this.dictCaselle[pos + 3] = AVANTI_DI_QUATTRO[0]
                loop = true

            } else if (this.controllaSeCasellaNonEVuota([pos + 3, pos + 4]) &&
                this.dictCaselle[pos + 3] == INDIETRO_DI_TRE[0] &&
                this.dictCaselle[pos + 4] == INDIETRO_DI_UNO[0]) {

                //+4  x  x  -3  -1
                // inverto casella +4 con -1
                //-1  x  x  -3  +4

                this.dictCaselle[pos] = INDIETRO_DI_UNO[0]
                this.dictCaselle[pos + 4] = AVANTI_DI_QUATTRO[0]
                loop = true
            }

        } else if (codCasella == AVANTI_DI_UNO[0]) {

            if (this.controllaSeCasellaNonEVuota([pos + 1]) &&
                this.dictCaselle[pos + 1] == INDIETRO_DI_UNO[0]) {

                //+1  -1
                // inverto casella +1 con -1
                //-1  +1
                this.dictCaselle[pos] = INDIETRO_DI_UNO[0]
                this.dictCaselle[pos + 1] = AVANTI_DI_UNO[0]
                loop = true

            } else if (this.controllaSeCasellaNonEVuota([pos + 1, pos + 2, pos + 3]) &&
                this.dictCaselle[pos + 1] == AVANTI_DI_UNO[0] &&
                this.dictCaselle[pos + 2] == AVANTI_DI_UNO[0] &&
                this.dictCaselle[pos + 3] == INDIETRO_DI_TRE[0]) {

                //+1  +1  +1  -3

                if (pos > 3) {
                    // inverto casella primo +1 con -3
                    //-3  +1  +1  +1
                    this.dictCaselle[pos] = INDIETRO_DI_TRE[0]
                    this.dictCaselle[pos + 3] = AVANTI_DI_UNO[0]
                } else {
                    //se invertissi finirebbe un -3 nelle prime caselle,
                    // e se ci si finisse sopra si dovrebbe "andare fuori dal percorso"
                    // quindi metto il -3 in una posizione casuale (in cui non ce nulla)
                    //+1  +1  +1  x
                    delete this.dictCaselle[pos + 3]

                    this.trovaNuovaPosPerCasella(INDIETRO_DI_TRE[0], (pos + 3))

                    loop = true
                }
            }
        }
        return loop
    }

    controllaSeCasellaNonEVuota(caselleDaControllare) {
        //Se nell'if di controllo del loop provasse a prendere una casella non presente nel dizionario
        // lancerebbe una eccezione. Io potrei mettere un grande try except che CONTIENE tutti gli if
        // ma in questo modo "bloccherei" la possibilita' di andare negli if successivi

        let i = 0
        let flag = true
        while (i < caselleDaControllare.length) {
            let x = this.dictCaselle[caselleDaControllare[i]]
            if (x == undefined) {
                i = 999
                flag = false
            }

            i++
        }

        return flag
    }

    contaEffettiSettati(codEffetto = -1) {
        //Prende i valori del dizionario conta le occorenze di un certo valore
        let values = Object.values(this.dictCaselle)
        let tot = 0
        if (codEffetto == -1) {
            tot += this.contaOccorrenze(values, TIRA_DI_NUOVO[0])
            tot += this.contaOccorrenze(values, INDIETRO_DI_UNO[0])
            tot += this.contaOccorrenze(values, INDIETRO_DI_TRE[0])
            tot += this.contaOccorrenze(values, AVANTI_DI_UNO[0])
            tot += this.contaOccorrenze(values, AVANTI_DI_QUATTRO[0])
            tot += this.contaOccorrenze(values, FERMO_DA_UNO[0])
            tot += this.contaOccorrenze(values, FERMO_DA_DUE[0])
        } else {
            tot = this.contaOccorrenze(values, codEffetto)
        }
        return tot
    }

    contaOccorrenze(array, val) {
        let counter = 0
        for (let i = 0; i < array.length; i++) {
            if (array[i] == val) {
                counter += 1
            }
        }
        return counter
    }

}
