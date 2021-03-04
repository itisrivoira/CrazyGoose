class Game {
    constructor(canvas) {
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
            //setto alcune variabili e costanti
        this.running = true
        this.playing = true
        this.reset_keys()
        this.DISPLAY_W = 1000
        this.DISPLAY_H = 690
        this.BLACK = (0, 0, 0)
        this.WHITE = (255, 255, 255)
        this.AZZURRO = (0, 127, 255)

        //Creo i vari menu e il GIOCO
        this.main_menu = new MainMenu(this, this.ctx)
        this.options = new OptionsMenu(this, this.ctx)
        this.credits = new CreditsMenu(this, this.ctx)
        this.crazyGoose = new CrazyGoose(this.ctx, this.canvas, this)

        //All'avvio verrà mostrato il main_menu
        this.curr_menu = this.main_menu
    }

    game_loop() {
        while (this.playing) {
            //TODO Per non occupare moolta CPU faccio meno giri al secondo, abbasso gli fps
            //this.check_events()

            //Dopo il check events potrebbe essere cambiato il this.playing
            // (ha chiuso il gioco) quindi controllo
            if (this.playing) {
                this.crazyGoose.start()
            }
        }
    }

    //check_events()

    fermaGioco() {
        this.running = true
            //Risetto il flag a false così potrà RIAPRIRE il gioco
            // (andando di nuovo su "start game")
        this.crazyGoose.giocoPartito = false
            //Risetto il menu principale per farlo mostrare
        this.curr_menu = this.main_menu
    }

    gameWin() {
        this.running = false
            /*
            this.window.fill(this.AZZURRO) funziona ma successivamente
            non riesce a scrivere dentro
            pygame.display.flip()
    
            quindi usando il:
            da lo stesso effetto del this.window.fill(this.AZZURRO) usando ->
                -> window.blit
                -> display.update()
            dato che ce gia questa funzione del sovradisegnare 
            allora richiamo la funzione blit_screen dal main_menu
            this.main_menu.blit_screen() ->
                -> che ha anche il reset_keys cosi resetta le key e se vuole può cliccare ESC
                per tornare al menu
            */
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.fillStyle = "#0080FF" //(this.AZZURRO)
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
        this.draw_text(this.ctx, "HAI VINTO", 70, "#ffffff", this.DISPLAY_W / 2, this.DISPLAY_H / 2 - 200)
        this.draw_text(this.ctx, "Premi ESC per rigiocare", 30, "#ffffff", this.DISPLAY_W / 2, this.DISPLAY_H / 2)
    }

    gameOver() {
        this.running = false
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.fillStyle = "#0080FF" //(this.AZZURRO)
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
        this.draw_text(this.ctx, "HAI PERSO", 70, "#ffffff", this.DISPLAY_W / 2, this.DISPLAY_H / 2 - 200)
        this.draw_text(this.ctx, "Premi ESC per rigiocare", 30, "#ffffff", this.DISPLAY_W / 2, this.DISPLAY_H / 2)
    }

    reset_keys() {
        this.UP_KEY = false
        this.DOWN_KEY = false
        this.START_KEY = false
        this.BACK_KEY = false
    }

    draw_text(ctx, text, size, color, x, y) {
        ctx.font = size.toString() + "px Arial";
        ctx.textAlign = "center"
        ctx.fillStyle = color
        ctx.fillText(text, x, y);
    }

}

/*let canvas = document.getElementById("canvas")

canvas.width = 1000
canvas.height = window.innerHeight

game = new Game(canvas)

/*let ctx = canvas.getContext('2d')
ctx.fillStyle = "#ff0000"
ctx.fillRect(30, 50, 50, 50)*/

/*game.curr_menu.display_menu() * /