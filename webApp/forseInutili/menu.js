class Menu {
    constructor(game, ctx) {
        this.ctx = ctx
        this.game = game
            //Mi salvo le coordinate del centro dello schermo
        this.mid_w = this.game.DISPLAY_W / 2
        this.mid_h = this.game.DISPLAY_H / 2
        this.run_display = true
        this.cursorX = 0
        this.cursorY = 0
            //this.cursor_rect = pygame.Rect(0, 0, 0, 0)
        this.offset = -100
    }

    draw_cursor() {
        this.game.draw_text(this.ctx, "*", 30, "#ffffff", this.cursorX, this.cursorY)
    }
}

class MainMenu extends Menu {
    constructor(game, ctx) {
        super(game, ctx)
        this.state = "Start"

        this.startx = this.mid_w
        this.starty = this.mid_h + 0

        this.optionsx = this.mid_w
        this.optionsy = this.mid_h + 50

        this.creditsx = this.mid_w
        this.creditsy = this.mid_h + 100

        this.quitx = this.mid_w
        this.quity = this.mid_h + 150
        this.cursorX = (this.startx + this.offset)
        this.cursorY = this.starty
    }

    display_menu() {
        //Mostra il menu e richiama il metodo che controlla se ci sono eventi
        this.run_display = true
        while (this.run_display) {
            //TODO Per non occupare moolta CPU faccio meno giri al secondo, abbasso gli fps

            //this.game.check_events()
            //this.check_input()
            this.ctx.clearRect(0, 0, this.game.canvas.width, this.game.canvas.height)
            this.ctx.fillStyle = "#0080FF" //(this.AZZURRO)
            this.ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height)

            this.game.draw_text(this.ctx, 'CRAZY GOOSE', 70, "#ffffff", this.game.DISPLAY_W / 2, this.game.DISPLAY_H / 2 - 200)
            this.game.draw_text(this.ctx, "Start Game", 30, "#ffffff", this.startx, this.starty)
            this.game.draw_text(this.ctx, "Options", 30, "#ffffff", this.optionsx, this.optionsy)
            this.game.draw_text(this.ctx, "Credits", 30, "#ffffff", this.creditsx, this.creditsy)
            this.game.draw_text(this.ctx, "Quit", 30, "#ffffff", this.quitx, this.quity)
            this.draw_cursor()
        }
    }
}

class OptionsMenu extends Menu {
    constructor(game, ctx) {
        super(game, ctx)
        this.state = 'Volume'
        this.volx = this.mid_w
        this.voly = this.mid_h + 20
        this.controlsx = this.mid_w
        this.controlsy = this.mid_h + 40
        this.cursorX = (this.volx + this.offset)
        this.cursorY = this.voly - 50
    }

    //cosa esce quando entri in Options Menu
    display_menu() {
        this.run_display = true
        while (this.run_display) {
            //this.game.check_events()
            // this.check_input()
            if (this.game.START_KEY || this.game.BACK_KEY) {
                this.game.curr_menu = this.game.main_menu
            }
            this.ctx.clearRect(0, 0, this.game.canvas.width, this.game.canvas.height)
            this.ctx.fillStyle = "#0080FF" //(this.AZZURRO)
            this.ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height)

            this.game.draw_text(this.ctx, 'Options', 70, "#ffffff", this.game.DISPLAY_W / 2, this.game.DISPLAY_H / 2 - 150)
            this.game.draw_text(this.ctx, 'Future Release', 30, "#ffffff", this.volx, this.voly)
            this.draw_cursor()
        }
    }
}

class CreditsMenu extends Menu {
    constructor(game, ctx) {
        super(game, ctx)
    }

    //schermata dei Credits
    display_menu() {
        this.run_display = true
        while (this.run_display) {
            //this.game.check_events()
            if (this.game.START_KEY || this.game.BACK_KEY) {
                this.game.curr_menu = this.game.main_menu
                this.run_display = false
            }
            this.ctx.clearRect(0, 0, this.game.canvas.width, this.game.canvas.height)
            this.ctx.fillStyle = "#0080FF" //(this.AZZURRO)
            this.ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height)

            this.game.draw_text(this.ctx, 'Credits', 70, "#ffffff", this.game.DISPLAY_W / 2, this.game.DISPLAY_H / 2 - 180)
            this.game.draw_text(this.ctx, "Made by Crazy Goose Team:", 30, "#ffffff", this.game.DISPLAY_W / 2, this.game.DISPLAY_H / 2 - 120)
            this.game.draw_text(this.ctx, "Bellone Giulio", 30, "#ffffff", this.game.DISPLAY_W / 2, this.game.DISPLAY_H / 2 - 30)
            this.game.draw_text(this.ctx, "Calzia Mattia", 30, "#ffffff", this.game.DISPLAY_W / 2, this.game.DISPLAY_H / 2 + 20)
            this.game.draw_text(this.ctx, "Dastrù Alessandro", 30, "#ffffff", this.game.DISPLAY_W / 2, this.game.DISPLAY_H / 2 + 70)
            this.game.draw_text(this.ctx, "Durante Andrea", 30, "#ffffff", this.game.DISPLAY_W / 2, this.game.DISPLAY_H / 2 + 120)
            this.game.draw_text(this.ctx, "Hila Kledi", 30, "#ffffff", this.game.DISPLAY_W / 2, this.game.DISPLAY_H / 2 + 170)
            this.game.draw_text(this.ctx, "Hu Qiyan", 30, "#ffffff", this.game.DISPLAY_W / 2, this.game.DISPLAY_H / 2 + 220)
            this.draw_cursor()
        }
    }
}