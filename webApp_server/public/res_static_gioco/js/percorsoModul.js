const QTA_CASELLE_TOTALI = 40
    //caselle con effetto randomico (NON include l'ultima e la penultima casella che sono SEMPRE UGUALI)
const QTA_CASELLE_DINAMICHE = 22

//Per ogni effetto c'è un array con due elementi: il codice identificativo 
//	e il totale di volte in cui deve apparire
const TIRA_DI_NUOVO = [0, 4]
const INDIETRO_DI_UNO = [1, 4]
const INDIETRO_DI_TRE = [2, 2]
const AVANTI_DI_UNO = [3, 4]
const AVANTI_DI_QUATTRO = [4, 2]
const FERMO_DA_UNO = [5, 4]
const FERMO_DA_DUE = [6, 2]
    //Caselle con degli "effetti" che compaiono solo una volta, quindi non serve array
const TORNA_ALL_INIZIO = 7
const VITTORIA = 8

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
                var randomPos = Math.floor(Math.random() * (QTA_CASELLE_TOTALI - 1)) + 2
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
            this.controllaPossibiliLoop()

            this.dictCaselle[QTA_CASELLE_TOTALI - 1] = 7
            this.dictCaselle[QTA_CASELLE_TOTALI] = 8
        }
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


    controllaPossibiliLoop() {
        /*Non basta ciclare una volta per tutte le caselle (con quel for) xkè una "correzione"
		di un loop potrebbe generarne un altro*/

        let loopTrovato = true
        while (loopTrovato) {
            loopTrovato = false
            for (let i in Object.keys(this.dictCaselle)) {
                try {
                    let codCasella = this.dictCaselle[(i)]
                    if (this.controllaLoop(codCasella, i)) {
                        loopTrovato = true
                    }
                } catch (err) {}
            }
        }
    }

    controllaLoop(codCasella, posizione) {
        let loopTrovato = false
        if (codCasella == INDIETRO_DI_TRE[0]) {
            /*Esempio: casella 2 c'è "Avanti di 4" ==> il giocatore finirà sulla casella 6
						e su questa vi è "Indietro di 1" ==> il giocatore finirà sulla
						casella 5 e su questa vi è "Indietro di 3"
					IL GIOCATORE RITORNA SULLA CASELLA 2   ==>   LOOP*/
            if ((this.dictCaselle[(posizione + 1)] == INDIETRO_DI_UNO[0]) &&
                (this.dictCaselle[(posizione - 3)] == AVANTI_DI_QUATTRO[0])) {

                this.dictCaselle[posizione - 3] = INDIETRO_DI_TRE[0]
                this.dictCaselle[posizione] = AVANTI_DI_UNO[0]

                loopTrovato = true

            }
        } else if (codCasella == INDIETRO_DI_UNO[0]) {
            if ((this.dictCaselle[(posizione - 1)] == AVANTI_DI_UNO[0])) {

                this.dictCaselle[posizione - 1] = INDIETRO_DI_UNO[0]
                this.dictCaselle[posizione] = AVANTI_DI_UNO[0]

                loopTrovato = true
            }


        } else if ((this.dictCaselle[(posizione - 1)] == AVANTI_DI_QUATTRO[0]) &&
            (this.dictCaselle[(posizione + 3)] == INDIETRO_DI_TRE[0])) {

            /*
                Esempio: casella 4 c'è "Avanti di 4" ==> il giocatore finirà sulla
                    casella 8 e su questa vi è "Indietro di 3" ==> il giocatore
                    finirà sulla casella 5 che ha "Indietro di 1" ==>
                IL GIOCATORE RITORNA SULLA CASELLA 4   ==>   LOOP
            */

            this.dictCaselle[posizione - 1] = INDIETRO_DI_TRE[0]
            this.dictCaselle[posizione + 3] = AVANTI_DI_QUATTRO[0]

            //in questo caso non devo ho da cambiare la casella "corrente", ma le altre:
            loopTrovato = true
        }

        return loopTrovato
    }

}