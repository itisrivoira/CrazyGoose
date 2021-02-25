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
	def __init__(self, display, posx, posy, tagChosen="", width=90, height=60):
		self.display = display
		
		self.x1 = posx
		self.y1 = posy
		self.width = width
		self.height = height

		pygame.draw.ellipse(self.display, (0, 0, 0, 1), (self.x1, self.y1, self.width, self.height), 1)
	
	def settaEffetto(self, codCasella, display, font_name):
		""" Metodo con il quale "nascondo" una casella, rimuovendo il testo all'interno (per ora),
				oppure la mostro, inserendo il testo relativo al codCasella associato """

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
		else:
			testo = ""
		
		font = pygame.font.Font(font_name, 14)
		heightOfText = font.size("TXT")[1]
		
		text = testo.splitlines()
		index = 0
		while(index < len(text)):
			if(index == 0):
				text_surface = font.render(text[0], True, (0, 0, 0, 1))
				text_rect = text_surface.get_rect()
					#mette leggermente sopra il centro dell'ellisse
				text_rect.center = (self.getCenterX(), self.getCenterY()-(heightOfText/3)-5)
				display.blit(text_surface, text_rect)
			else:
				text_surface = font.render(text[index], True, (0, 0, 0, 1))
				text_rect = text_surface.get_rect()
				# mette leggermente sotto il centro dell'ellisse (per non collidere con l'altra scritta)
				text_rect.center = (self.getCenterX(), self.getCenterY()+heightOfText-5)
				display.blit(text_surface, text_rect)
			
			index += 1

	def getCenterX(self):
		return ( self.width/2 + self.x1 )
		
	def getCenterY(self):
		return ( self.height/2 + self.y1 )