#Per non importare l'intera classe (il modulo) Percorso, che non mi serve, importo solo le costanti
from Percorso_modul import QTA_CASELLE_TOTALI
from Percorso_modul import TIRA_DI_NUOVO
from Percorso_modul import INDIETRO_DI_UNO
from Percorso_modul import INDIETRO_DI_TRE
from Percorso_modul import AVANTI_DI_UNO
from Percorso_modul import AVANTI_DI_QUATTRO
from Percorso_modul import FERMO_DA_UNO
from Percorso_modul import FERMO_DA_DUE
from Percorso_modul import TORNA_ALL_INIZIO
from Percorso_modul import VITTORIA

import pygame

BG_COLOR_X2 = (170,255,0)
BG_COLOR_MENO1 = (250, 160, 70)
BG_COLOR_MENO3 = (200, 80, 30)
BG_COLOR_PIU1 = (30, 190, 30)
BG_COLOR_PIU4 = (20, 135, 20)
BG_COLOR_FERMO1 = (220,60,60)
BG_COLOR_FERMO2 = (220, 0, 0)
BG_COLOR_DACAPO = (255, 0, 0)
BG_COLOR_VITTORIA = (50, 140, 230)

class Casella():
	def __init__(self, display, posx, posy, width=90, height=60, radiusNO=10, radiusNE=10, radiusSO=10, radiusSE=10):
		self.display = display
		
		self.x = posx
		self.y = posy
		self.width = width
		self.height = height
		
		self.radiusNO = radiusNO
		self.radiusNE = radiusNE
		self.radiusSO = radiusSO
		self.radiusSE = radiusSE


		#(sarà solo il bordo, un bordo un po' spesso)
		pygame.draw.rect(self.display, (0, 0, 0), pygame.Rect(
			self.x-1, self.y-1, self.width+1, self.height+1), 0,
						 0, self.radiusNO, self.radiusNE, self.radiusSO, self.radiusSE)
		
	
	def settaEffetto(self, codCasella, font_name, numCasella):
		#Metodo con il inserisco il testo relativo al codCasella associato
		# nella casella, cioè l'effetto
		testo = ""
		color = (255,255,255)
		#(lo switch non esiste in python)
		if(codCasella == TIRA_DI_NUOVO[0]):
			testo = TIRA_DI_NUOVO[2]
			color = BG_COLOR_X2
		
		elif(codCasella == INDIETRO_DI_UNO[0]):
			testo = INDIETRO_DI_UNO[2]
			color = BG_COLOR_MENO1
		
		elif(codCasella == INDIETRO_DI_TRE[0]):
			testo = INDIETRO_DI_TRE[2]
			color = BG_COLOR_MENO3
		
		elif(codCasella == AVANTI_DI_UNO[0]):
			testo = AVANTI_DI_UNO[2]
			color = BG_COLOR_PIU1
		
		elif(codCasella == AVANTI_DI_QUATTRO[0]):
			testo = AVANTI_DI_QUATTRO[2]
			color = BG_COLOR_PIU4
		
		elif(codCasella == FERMO_DA_UNO[0]):
			testo = FERMO_DA_UNO[2]
			color = BG_COLOR_FERMO1
		
		elif(codCasella == FERMO_DA_DUE[0]):
			testo = FERMO_DA_DUE[2]
			color = BG_COLOR_FERMO2
		
		elif(codCasella == TORNA_ALL_INIZIO[0]):
			testo = TORNA_ALL_INIZIO[1]
			color = BG_COLOR_DACAPO
		
		elif(codCasella == VITTORIA[0]):
			testo = VITTORIA[1]
			color = BG_COLOR_VITTORIA
		
		pygame.draw.rect(self.display, color, pygame.Rect(self.x+2, self.y+2, self.width-5, self.height-5), 0,
						 0, self.radiusNO, self.radiusNE, self.radiusSO, self.radiusSE)
		
		if(len(testo) > 0):
			if(codCasella == VITTORIA):
				
				font = pygame.font.Font(font_name, 17)
				#Prendo l'altezza che avrà il testo (non cambia l'altezza se
				# cambia il testo, quindi richiamo il metodo .size con una
				# qualunque stringa)
				#Il metodo .size(testo) ritorna una tupla con la larghezza
				# e l'altezza del testo (prendo solo l'altezza ora)
				heightOfText = font.size("TXT")[1]
				
				#CON PYGAME NON SI POSSONO SCRIVERE STRINGHE CON DEGLI A CAPO
				# BISOGNA SPEZZARE E FARE PIÙ "AREE DI TESTO"
				
				#Divide il testo dove ci sono "\n"
				text = testo.splitlines()
				
				#N.B. SONO SICURO CHE text AVRÀ SOLO 2 RIGHE XKÈ SO COSA PUO'' CONTENERE "testo"
				# quando il codCasella
				# (quindi questo codice non funziona con frasi con più di 1 "\n")
				
				text_surface = font.render(text[0], True, (0, 0, 0, 1))
				text_rect = text_surface.get_rect()
				#Posiziona la prima riga leggermente sopra il centro dell'ellisse
				text_rect.center = (self.getCenterX(), self.getCenterY()-(heightOfText/3)-5)
				self.display.blit(text_surface, text_rect)
				
				text_surface = font.render(text[1], True, (0, 0, 0, 1))
				text_rect = text_surface.get_rect()
				#Posiziona la seconda riga leggermente sotto il centro dell'ellisse
				# (per non collidere con l'altra scritta)
				text_rect.center = (self.getCenterX(), self.getCenterY()+heightOfText-5)
				self.display.blit(text_surface, text_rect)
			else:
				#Non ci sono "\n" quindi non devo fare nulla di complicato
				font = pygame.font.Font(font_name, 15)
				
				text_surface = font.render(testo, True, (0, 0, 0, 1))
				text_rect = text_surface.get_rect()
				text_rect.center = (self.getCenterX(), self.getCenterY())
				self.display.blit(text_surface, text_rect)
			
			
		self.settaNumCasella(str(numCasella))
	
	
	def settaNumCasella(self, numCasella):
		font = pygame.font.Font("./fontNumCaselle.otf", 16)
		
		textWidth = font.size(numCasella)[0]
		textHeight = font.size(numCasella)[1]
		
		#da uno sfondo al numero della casella
		pygame.draw.rect(self.display, (220,220,220),
						 pygame.Rect(self.getCenterX()-textWidth/2,
									 self.getCenterY()-self.height/2-textHeight/2,
									 textWidth, textHeight))
		
		#scrive il numero sopra lo sfondo
		text_surface = font.render(numCasella, True, (0, 0, 0, 1))
		text_rect = text_surface.get_rect()
		text_rect.center = (self.getCenterX()-1, self.getCenterY()-self.height/2)
		self.display.blit(text_surface, text_rect)
		
		
	def getCenterX(self):
		return ( self.x + self.width/2 )
		
	def getCenterY(self):
		return ( self.y + self.height/2 )