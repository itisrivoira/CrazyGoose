from Giocatore_modul import * 
from Percorso_modul import *
from Casella_modul import *

import tkinter as tk
import pygame
import random
import time
import threading

INFO_DADO_COM = "Dado COM: "
	
class Dado():
	def __init__(self):
		random.seed()

	def tiraDado(self):
			#Tira il dado, ossia un numero casuale tra 1 e 6 (estremi INCLUSI)
		self.dado = random.randint(1,6)
		return self.dado
		

class CrazyGoose():
	def __init__(self, game):
		self.game = game
		self.gameStarted = False
		
	# sovrappone
	def blit_screen(self):
		self.game.window.blit(self.game.display, (0, 0))
		pygame.display.update()
	
	def start(self):
		if(self.gameStarted == False):
			self.gameStarted = True
			
			self.partitaTerminata = False
	
			self.creaWidgets()
			self.blit_screen()
			
	
	def creaWidgets(self):
			#"ripulisce" tutto
		self.game.display.fill(self.game.WHITE)
			#lista di oggetti Casella
		self.caselle = list()
		self.percorso = Percorso()
		
			#"DISEGNA" gli ellissi
		self.posizionaLeCaselle()
			#scrive nelle caselle il loro effetto
		self.riempiCaselle()
		
		self.draw_text("Tu (PL1)", 15, 50, 20)
		self.draw_text("Dado PL1", 14, 55, 60)
		
		"""
		self.valDadoPL1 = tk.IntVar()
		self.valDadoPL1.set(0)
			#Pulsante che funge da dado (brutto brutto per ora ma vabbè)
		self.btnDadoPL1 = tk.Button(self.finestra, textvariable=self.valDadoPL1, command=lambda:self.tiraDado())
		self.btnDadoPL1.place(x=120, y=60, anchor=tk.CENTER)
		"""
		
		self.draw_text("Computer (COM)", 14, 930, 20)
		self.draw_text((INFO_DADO_COM+"0"), 14, 917, 60)
		
		self.player = Giocatore(self.game, self.caselle, self.percorso, "PL1")
		self.com = Giocatore(self.game, self.caselle, self.percorso, "COM")
		
		
		#Decide chi incomincia, tira il dado e vede se il numero tirato è pari o dispari
			# (tra 1 e 6 ci sono 3 pari e 3 dispari, perciò 50% possbilità a testa)
		if(Dado().tiraDado() % 2 == 0):
			self.player.turnoMio = True
			self.com.turnoMio = False
			
				#PER ORA cambia il background-color della label in alto
			self.segnalaChiTocca(True)
		else:
			self.player.turnoMio = False
			self.com.turnoMio = True
			
			turnoCOM = threading.Thread(target=self.toccaAlCOM)
			turnoCOM.start()
				
				#PER ORA cambia il background-color della label in alto
			self.segnalaChiTocca(False)

	def tiraDado(self):
			#Se la partita è terminata "blocca" il dado
		if(not self.partitaTerminata):
			numEstratto = Dado().tiraDado()
			if(self.player.turnoMio):
				self.avanzaPlayer1(numEstratto)
			else:
				turnoCOM = threading.Thread(target=self.toccaAlCOM, args=(numEstratto,))
				turnoCOM.start()
	

	def toccaAlCOM(self, numEstratto=-1):
		if(numEstratto == -1):
			numEstratto = Dado().tiraDado()
		
			#Se il COM ha un fermo entrerà in avanzaPlayer2, abbasserà il suo fermo,
			# e eseguirà avanzaPlayer1, perciò non voglio che il gioco si fermi per nulla
		if(self.com.turniFermo == 0):
			time.sleep(2)

		self.avanzaPlayer2(numEstratto)


	def avanzaPlayer1(self, numEstratto):
			#Se il PL1 ha beccato un fermo in precedenza deve "consumarlo"
			# (sarà come se avesse tirato l'avversario)
		if(self.player.turniFermo > 0):
			self.player.turniFermo -= 1
			
			self.player.turnoMio = False
			self.com.turnoMio =	 True

			self.segnalaChiTocca(False)

			turnoCOM = threading.Thread(target=self.toccaAlCOM, args=(numEstratto,))
			turnoCOM.start()
		else:
			"""
			TODO
			self.valDadoPL1.set(numEstratto)
			"""

			toccaAncoraA_Me = self.player.avanza(numEstratto)
			if(not self.player.vincitore):
					#avanza() ritorna self.turnoMio, perciò
					# se True non tocca all'avversario (gli setto False)
					# se False tocca all'avversario (gli setto True)
				self.com.turnoMio = not toccaAncoraA_Me
					
					#se prende un fermo ANNULLA il fermo dell'avversario 
					#(SENNÒ NESSUNO GIOCHEREBBE PIÙ per tot turni)
				if(self.player.turniFermo > 0):
					self.com.turniFermo = 0
						#Ora il PL1 ha un fermo, quindi tocca all'avversario
					self.segnalaChiTocca(False)
					self.tiraDado()
				else:
					if(self.com.turniFermo > 0):
							#Se l'avversario ha un fermo al 100% tocca al PL1...
						self.segnalaChiTocca(True)
					else:
						#L'avversario non ha un fermo MA non è detto che tocchi a lui 
						# (PL1 potrebbe aver preso un TIRA DI NUOVO)
						if(self.com.turnoMio):
							self.segnalaChiTocca(False)

							turnoCOM = threading.Thread(target=self.toccaAlCOM)
							turnoCOM.start()
						else:
							self.segnalaChiTocca(True)

			else:
					#Segnala PL1 come vincitore e fa TERMINARE la partita
				self.segnalaVincitore(True)
				self.partitaTerminata = True


	def avanzaPlayer2(self, numEstratto):
			#Se il COM ha beccato un fermo in precedenza deve "consumarlo"
			# (sarà come se avesse tirato l'avversario)
		if(self.com.turniFermo > 0):
			self.com.turniFermo -= 1

			self.player.turnoMio = True
			self.com.turnoMio = False

			self.segnalaChiTocca(True)

			self.avanzaPlayer1(numEstratto)
		else:
			"""
			TODO
			self.valDadoCOM.set( (INFO_DADO_COM+str(numEstratto)) )
			"""

			toccaAncoraA_Me = self.com.avanza(numEstratto)
			
			if(not self.com.vincitore):
					#avanza() ritorna self.turnoMio, perciò
					# se True non tocca all'avversario (gli setto False)
					# se False tocca all'avversario (gli setto True)
				self.player.turnoMio = not toccaAncoraA_Me
				
					#se prende un fermo ANNULLA il fermo dell'avversario 
					#(SENNÒ NESSUNO GIOCHEREBBE PIÙ per tot turni)
				if(self.com.turniFermo > 0):
						#Ora il COM ha un fermo, quindi tocca all'avversario
					self.player.turniFermo = 0
					self.segnalaChiTocca(True)
				else:
					if(self.player.turniFermo > 0):
							#Se l'avversario ha un fermo al 100% tocca al COM, lo segnala
						self.segnalaChiTocca(False)
						self.tiraDado()
					else:
						#L'avversario non ha un fermo MA non è detto che tocchi a lui 
						# (COM potrebbe aver preso un TIRA DI NUOVO)
						if(self.player.turnoMio):
							self.segnalaChiTocca(True)
						else:
							self.segnalaChiTocca(False)
							turnoCOM = threading.Thread(target=self.toccaAlCOM)
							turnoCOM.start()
			else:
					#Segnala COM come vincitore e fa TERMINARE la partita
				self.segnalaVincitore(False)
				self.partitaTerminata = True


	def segnalaChiTocca(self, turnoPlayer1):
		pass
		"""if(turnoPlayer1):
			self.lblInfoPl.configure(bg="red")
			self.lblInfoCom.configure(bg="grey")
		else:
			self.lblInfoPl.configure(bg="grey")
			self.lblInfoCom.configure(bg="red")"""
	
	def segnalaVincitore(self, haVintoPlayer1):
		pass
		"""if(haVintoPlayer1):
			self.lblInfoPl.configure(bg="orange")
			self.lblInfoCom.configure(bg="grey")
		else:
			self.lblInfoPl.configure(bg="grey")
			self.lblInfoCom.configure(bg="orange")"""

			
	def riempiCaselle(self):
		"""Cicla per ogni casella e controlla, se la posizione della casella
		 c'è tra le chiavi del dizionario del percorso allora "carico" l'effetto
		 (prendendo il codice contenuto nel valore con quella chiave, il codice della casella),
		 altrimenti non metto nulla (uso il codice -1)"""
		i=1
		for i in range(QTA_CASELLE_TOTALI+1):
			if(i in self.percorso.dictCaselle.keys()):
				self.caselle[i-1].settaEffetto(self.percorso.dictCaselle[i], self.game.display, self.game.font_name)
			else:	#chiave inesistente (cioè posizione VUOTA)
				self.caselle[i-1].settaEffetto(-1, self.game.display, self.game.font_name)


	def posizionaLeCaselle(self):
		self.caselle.append( Casella(self.game.display, 160, 600) )
		self.caselle.append( Casella(self.game.display, 270, 600) )
		self.caselle.append( Casella(self.game.display, 380, 600) )
		self.caselle.append( Casella(self.game.display, 490, 600) )
		self.caselle.append( Casella(self.game.display, 600, 600) )
		self.caselle.append( Casella(self.game.display, 710, 600) )
		
		self.caselle.append( Casella(self.game.display, 790, 545) )
		self.caselle.append( Casella(self.game.display, 840, 475) )
		self.caselle.append( Casella(self.game.display, 850, 405) )
		self.caselle.append( Casella(self.game.display, 840, 335) )
		self.caselle.append( Casella(self.game.display, 790, 265) )
		
		self.caselle.append( Casella(self.game.display, 710, 210) )
		self.caselle.append( Casella(self.game.display, 600, 180) )
		self.caselle.append( Casella(self.game.display, 490, 180) )
		self.caselle.append( Casella(self.game.display, 380, 180) )
		self.caselle.append( Casella(self.game.display, 270, 180) )
		self.caselle.append( Casella(self.game.display, 170, 220) )

		self.caselle.append( Casella(self.game.display, 125, 300) )
		self.caselle.append( Casella(self.game.display, 125, 385) )
		self.caselle.append( Casella(self.game.display, 125, 470) )

		self.caselle.append( Casella(self.game.display, 215, 530) )
		self.caselle.append( Casella(self.game.display, 325, 530) )
		self.caselle.append( Casella(self.game.display, 435, 530) )
		self.caselle.append( Casella(self.game.display, 545, 530) )
		self.caselle.append( Casella(self.game.display, 653, 515) )
		
		self.caselle.append( Casella(self.game.display, 735, 465) )
		self.caselle.append( Casella(self.game.display, 735, 380) )
		self.caselle.append( Casella(self.game.display, 680, 305) )
		
		self.caselle.append( Casella(self.game.display, 585, 260) )
		self.caselle.append( Casella(self.game.display, 475, 260) )
		self.caselle.append( Casella(self.game.display, 365, 260) )
		
		self.caselle.append( Casella(self.game.display, 265, 295) )
		self.caselle.append( Casella(self.game.display, 230, 370) )
		self.caselle.append( Casella(self.game.display, 270, 445) )
		
		self.caselle.append( Casella(self.game.display, 380, 460) )
		self.caselle.append( Casella(self.game.display, 490, 460) )
		self.caselle.append( Casella(self.game.display, 590, 440) )
		
		self.caselle.append( Casella(self.game.display, 625, 370) )
		self.caselle.append( Casella(self.game.display, 525, 335) )
		self.caselle.append( Casella(self.game.display, 370, 340, "", 105, 95) )
		
		
	def draw_text(self, text, size, x, y):
		font = pygame.font.Font(self.game.font_name,size)
		text_surface = font.render(text, True, self.game.BLACK)
		text_rect = text_surface.get_rect()
		text_rect.center = (x,y)
		self.game.display.blit(text_surface,text_rect)


class Button():
	def __init__(self, text, game, x=0, y=0, bg="black"):
		self.game = game
		self.x = 0
		self.y = 0
		self.change_text(text, bg)
	
	def change_text(self, text, bg="black"):
		font = pygame.font.Font(self.game.font_name, 15)
		self.text = font.render(text, 1, self.game.BLACK)
		self.size = self.text.get_size()
		self.surface = pygame.Surface(self.size)
		self.surface.fill(bg)
		self.surface.blit(self.text, (0, 0))
		self.rect = pygame.Rect(self.x, self.y, self.size[0], self.size[1])