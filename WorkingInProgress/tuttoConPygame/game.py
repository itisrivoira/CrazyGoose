import pygame
from menu import *
from crazyGoose import CrazyGoose

class Game():
    def __init__(self):
        pygame.init()
        #setto le variabili
        self.running, self.playing = True, False
        self.UP_KEY, self.DOWN_KEY, self.START_KEY, self.BACK_KEY = False, False, False, False
        self.DISPLAY_W, self.DISPLAY_H = 1000, 690
        self.BLACK, self.WHITE, self.AZZURRO = (0, 0, 0,), (255, 255, 255), (0, 127, 255)

        #inizio a settare il display(finestra)
        #setto la schermata
        #font name serve per il font dei caratteri
        # title è il titolo della finestra(il nome)
        #icon sarebbe icona della finestra in alto a sinistra
        self.display = pygame.Surface((self.DISPLAY_W, self.DISPLAY_H))
        self.window = pygame.display.set_mode(((self.DISPLAY_W, self.DISPLAY_H)))
        self.font_name = pygame.font.get_default_font()
        self.title = pygame.display.set_caption("Crazy Goose")
        icon = pygame.image.load("../../Logo/logo_32x32.png")
        pygame.display.set_icon(icon)

        #richiamo le funzioni del menu
        self.main_menu = MainMenu(self)
        self.options = OptionsMenu(self)
        self.credits = CreditsMenu(self)
        self.crazyGoose = CrazyGoose(self)
        
        self.curr_menu = self.main_menu

    #game loop, quando clicco start_key su Start Game, stoppa il loop e inizia il gioco
    #quindi il codice se vuoi mettilo qua senno crea un nuovo file e importa il modulo
    def game_loop(self):
        while self.playing:
            self.check_events()
            
            #dopo il check events potrebbe essere cambiato il self.playing
            if(self.playing):
                self.crazyGoose.start()


    #controlla gli eventi dell utente(tasti premuti)
    def check_events(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                self.playing = False
                if(self.curr_menu != None):
                    self.running = False
                    self.curr_menu.run_display = False
                else:
                    self.running = True
                    self.crazyGoose.gameStarted = False
                    self.curr_menu = self.main_menu
                    
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_RETURN:
                    self.START_KEY = True
                if event.key == pygame.K_BACKSPACE:
                    self.BACK_KEY = True
                if event.key == pygame.K_DOWN:
                    self.DOWN_KEY = True
                if event.key == pygame.K_UP:
                    self.UP_KEY = True

            if(self.crazyGoose != None and self.crazyGoose.gameStarted == True):
                if(event.type == pygame.MOUSEBUTTONDOWN):
                    self.crazyGoose.mousePressed(pygame.mouse.get_pos())
                self.crazyGoose.mouseOver(pygame.mouse.get_pos())
            
    #resetta a false i 4 tasti UP, DOWN, START(INVIO), BACK(TORNA INDIETRO)
    def reset_keys(self):
        self.UP_KEY, self.DOWN_KEY, self.START_KEY, self.BACK_KEY = False, False, False, False

    #scrive il testo
    def draw_text(self, text, size, x, y):
        font = pygame.font.Font(self.font_name,size)
        text_surface = font.render(text, True, self.WHITE)
        text_rect = text_surface.get_rect()
        text_rect.center = (x,y)
        self.display.blit(text_surface,text_rect)