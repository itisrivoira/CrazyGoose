import pygame
from menu import *
from crazyGoose import *
from globalFunction import *

class Game():
    def __init__(self):
        #Crea la finestra
        pygame.init()
        
        #setto alcune variabili e costanti
        self.running, self.playing = True, False
        self.reset_keys()
        self.DISPLAY_W, self.DISPLAY_H = 1000, 690
        self.BLACK, self.WHITE, self.AZZURRO, self.RED = (0, 0, 0), (255, 255, 255), (0, 127, 255), (255,0,0)
        
        self.window = pygame.display.set_mode(((self.DISPLAY_W, self.DISPLAY_H)))
       
        # Creo la Surface, con la quale disegnerò poi tutto
        self.display = pygame.Surface((self.DISPLAY_W, self.DISPLAY_H))
        
        #Prendo il font di default
        self.font_name = pygame.font.get_default_font()
        
        #Setto un nome alla finestra (nome in alto al centro)
        self.title = pygame.display.set_caption("Crazy Goose")
        
        #Carico l'icona
        icon = pygame.image.load("./images/logo_32x32.png")
        pygame.display.set_icon(icon)

        #Creo i vari menu e il GIOCO
        self.main_menu = MainMenu(self)
        self.credits = CreditsMenu(self)
        self.crazyGoose = CrazyGoose(self)
        
        #All'avvio verrà mostrato il main_menu
        self.curr_menu = self.main_menu


    def game_loop(self):
        while self.playing:
            #Per non occupare moolta CPU abbasso gli fps (in pratica fa meno giri al sec xke aspetta un attimo ogni volta)
            pygame.time.wait(100)
            #controlla se preme qualche tasto
            self.check_events()
            
            #Dopo il check events potrebbe essere cambiato il self.playing
            # (se ha chiuso il gioco).
            
            if(self.playing and self.crazyGoose.giocoPartito == False):
                self.crazyGoose.start()


    #Controlla gli eventi dell utente (tasti premuti, mouse, ...)
    def check_events(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:   #alt+f4 o "X" della finestra
                self.playing = False
                #Se il menu è = None allora ORA HA CHIUSO IL GIOCO,
                # altrimenti ORA HA CHIUSO LA FINESTRA (ha fermato il programma)
                if(self.curr_menu == None):
                    self.fermaGioco()
                else:
                    self.running = False
                    self.curr_menu.run_display = False
                    
                    
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_RETURN:
                    self.START_KEY = True
                if event.key == pygame.K_BACKSPACE:
                    self.BACK_KEY = True
                if event.key == pygame.K_DOWN:
                    self.DOWN_KEY = True
                if event.key == pygame.K_UP:
                    self.UP_KEY = True
                

            #Se sta giocando controllo anche l'evento del mouse altrimenti non mi serve
            if(self.crazyGoose != None):
                if event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_ESCAPE:
                        self.playing = False
                        self.fermaGioco()
							#resetta i flag dei tasti premuti (se premesse INVIO e poi ESC lui uscirebbe
							# dal gioco e subito rientrerebbe in "Start game")
                        self.reset_keys()
                
                if(event.type == pygame.MOUSEBUTTONDOWN):
                    self.crazyGoose.mousePremuto(pygame.mouse.get_pos())
                    
                self.crazyGoose.mouseOver(pygame.mouse.get_pos())


    def fermaGioco(self):
        self.running = True
        #Risetto il flag a False così potrà RIAPRIRE il gioco
        # (andando di nuovo su "start game")
        self.crazyGoose.giocoPartito = False
        #cosi potrà rifare la scelta della pedina
        self.crazyGoose.sceltaPedina.sceltaFatta = False
        #Risetto il menu principale per farlo mostrare
        self.curr_menu = self.main_menu           


    def gameWin(self):
        self.running = False
        """
        self.window.fill(self.AZZURRO) funziona ma successivamente
        non riesce a scrivere dentro
        pygame.display.flip()
        
        quindi usando il:
        da lo stesso effetto del self.window.fill(self.AZZURRO) usando ->
            -> window.blit
            -> display.update()
        dato che ce gia questa funzione del sovradisegnare 
        allora richiamo la funzione blit_screen dal main_menu
        self.main_menu.blit_screen() ->
            -> che ha anche il reset_keys cosi resetta le key e se vuole può cliccare ESC
            per tornare al menu
        """
        self.display.fill(self.AZZURRO)
        draw_text(self, "HAI VINTO", 50, self.WHITE, self.DISPLAY_W / 2, self.DISPLAY_H / 2 - 200)
        draw_text(self, "Premi ESC per rigiocare", 30, self.WHITE, self.DISPLAY_W / 2, self.DISPLAY_H / 2)
        self.main_menu.blit_screen()


    def gameOver(self):
        self.running = False
        self.display.fill(self.AZZURRO)
        draw_text(self, "HAI PERSO", 50, self.WHITE, self.DISPLAY_W / 2, self.DISPLAY_H / 2 - 200)
        draw_text(self, "Premi ESC per riprovare", 30, self.WHITE, self.DISPLAY_W / 2, self.DISPLAY_H / 2)
        self.main_menu.blit_screen()
        
        
    #resetta a false i 4 tasti UP, DOWN, START(INVIO), BACK(TORNA INDIETRO)
    def reset_keys(self):
        self.UP_KEY, self.DOWN_KEY, self.START_KEY, self.BACK_KEY = False, False, False, False
