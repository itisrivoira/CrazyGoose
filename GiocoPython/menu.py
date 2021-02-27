import pygame

class Menu():
    def __init__(self, game):
        self.game = game
        #Mi salvo le coordinate del centro dello schermo
        self.mid_w, self.mid_h = self.game.DISPLAY_W / 2, self.game.DISPLAY_H / 2
        self.run_display = True
        self.cursor_rect = pygame.Rect(0, 0, 0, 0)
        self.offset = - 100

    #disegna il cursore quindi se bisogna modificarlo si fa qua
    def draw_cursor(self):
        self.game.draw_text("*", 30, self.cursor_rect.x, self.cursor_rect.y)

    #sovrappone, cioè disegna tutto ciò che c'è da disegnare
    # (a partire dall'angolo in alto a sx, coord. x=0, y=0)
    def blit_screen(self):
        self.game.window.blit(self.game.display, (0, 0))
        pygame.display.update()
        self.game.reset_keys()


class MainMenu(Menu):
    def __init__(self, game):
        Menu.__init__(self, game)
        self.state = "Start"
        self.startx, self.starty = self.mid_w, self.mid_h + 0
        self.optionsx, self.optionsy = self.mid_w, self.mid_h + 50
        self.creditsx, self.creditsy = self.mid_w, self.mid_h + 100
        self.quitx, self.quity = self.mid_w, self.mid_h + 150
        self.cursor_rect.midtop = (self.startx + self.offset, self.starty)

    
    def display_menu(self):
        #Mostra il menu e richiama il metodo che controlla se ci sono eventi
        self.run_display = True
        while self.run_display:
            self.game.check_events()
            self.check_input()
            #Rimpe tutto lo schemo di Azzurro (sovvrascrivendo tutto ciò che c'era di disegnato prima)
            self.game.display.fill(self.game.AZZURRO)
            self.game.draw_text('CRAZY GOOSE', 70, self.game.DISPLAY_W/2, self.game.DISPLAY_H/2 - 200)
            self.game.draw_text("Start Game", 30, self.startx, self.starty)
            self.game.draw_text("Options", 30, self.optionsx, self.optionsy)
            self.game.draw_text("Credits", 30, self.creditsx, self.creditsy)
            self.game.draw_text("Quit", 30, self.quitx, self.quity)
            self.draw_cursor()
            self.blit_screen()


    #Metodo per muovere su e giù il cursore
    def move_cursor(self):
        if self.game.DOWN_KEY:
            if self.state == 'Start':
                self.cursor_rect.midtop = (self.optionsx + self.offset, self.optionsy)
                self.state = 'Options'
            elif self.state == 'Options':
                self.cursor_rect.midtop = (self.creditsx + self.offset, self.creditsy)
                self.state = 'Credits'
            elif self.state == 'Credits':
                self.cursor_rect.midtop = (self.quitx + self.offset, self.quity)
                self.state = 'Quit'
            elif self.state == 'Quit':
                self.cursor_rect.midtop = (self.startx + self.offset, self.starty)
                self.state = 'Start'
        elif self.game.UP_KEY:
            if self.state == 'Start':
                self.cursor_rect.midtop = (self.quitx + self.offset, self.quity)
                self.state = 'Quit'
            elif self.state == 'Options':
                self.cursor_rect.midtop = (self.startx + self.offset, self.starty)
                self.state = 'Start'
            elif self.state == 'Credits':
                self.cursor_rect.midtop = (self.optionsx + self.offset, self.optionsy)
                self.state = 'Options'
            elif self.state == 'Quit':
                self.cursor_rect.midtop = (self.creditsx + self.offset, self.creditsy)
                self.state = 'Credits'


    #Controlla quale menu è stato scelto
    def check_input(self):
        self.move_cursor()
        if self.game.START_KEY:
            if self.state == 'Start':
                self.game.playing = True
                self.game.curr_menu = None
            elif self.state == 'Options':
                self.game.curr_menu = self.game.options
            elif self.state == 'Credits':
                self.game.curr_menu = self.game.credits
            elif self.state == 'Quit':
                #CHIUDE LA FINESTRA E TERMINA L'ESECUZIONE DEL PROGRAMMA
                pygame.quit()
                exit()
            
            #Se ha premuto invio di certo andrà in un altro menu/entrerà
            # nel gioco/chiuderà la finestra, quindi questo menu non deve più essere mostrato
            self.run_display = False


class OptionsMenu(Menu):
    def __init__(self, game):
        Menu.__init__(self, game)
        self.state = 'Volume'
        self.volx, self.voly = self.mid_w, self.mid_h + 20
        self.controlsx, self.controlsy = self.mid_w, self.mid_h + 40
        self.cursor_rect.midtop = (self.volx + self.offset, self.voly - 50)


    #cosa esce quando entri in Options Menu
    def display_menu(self):
        self.run_display = True
        while self.run_display:
            self.game.check_events()
            #self.check_input()
            if self.game.START_KEY or self.game.BACK_KEY:
                self.game.curr_menu = self.game.main_menu
                self.run_display = False
            self.game.display.fill((self.game.AZZURRO))
            self.game.draw_text('Options', 50, self.game.DISPLAY_W / 2, self.game.DISPLAY_H / 2 - 150)
            #self.game.draw_text("Volume", 30, self.volx, self.voly - 50)
            #self.game.draw_text("Controls", 30, self.controlsx, self.controlsy)
            #self.draw_cursor()
            self.game.draw_text("Future Release", 30, self.volx, self.voly)
            self.blit_screen()


    #da implementare ma tipo controllerebbe il volume e i controlli ma sono da aggiungere
    def check_input(self):
        if self.game.BACK_KEY:
            self.game.curr_menu = self.game.main_menu
            self.run_display = False
        elif self.game.UP_KEY or self.game.DOWN_KEY:
            if self.state == 'Volume':
                self.state = 'Controls'
                self.cursor_rect.midtop = (self.controlsx + self.offset, self.controlsy)
            elif self.state == 'Controls':
                self.state = 'Volume'
                self.cursor_rect.midtop = (self.volx + self.offset, self.voly - 50)
        elif self.game.START_KEY:
            # TODO: Create a Volume Menu and a Controls Menu
            pass


class CreditsMenu(Menu):
    def __init__(self, game):
        Menu.__init__(self, game)

    #schermata dei Credits
    def display_menu(self):
        self.run_display = True
        while self.run_display:
            self.game.check_events()
            if self.game.START_KEY or self.game.BACK_KEY:
                self.game.curr_menu = self.game.main_menu
                self.run_display = False
            self.game.display.fill(self.game.AZZURRO)
            self.game.draw_text('Credits', 50, self.game.DISPLAY_W / 2, self.game.DISPLAY_H / 2 - 180)
            self.game.draw_text('Made by Crazy Goose Team:', 30, self.game.DISPLAY_W / 2, self.game.DISPLAY_H / 2 - 120)
            self.game.draw_text('Bellone Giulio', 30, self.game.DISPLAY_W / 2, self.game.DISPLAY_H / 2 -30)
            self.game.draw_text('Calzia Mattia', 30, self.game.DISPLAY_W / 2, self.game.DISPLAY_H / 2 +20)
            self.game.draw_text('Dastrù Alessandro', 30, self.game.DISPLAY_W / 2, self.game.DISPLAY_H / 2 +70)
            self.game.draw_text('Durante Andrea', 30, self.game.DISPLAY_W / 2, self.game.DISPLAY_H / 2 +120)
            self.game.draw_text('Hila Kledi', 30, self.game.DISPLAY_W / 2, self.game.DISPLAY_H / 2 +170)
            self.game.draw_text('Hu Qiyan', 30, self.game.DISPLAY_W / 2, self.game.DISPLAY_H / 2 +220)
            self.blit_screen()