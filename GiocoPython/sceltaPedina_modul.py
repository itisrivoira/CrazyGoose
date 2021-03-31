import pygame
from globalFunction import *

DESCR_OCA_GIALLA = "Con la sua abilità si potrà avanzare di 3 caselle al posto di 1 quando si capita su" \
                   " una casella \"avanti di 1\". In modo da poter evitare delle insidie!"

DESCR_OCA_VERDE = "Con la sua abilità si potrà tirare nuovamente il dado. In modo da spiazzare" \
                  " l'avversario ed andare in vantaggio!"

DESCR_OCA_BLU = "Con la sua abilità si potrà avanzare di 2 caselle per saltare una casella negativa," \
                " o addirittura raggiungere il traguardo!"

DESCR_OCA_ROSSA = "Con la sua abilità si potrà annullare l'effetto di una casella!"


#carica le immagini delle oche
pedinaGialla = pygame.image.load("./pedine/pedineMenuSceltaPedina/pedina_gialla.png")
pedinaVerde = pygame.image.load("./pedine/pedineMenuSceltaPedina/pedina_verde.png")
pedinaBlu = pygame.image.load("./pedine/pedineMenuSceltaPedina/pedina_blu.png")
pedinaRossa = pygame.image.load("./pedine/pedineMenuSceltaPedina/pedina_rossa.png")


class SceltaPedina():
    def __init__(self, crazyGoose):
        self.crazyGoose = crazyGoose
        self.game = crazyGoose.game
        self.mouseOver = None
        self.sceltaFatta = False
        
        self.rectOcaGialla = None
        self.rectOcaVerde = None
        self.rectOcaBlu = None
        self.rectOcaRossa = None

    
    def controllaPosMouse(self, mouse):
		#collidepoint è un metodo di pygame.Rect che date le coord. di un punto
		# (x e y) ti ritorna se il punto è all'interno o meno del rettangolo		
		
        if(self.rectOcaGialla != None and self.rectOcaGialla.collidepoint(mouse)):
            self.mouseOver = "gialla"
        elif(self.rectOcaVerde != None and self.rectOcaVerde.collidepoint(mouse)):
            self.mouseOver = "verde"
        elif(self.rectOcaBlu != None and self.rectOcaBlu.collidepoint(mouse)):
            self.mouseOver = "blu"
        elif(self.rectOcaRossa != None and self.rectOcaRossa.collidepoint(mouse)):
            self.mouseOver = "rossa"
        else:
            self.mouseOver = None


    def mousePremuto(self):
        #ha premuto il tasto del mouse, se era sopra un'oca (quindi
        # mouseOver ha un valore) avrà scelto la sua oca.
        if(self.mouseOver != None):
            self.sceltaFatta = True


    # sovrappone
    def blit_screen(self):
        # Va a disegnare. (a partire dall'angolo in alto a sx, coord. x=0 y=0)
        self.game.window.blit(self.game.display, (0, 0))
        pygame.display.update()
    
    
    def mostraScelte(self):
        #"cancello tutto"
        self.game.display.fill(self.game.AZZURRO)

        draw_text(self.game, "SCEGLI LA TUA OCA - Ogni oca ha un'abilità differente", 30, self.game.WHITE,
                  self.game.DISPLAY_W/2, 30)
        
        self.mostraRect()
        self.mostraOca()
        
        self.blit_screen()
        
        
    def mostraRect(self):
        self.rectOcaGialla = pygame.Rect((self.game.DISPLAY_W / 2 - 25 - 300), 60, 280, 280)
        self.rectOcaVerde = pygame.Rect((self.game.DISPLAY_W / 2 + 25), 60, 280, 280)
        self.rectOcaBlu = pygame.Rect((self.game.DISPLAY_W / 2 - 25 - 300), 390, 280, 280)
        self.rectOcaRossa = pygame.Rect((self.game.DISPLAY_W / 2 + 25), 390, 280, 280)
        
        self.mostraRettangoloOca(self.rectOcaGialla, (255,255,0))
        self.mostraRettangoloOca(self.rectOcaVerde, (0,255,0))
        self.mostraRettangoloOca(self.rectOcaBlu, (0,0,230))
        self.mostraRettangoloOca(self.rectOcaRossa, (255,0,0))
        
    
    def mostraRettangoloOca(self, rectOca, color):
        #questo sarà solo "il contorno" del rettangolo della pedina
        pygame.draw.rect(self.game.display, color, rectOca, 0, 6)
		
		#ricopre una parte leggermente più piccola del rettangolo qua sopra
		#(così da mostrare solo il contorno)
        pygame.draw.rect(self.game.display, self.game.AZZURRO, pygame.Rect(
            rectOca.x + 3, rectOca.y + 3,
            rectOca.width - 6, rectOca.height - 6
        ), 0, 6)
        
        
    def mostraOca(self):
        #self.game.display.blit(img, (coord_x, coord_y)) mostra l'immagine a quelle coordinate
        
        if(self.mouseOver == "gialla"):
            self.mostraDescrOca(DESCR_OCA_GIALLA, self.rectOcaGialla, (255, 255, 0))
        else:
            self.mostraNomeOca("OCA GIALLA", self.rectOcaGialla, (255, 255, 0))
            self.game.display.blit(pedinaGialla,
                              (self.rectOcaGialla.x + 60,
                                         self.rectOcaGialla.y + self.rectOcaGialla.height / 2.5))
            

        if (self.mouseOver == "verde"):
            self.mostraDescrOca(DESCR_OCA_VERDE, self.rectOcaVerde, (0, 255, 0))
        else:
            self.mostraNomeOca("OCA VERDE", self.rectOcaVerde, (0, 255, 0))
            self.game.display.blit(pedinaVerde,
                                   (self.rectOcaVerde.x + 60,
                                    self.rectOcaVerde.y + self.rectOcaVerde.height / 2.5))


        if (self.mouseOver == "blu"):
            self.mostraDescrOca(DESCR_OCA_BLU, self.rectOcaBlu, (0,0,230))
        else:
            self.mostraNomeOca("OCA BLU", self.rectOcaBlu, (0,0,230))
            self.game.display.blit(pedinaBlu,
                                   (self.rectOcaBlu.x + 60,
                                    self.rectOcaBlu.y + self.rectOcaBlu.height / 2.5))

        
        if (self.mouseOver == "rossa"):
            self.mostraDescrOca(DESCR_OCA_ROSSA, self.rectOcaRossa, (255, 0, 0))
        else:
            self.mostraNomeOca("OCA ROSSA", self.rectOcaRossa, (255, 0, 0))
            self.game.display.blit(pedinaRossa,
                                   (self.rectOcaRossa.x + 60,
                                    self.rectOcaRossa.y + self.rectOcaRossa.height / 2.5))
            
    
    def mostraDescrOca(self, DESCR, rectOca, color):
        DESCR = self.aggiungiACapo(DESCR)

		#divido la stringa dove ci sono "\n" e poi disegno "più aree di testo"
		# (perchè quando in pygame scriviamo testo non riconosce i "\n")
        righeDescr = DESCR.splitlines()
        
        for i in range(len(righeDescr)):
            draw_text(self.game, righeDescr[i], 20, color,
                      rectOca.x + rectOca.width / 2,
                      rectOca.y + rectOca.height / 4 + 25 * i)


    def mostraNomeOca(self, nomeOca, rectOca, color):
        draw_text(self.game, nomeOca, 37, color, 
                      rectOca.x + rectOca.width / 2,
                      rectOca.y + rectOca.height / 5)
            
            
    def aggiungiACapo(self, descr):
        """Metodo che aggiunge un "\n" ogni tot caratteri SE VI È UNO SPAZIO
            (così da non spezzare le parole).
           N.B. CON IL FONT a 20px ci stanno 26 caratteri in una riga in realtà, ma non posso
            prevedere se al 26esimo carattere sarà terminata la parola, per sicurezza quindi
            abbasso ancora un po' la qta di caratteri per riga
        """

        counter = 1
        descrFinale = ""
        for char in descr:
            if(char != " "):
                descrFinale += char
                counter += 1
            else:
                if (counter >= 20):
                    # ricomincerà a contare
                    counter = 1
                    descrFinale += "\n"
                else:
                    descrFinale += char
                    counter += 1
                
            
        return descrFinale
