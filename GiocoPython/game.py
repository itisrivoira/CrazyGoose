import pygame
from menu import *
from crazyGoose import *

class Game():
    def __init__(self):
        #Crea la finestra
        pygame.init()
        
        #setto alcune variabili e costanti
        self.running, self.playing = True, False
        self.UP_KEY, self.DOWN_KEY, self.START_KEY, self.BACK_KEY = False, False, False, False
        self.DISPLAY_W, self.DISPLAY_H = 1000, 690
        self.BLACK, self.WHITE, self.AZZURRO = (0, 0, 0,), (255, 255, 255), (0, 127, 255)
        
        self.window = pygame.display.set_mode(((self.DISPLAY_W, self.DISPLAY_H)))
       
        # Creo la Surface, con la quale disegnerò poi tutto
        self.display = pygame.Surface((self.DISPLAY_W, self.DISPLAY_H))
        
        #Prendo il font di default
        self.font_name = pygame.font.get_default_font()
        
        #Setto un nome alla finestra (nome in alto al centro)
        self.title = pygame.display.set_caption("Crazy Goose")
        
        #Carico l'icona
        icon = pygame.image.load("../Logo/logo_32x32.png")
        pygame.display.set_icon(icon)

        #Creo i vari menu e il GIOCO
        self.main_menu = MainMenu(self)
        self.options = OptionsMenu(self)
        self.credits = CreditsMenu(self)
        self.crazyGoose = CrazyGoose(self)
        
        #All'avvio verrà mostrato il main_menu
        self.curr_menu = self.main_menu

    def game_loop(self):
        clock = pygame.time.Clock()
        while self.playing:
            #Per non occupare moolta CPU faccio meno giri al secondo, abbasso gli fps
            clock.tick(10)
            self.check_events()
            
            #Dopo il check events potrebbe essere cambiato il self.playing
            # (ha chiuso il gioco) quindi controllo
            if(self.playing):
                self.crazyGoose.start()


    #Controlla gli eventi dell utente (tasti premuti, mouse, ...)
    def check_events(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:   #alt+f4 o "X" della finestra
                self.playing = False
                #Se il menu è = None allora HA CHIUSO IL GIOCO,
                # altrimenti ha CHIUSO LA FINESTRA (ferma il programma)
                if(not self.curr_menu == None):
                    self.running = False
                    self.curr_menu.run_display = False
                else:
                    self.fermaGioco()
                    
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_RETURN:
                    self.START_KEY = True
                if event.key == pygame.K_BACKSPACE:
                    self.BACK_KEY = True
                if event.key == pygame.K_DOWN:
                    self.DOWN_KEY = True
                if event.key == pygame.K_UP:
                    self.UP_KEY = True
                

            #Se sta giocando controllo anche l'evento del mouse
            if(not self.crazyGoose == None and self.crazyGoose.giocoPartito == True):
                if event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_ESCAPE:
                        self.playing = False
                        self.fermaGioco()
                
                if(event.type == pygame.MOUSEBUTTONDOWN):
                    self.crazyGoose.mousePremuto(pygame.mouse.get_pos())
                self.crazyGoose.mouseOver(pygame.mouse.get_pos())

    def fermaGioco(self):
        self.running = True
        #Risetto il flag a False così potrà RIAPRIRE il gioco
        # (andando di nuovo su "start game")
        self.crazyGoose.giocoPartito = False
        #Risetto il menu principale per farlo mostrare
        self.curr_menu = self.main_menu           
            
    #resetta a false i 4 tasti UP, DOWN, START(INVIO), BACK(TORNA INDIETRO)
    def reset_keys(self):
        self.UP_KEY, self.DOWN_KEY, self.START_KEY, self.BACK_KEY = False, False, False, False

    #Metodo usato dai vari menu per scrivere il testo
    def draw_text(self, text, size, x, y):
        font = pygame.font.Font(self.font_name,size)
        text_surface = font.render(text, True, self.WHITE)
        text_rect = text_surface.get_rect()
        text_rect.center = (x,y)
        self.display.blit(text_surface,text_rect)
