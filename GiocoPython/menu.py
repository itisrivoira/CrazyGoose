import pygame
from globalFunction import *

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
        draw_text(self.game, "*", 30, self.game.WHITE, self.cursor_rect.x, self.cursor_rect.y)

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
        clock = pygame.time.Clock()
        #Mostra il menu e richiama il metodo che controlla se ci sono eventi
        self.run_display = True
        while self.run_display:
            #Per non occupare moolta CPU faccio meno giri al secondo, abbasso gli fps
            clock.tick(10)
            
            self.game.check_events()
            self.check_input()
            #Rimpe tutto lo schemo di Azzurro (sovvrascrivendo tutto ciò che c'era di disegnato prima)
            self.game.display.fill(self.game.AZZURRO)
            draw_text(self.game, 'CRAZY GOOSE', 70, self.game.WHITE, self.mid_w, self.mid_h - 200)
            draw_text(self.game, "Start Game", 30, self.game.WHITE, self.startx, self.starty)
            draw_text(self.game, "Options", 30, self.game.WHITE, self.optionsx, self.optionsy)
            draw_text(self.game, "Credits", 30, self.game.WHITE, self.creditsx, self.creditsy)
            draw_text(self.game, "Quit", 30, self.game.WHITE, self.quitx, self.quity)
            
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
        self.volx, self.voly = self.mid_w, self.mid_h - 50
        self.resx, self.resy = self.mid_w, self.mid_h + 10
        self.ctrlx, self.ctrly = self.mid_w, self.mid_h + 70
        self.backx, self.backy = self.mid_w, self.mid_h + 120
        self.cursor_rect.midtop = (self.volx + self.offset, self.voly)

    # cosa esce quando entri in Options Menu
    def display_menu(self):
        self.run_display = True
        while self.run_display:
            self.game.check_events()
            self.check_input()
            self.game.display.fill((self.game.AZZURRO))
            draw_text(self.game, 'Options', 50, self.game.WHITE, self.mid_w, self.mid_h - 200)
            draw_text(self.game, "Volume", 30, self.game.WHITE, self.volx, self.voly)
            draw_text(self.game, "Resolutions", 30, self.game.WHITE, self.resx, self.resy)
            draw_text(self.game, "Controls", 30, self.game.WHITE, self.ctrlx, self.ctrly)
            draw_text(self.game, "Back", 30, self.game.WHITE, self.backx, self.backy)
            self.draw_cursor()
            self.blit_screen()

    # serve a muovere il cursore per la selezione dentro il menu
    def move_cursor(self):
        if self.game.DOWN_KEY:
            if self.state == 'Volume':
                self.cursor_rect.midtop = (self.resx + self.offset, self.resy)
                self.state = 'Res'
                print("Premuto downkey e vado in RESOLUTIONS")
            elif self.state == 'Res':
                self.cursor_rect.midtop = (self.ctrlx + self.offset, self.ctrly)
                self.state = 'Controls'
                print("Premuto downkey e vado in CONTROLS")
            elif self.state == 'Controls':
                self.cursor_rect.midtop = (self.backx + self.offset, self.backy)
                self.state = 'Back'
                print("Premuto downkey e vado in VOLUME")
            elif self.state == 'Back':
                self.cursor_rect.midtop = (self.volx + self.offset, self.voly)
                self.state = 'Volume'
        elif self.game.UP_KEY:
            if self.state == 'Volume':
                self.cursor_rect.midtop = (self.backx + self.offset, self.backy)
                self.state = 'Back'
                print("Premuto upkey e vado in BACK")
            elif self.state == 'Back':
                self.cursor_rect.midtop = (self.ctrlx + self.offset, self.ctrly)
                self.state = 'Controls'
                print("Premuto upkey e vado in CONTROLS")
            elif self.state == 'Controls':
                self.cursor_rect.midtop = (self.resx + self.offset, self.resy)
                self.state = 'Res'
                print("Premuto upkey e vado in RESOLUTIONS")
            elif self.state == 'Res':
                self.cursor_rect.midtop = (self.volx + self.offset, self.voly)
                self.state = 'Volume'
                print("Premuto upkey e vado in VOLUME")

    # controlla gli input
    def check_input(self):
        self.move_cursor()
        if self.game.START_KEY:
            if self.state == 'Res':
                pass
                # self.res_options()
                print("SONO IN Risoluzioni")
            elif self.state == 'Volume':
                # TODO: class Volume needed
                pass
                print("SONO IN VOLUME")
            elif self.state == 'Controls':
                # TODO: class Controls needed
                pass
                print("SONO IN CONTROLS")
            elif self.state == 'Back':
                print("TORNO INDIETRO")
                self.go_back()
                pass
        elif self.game.BACK_KEY:
            self.game.curr_menu = self.game.main_menu
            self.run_display = False

    def go_back(self):
        self.game.curr_menu = self.game.main_menu
        self.run_display = False
    """
    def res_options(self):
        draw_text("1270x690", 30, self.mid_w, self.mid_h )
        self.blit_screen()
    """

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
            draw_text(self.game, 'Credits', 50, self.game.WHITE, self.mid_w, self.mid_h - 180)
            draw_text(self.game, 'Made by Crazy Goose Team:', 30, self.game.WHITE, self.mid_w, self.mid_h - 120)
            draw_text(self.game, 'Bellone Giulio', 30, self.game.WHITE, self.mid_w, self.mid_h - 30)
            draw_text(self.game, 'Calzia Mattia', 30, self.game.WHITE, self.mid_w, self.mid_h + 20)
            draw_text(self.game, 'Dastrù Alessandro', 30, self.game.WHITE, self.mid_w, self.mid_h + 70)
            draw_text(self.game, 'Durante Andrea', 30, self.game.WHITE, self.mid_w, self.mid_h + 120)
            draw_text(self.game, 'Hila Kledi', 30, self.game.WHITE, self.mid_w, self.mid_h + 170)
            draw_text(self.game, 'Hu Qiyan', 30, self.game.WHITE, self.mid_w, self.mid_h + 220)
            self.blit_screen()
