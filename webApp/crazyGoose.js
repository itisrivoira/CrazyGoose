const INFO_PL1 = "Tu (PL1)"
const INFO_COM = "Computer (COM)"
const INFO_DADO_PL1 = "Dado PL1: "
const INFO_DADO_COM = "Dado COM: "

function draw_text(ctx, text, size, color, x, y) {
    ctx.font = size.toString() + "px Arial";
    ctx.textAlign = "center"
    ctx.fillStyle = color
    ctx.fillText(text, x, y);
}

class Dado {
    tiraDado() {
        //num casuale tra 0 e 5 => +1 => num casuale tra 1 e 6
        return (Math.floor(Math.random() * 6) + 1)
    }
}

/*Non essendoci un widget/view Button neanche nel canvas ho dovuto "crearlo".
	Questo Button non è altro che un rettangolo
	con il testo centrato all'interno
*/
class Button {
    constructor(ctx, crazyGoose, game, x, y, width, height, text) {
        this.ctx = ctx
        this.crazyGoose = crazyGoose
        this.game = game
        this.x = x
        this.y = y
        this.width = width
        this.height = height

        this.ctx.beginPath()
        this.ctx.rect(x, y, width, height)
        this.ctx.stroke()
        draw_text(this.ctx, text, 14, "#000000", (x + this.width / 2), (y + this.height / 2 + 3))
    }

    controllaPosCursore(mouse) {
        //Controlla semplicemente che il cursore si trovi
        // all'interno del button.
        if (mouse[0] > this.x && mouse[0] < this.x + this.width &&
            mouse[1] > this.y && mouse[1] < this.y + this.height) {

            this.crazyGoose.tiraDado()
        }
    }

    detectMouseOver(mouse) {
        if (mouse[0] > this.x && mouse[0] < this.x + this.width &&
            mouse[1] > this.y && mouse[1] < this.y + this.height) {
            //codice per "evidenziare" il rettangolo
            // (per far capire all'utente che ci sta passando sopra)
            console.log("sopra");
        }
    }

}
class CrazyGoose {
    constructor(ctx, canvas, game) {
        this.ctx = ctx
        this.canvas = canvas
        this.game = game
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

            this.valDadoCOM = "0"
            this.valDadoPL1 = "0"

            this.buttonDadoPL1 = null
            this.player = null
            this.com = null
            this.turnoCOM = null

            this.disegnaTutto()
        }
    }

    mousePremuto(mousePosition) {
        if (this.buttonDadoPL1 != null) {
            this.buttonDadoPL1.controllaPosCursore(mousePosition)
        }
    }

    mouseOver(mousePosition) {
        if (this.buttonDadoPL1 != null) {
            this.buttonDadoPL1.detectMouseOver(mousePosition)
        }
    }

    disegnaTutto() {
        console.log(this);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            /*this.ctx.beginPath()
            this.ctx.rect(0, 0, this.canvas.width, this.canvas.height)
            this.ctx.stroke()*/
        let flagPrimoGiro = (this.player == null && this.com == null)
            /*"ripulisce" tutto.
			  Purtroppo pygame funziona in questo modo, non posso "spostare" un elemento
			  posso solo ripartire da foglio bianco a disegnare*/
            //Riempe la lista di caselle, cioè "disegna" gli ellissi.
        this.posizionaLeCaselle()
            //Scrive nelle caselle il loro effetto
        this.riempiCaselle()

        draw_text(this.ctx, INFO_PL1, 15, "#000000", 50, 20)
        draw_text(this.ctx, INFO_DADO_PL1, 14, "#000000", 55, 60)

        //Il primo argomento è this xke necessita di questa classe per
        // richiamarne il metodo "tiraDado"
        this.buttonDadoPL1 = new Button(this.ctx, this, this.game, 100, 40, 35, 35, this.valDadoPL1)

        draw_text(this.ctx, INFO_COM, 14, "#000000", 930, 20)
        draw_text(this.ctx, (INFO_DADO_COM + this.valDadoCOM), 14, "#000000", 917, 60)

        if (this.player == null || this.player.posizione == 0) {
            //Se posizione == 0 vuol dire che è nella casella iniziale (quella "prima" del percorso)
            this.player = new Giocatore(this, this.ctx, this.caselle, this.percorso, "PL1")
        } else {
            this.player.spostaPedina(this.com.posizione)
        }

        if (this.com == null || this.com.posizione == 0) {
            //Se posizione == 0 vuol dire che è nella casella iniziale (quella "prima" del percorso)
            this.com = new Giocatore(this, this.ctx, this.caselle, this.percorso, "COM")
        } else {
            this.com.spostaPedina(this.player.posizione)
        }

        if (flagPrimoGiro == true) {
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

                //Fa giocare il COM. Aspetterà 2 sec e lancierà il dado....
                // il tutto in un altro thread (altro processo) xkè sennò
                // si bloccherebbe TUTTO per 2 secondi (a causa della sleep di 2 sec)

                this.toccaAlCOM()

                this.segnalaChiTocca(false)
            }
        }
    }

    tiraDado() {
        //Se la partita è terminata "blocca" la funzionalità del dado
        if (!this.partitaTerminata) {
            let numEstratto = (new Dado()).tiraDado()

            if (this.player.turnoMio) {
                this.avanzaPlayer1(numEstratto)

                //Per cambiare il numero uscito nel button nel html
                return numEstratto
            } else {
                this.toccaAlCOM()
            }
        } else { return 0 }
    }

    toccaAlCOM(numEstratto = -1) {
        //Se il num del dado non viene passato viene settato a -1 e allora lancia il dado
        if (numEstratto == -1) {
            numEstratto = (new Dado()).tiraDado()
        }

        //Non voglio bloccare il PL1 per 2 secondi, quindi se il COM ha un fermo non
        // faccio la sleep di 2 sec (dopo aver decrementato il fermo lancia il metodo
        // per far avanzare PL1)
        if (this.com.turniFermo == 0) {
            //dopo 2000ms (2sec) entra nella funzine, che a sua volta lancia la funzione avanzaCOM
            setTimeout(() => { this.avanzaCOM(numEstratto) }, 2000)
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

            this.toccaAlCOM()
        } else {
            //(La prossima volta che verrà richiamato "disegnaTutto" il numero
            // del dado sarà cambiato)
            this.valDadoPL1 = numEstratto

            let toccaAncoraA_Me = this.player.avanza(numEstratto)

            if (!this.player.vincitore) {
                //avanza() ritorna this.turnoMio, perciò
                // se ritorna true non tocca all'avversario (gli setto false)
                // se ritorna false tocca all'avversario (gli setto true)
                this.com.turnoMio = !toccaAncoraA_Me

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
        //(Per i commenti VEDI "avanzaPlayer1")

        if (this.com.turniFermo > 0) {
            this.com.turniFermo -= 1

            this.player.turnoMio = true
            this.com.turnoMio = false

            this.segnalaChiTocca(true)

            this.avanzaPlayer1(numEstratto)
        } else {
            this.valDadoCOM = numEstratto

            let toccaAncoraA_Me = this.com.avanza(numEstratto)

            this.player.turnoMio = !toccaAncoraA_Me
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

    segnalaChiTocca(turnoPlayer1) {
        let colorPL1 = ""
        let colorCOM = ""

        //Il colore è formato da R G B A dove la A è la trasparenza (0 "completamente trasparente" 255 "completamente visibile")
        if (turnoPlayer1) {
            colorPL1 = "#ff0000ff"
            colorCOM = "#ff000000"
        } else {
            colorPL1 = "#ff000000"
            colorCOM = "#ff0000ff"
        }

        this.ctx.beginPath()
        this.ctx.lineWidth = "2"
        this.ctx.strokeStyle = colorPL1
        this.ctx.rect(15, 5, 70, 20)
        this.ctx.stroke()

        this.ctx.beginPath()
        this.ctx.lineWidth = "2"
        this.ctx.strokeStyle = colorCOM
        this.ctx.rect(867, 5, 125, 20)
        this.ctx.stroke()

        //risetto al valore di default
        this.ctx.lineWidth = "1";
        this.ctx.strokeStyle = "#000000";
    }

    segnalaVincitore(haVintoPlayer1) {
        /*Codice per segnalare a chi tocca
        if(haVintoPlayer1):
        	this.lblInfoPl.configure(bg="orange")
        	this.lblInfoCom.configure(bg="grey")
        else:
        	this.lblInfoPl.configure(bg="grey")
        	this.lblInfoCom.configure(bg="orange")*/
    }

    riempiCaselle() {
        /*Cicla per ogni casella e controlla, se la posizione della casella
         c'è tra le chiavi del dizionario del percorso allora "carico" l'effetto
         (prendendo il codice contenuto nel valore con quella chiave, il codice della casella),
         altrimenti non metto nulla (uso il codice -1)*/
        //TODO controllare bene se gira per tutte le caselle
        for (let i = 1; i <= QTA_CASELLE_TOTALI; i++) {
            let casella = this.caselle[i - 1]
            try {
                casella.settaEffetto(this.percorso.dictCaselle[i])
            } catch (err) { //chiave inesistente (cioè posizione VUOTA)
                casella.settaEffetto(-1)
            }
        }
    }

    posizionaLeCaselle() {
        this.caselle.push(new Casella(this.ctx, 160, 590))
        this.caselle.push(new Casella(this.ctx, 270, 590))
        this.caselle.push(new Casella(this.ctx, 380, 590))
        this.caselle.push(new Casella(this.ctx, 490, 590))
        this.caselle.push(new Casella(this.ctx, 600, 590))
        this.caselle.push(new Casella(this.ctx, 710, 590))

        this.caselle.push(new Casella(this.ctx, 790, 535))
        this.caselle.push(new Casella(this.ctx, 840, 465))
        this.caselle.push(new Casella(this.ctx, 850, 395))
        this.caselle.push(new Casella(this.ctx, 840, 325))
        this.caselle.push(new Casella(this.ctx, 790, 255))

        this.caselle.push(new Casella(this.ctx, 710, 200))
        this.caselle.push(new Casella(this.ctx, 600, 170))
        this.caselle.push(new Casella(this.ctx, 490, 170))
        this.caselle.push(new Casella(this.ctx, 380, 170))
        this.caselle.push(new Casella(this.ctx, 270, 170))
        this.caselle.push(new Casella(this.ctx, 170, 210))

        this.caselle.push(new Casella(this.ctx, 125, 290))
        this.caselle.push(new Casella(this.ctx, 125, 375))
        this.caselle.push(new Casella(this.ctx, 125, 460))

        this.caselle.push(new Casella(this.ctx, 215, 520))
        this.caselle.push(new Casella(this.ctx, 325, 520))
        this.caselle.push(new Casella(this.ctx, 435, 520))
        this.caselle.push(new Casella(this.ctx, 545, 520))
        this.caselle.push(new Casella(this.ctx, 653, 505))

        this.caselle.push(new Casella(this.ctx, 735, 455))
        this.caselle.push(new Casella(this.ctx, 735, 370))
        this.caselle.push(new Casella(this.ctx, 680, 295))

        this.caselle.push(new Casella(this.ctx, 585, 250))
        this.caselle.push(new Casella(this.ctx, 475, 250))
        this.caselle.push(new Casella(this.ctx, 365, 250))

        this.caselle.push(new Casella(this.ctx, 265, 285))
        this.caselle.push(new Casella(this.ctx, 230, 360))
        this.caselle.push(new Casella(this.ctx, 270, 435))

        this.caselle.push(new Casella(this.ctx, 380, 450))
        this.caselle.push(new Casella(this.ctx, 490, 450))
        this.caselle.push(new Casella(this.ctx, 590, 430))

        this.caselle.push(new Casella(this.ctx, 625, 360))
        this.caselle.push(new Casella(this.ctx, 525, 325))
        this.caselle.push(new Casella(this.ctx, 375, 345, 65, 55))
    }

}

let canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d")

canvas.width = 1000
canvas.height = 650

let gioco = new CrazyGoose(ctx, canvas, null)
gioco.start()

//Aggiungo l'ascoltatore del click del mouse all'oggetto canvas (non potevo farlo nel file html xke mi serve l'oggetto gioco per lanciare un suo metodo)
canvas.addEventListener("mousedown", (event) => {

    //cliccato col tasto sx del mouse (se == 1 tasto centrale, se == 2 tasto dx)
    if (event.button == 0) {

        /*Con event.offsetX prendo le coord. X RISPETTO l'oggetto su cui c'è l'ascoltatore 
        (quindi non considera tutto quello spazio bianco, non occupato dal canvas)
        event.offsetY / event.clientY mi restituivano non so xke un valore TROPPO basso rispetto quello che mi aspettavo. Con event.pageY prendo le coord. Y RISPETTO la posizione nella PAGINA
        */
        let posMouse = new Array(event.offsetX, event.pageY)
        gioco.mousePremuto(posMouse)
    }
})