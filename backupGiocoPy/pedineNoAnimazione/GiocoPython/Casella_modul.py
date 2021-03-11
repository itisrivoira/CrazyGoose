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

class Casella():
	def __init__(self, display, posx, posy, width=90, height=60):
		self.display = display
		
		self.x = posx
		self.y = posy
		self.width = width
		self.height = height

		pygame.draw.ellipse(self.display, (0, 0, 0, 1), (self.x, self.y, self.width, self.height), 1)
	
	def settaEffetto(self, codCasella, font_name):
		#Metodo con il inserisco il testo relativo al codCasella associato
		# nella casella, cioè l'effetto
		testo = ""
		if(codCasella == TIRA_DI_NUOVO[0]):
			testo = "Ri-tira\nil dado"
		elif(codCasella == INDIETRO_DI_UNO[0]):
			testo = "Indetro\ndi 1"
		elif(codCasella == INDIETRO_DI_TRE[0]):
			testo = "Indietro\ndi 3"
		elif(codCasella == AVANTI_DI_UNO[0]):
			testo = "Avanti\ndi 1 !"
		elif(codCasella == AVANTI_DI_QUATTRO[0]):
			testo = "Avanti\ndi 4 !"
		elif(codCasella == FERMO_DA_UNO[0]):
			testo = "Fermo\nun giro"
		elif(codCasella == FERMO_DA_DUE[0]):
			testo = "Fermo\ndue giri"
		elif(codCasella == TORNA_ALL_INIZIO):
			testo = "Torna\nall'inizio !"
		elif(codCasella == VITTORIA):
			testo = "HAI\nVINTO !!!"
		
		if(len(testo) > 0):
			font = pygame.font.Font(font_name, 14)
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
			
			#N.B. SONO SICURO CHE text AVRÀ SOLO 2 RIGHE XKÈ SO COSA PUç CONTENERE "testo"
			# QUINDI QUESTO NON FUNZIONA CON FRASI CON PIÙ DI 1 "\n"
			
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
		
		
	def getCenterX(self):
		return ( self.width/2 + self.x )
		
	def getCenterY(self):
		return ( self.height/2 + self.y )