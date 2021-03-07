function draw_text(ctx, text, size, color, x, y, font = "Sans-serif", weight = "normal") {
    ctx.font = weight + " " + size.toString() + "px " + font;
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillStyle = color
    ctx.fillText(text, x, y);
}

//Stringa, font-size da usare, y, altezza(non ho alcuna funz. per prenderla, quindi settata da me VA BENE CON QUEL FONT LÌ), larghezza
const TITOLO = ["CRAZY GOOSE", 70, 130, 60]
const START = ["Start Game", 35, 300, 35]
const OPTIONS = ["Options", 35, 370, 35]
const CREDITS = ["Credits", 35, 440, 35]

class MenuIniziale {
    constructor(ctx, canvas) {
        this.ctx = ctx
        this.canvas = canvas
    }

    disegnaMenu() {
        this.ctx.beginPath()
        this.ctx.fillStyle = "#0080FF"
        this.ctx.fillRect(0, 0, canvas.width, canvas.height)

        this.ctx.font = "bold " + START[1].toString() + "px helvetica"
        START[4] = this.ctx.measureText(START[0]).width
        OPTIONS[4] = this.ctx.measureText(START[0]).width
        CREDITS[4] = this.ctx.measureText(START[0]).width

        this.ctx.font = "bold " + TITOLO[1].toString() + "px helvetica"
        TITOLO[4] = this.ctx.measureText(TITOLO[0]).width


        draw_text(this.ctx, TITOLO[0], TITOLO[1], "#ffffff", this.canvas.width / 2, TITOLO[2], "helvetica", "bold")
        draw_text(this.ctx, START[0], START[1], "#ffffff", this.canvas.width / 2, START[2], "helvetica", "bold")
        draw_text(this.ctx, OPTIONS[0], OPTIONS[1], "#ffffff", this.canvas.width / 2, OPTIONS[2], "helvetica", "bold")
        draw_text(this.ctx, CREDITS[0], CREDITS[1], "#ffffff", this.canvas.width / 2, CREDITS[2], "helvetica", "bold")
    }

    mostraNascondiLinea(x, y, angoloAltoSx, angoloBassoDx) {
        if (x >= angoloAltoSx[0] && x <= angoloBassoDx[0] &&
            y >= angoloAltoSx[1] && y <= angoloBassoDx[1]) {

            this.ctx.beginPath()
            this.ctx.lineWidth = "3"
            this.ctx.strokeStyle = "#ffffffff"
            this.ctx.moveTo(angoloAltoSx[0], angoloBassoDx[1])
            this.ctx.lineTo(angoloBassoDx[0], angoloBassoDx[1])
            this.ctx.stroke()

            return true
        } else {
            this.ctx.beginPath()
            this.ctx.lineWidth = "3"
            this.ctx.strokeStyle = "#0080ff"
            this.ctx.moveTo(angoloAltoSx[0], angoloBassoDx[1])
            this.ctx.lineTo(angoloBassoDx[0], angoloBassoDx[1])
            this.ctx.stroke()

            return false
        }
    }

    mouseInStart(x, y) {
        //Stringa, font-size da usare, y, altezza(non ho alcuna funz. per prenderla), larghezza
        let angoloAltoSx = [
            this.canvas.width / 2 - START[4] / 2, //x
            START[2] - START[3] / 2
        ]
        let angoloBassoDx = [
            this.canvas.width / 2 + START[4] / 2, //x
            START[2] + START[3] / 2
        ]

        return this.mostraNascondiLinea(x, y, angoloAltoSx, angoloBassoDx)
    }
    mouseInOptions(x, y) {
        let angoloAltoSx = [
            this.canvas.width / 2 - OPTIONS[4] / 2, //x
            OPTIONS[2] - OPTIONS[3] / 2
        ]
        let angoloBassoDx = [
            this.canvas.width / 2 + OPTIONS[4] / 2, //x
            OPTIONS[2] + OPTIONS[3] / 2
        ]

        return this.mostraNascondiLinea(x, y, angoloAltoSx, angoloBassoDx)
    }
    mouseInCredits(x, y) {
        let angoloAltoSx = [
            this.canvas.width / 2 - CREDITS[4] / 2, //x
            CREDITS[2] - CREDITS[3] / 2
        ]
        let angoloBassoDx = [
            this.canvas.width / 2 + CREDITS[4] / 2, //x
            CREDITS[2] + CREDITS[3] / 2
        ]

        return this.mostraNascondiLinea(x, y, angoloAltoSx, angoloBassoDx)
    }
}



let canvas = document.querySelector('canvas');
canvas.width = 1000
canvas.height = window.innerHeight

let ctx = canvas.getContext("2d")

let menu = new MenuIniziale(ctx, canvas)
menu.disegnaMenu()

canvas.addEventListener("mousemove", (event) => {
    // condizione ? faiQualcosa : faiAltro è una IF su una sola riga

    let in_out = false
    let auto = "auto"
    let pointer = "pointer"

    in_out = menu.mouseInStart(event.offsetX, event.offsetY)
    if (in_out) {
        document.body.style.cursor = pointer
    } else {
        in_out = menu.mouseInOptions(event.offsetX, event.offsetY)
        if (in_out) {
            document.body.style.cursor = pointer
        } else {
            if (in_out = menu.mouseInCredits(event.offsetX, event.offsetY)) {
                document.body.style.cursor = pointer
            } else {
                document.body.style.cursor = auto
            }
        }
    }
})
canvas.addEventListener("mousedown", (event) => {
    //cliccato col tasto sx del mouse (se == 1 tasto centrale, se == 2 tasto dx)
    if (event.button == 0) {
        let in_out = false

        in_out = menu.mouseInStart(event.offsetX, event.offsetY)
        if (in_out) {
            console.log("GIOCO")
        } else {
            in_out = menu.mouseInOptions(event.offsetX, event.offsetY)
            if (in_out) {
                console.log("OPTIONS")
            } else {
                if (in_out = menu.mouseInCredits(event.offsetX, event.offsetY)) {
                    console.log("CREDITS")
                }
            }
        }
    }
})