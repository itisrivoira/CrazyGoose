from Giocatore_modul import *
from Percorso_modul import *
from Casella_modul import *
from menu import *
from globalFunction import *

import pygame
import random
import time
import threading

INFO_PL1 = "Tu (PL1)"
INFO_COM = "Computer (COM)"
INFO_DADO_PL1 = "Dado PL1: "
INFO_DADO_COM = "Dado COM: "

class Dado():
	def __init__(self):
		random.seed()

	def tiraDado(self):
			#Tira il dado, ossia un numero casuale tra 1 e 6 (estremi INCLUSI)
		self.dado = random.randint(1,6)
		#self.dado = 40
		return self.dado

"""Non essendoci un widget/view Button in pygame ho dovuto "crearlo".
	Questo Button non è altro che un rettangolo
	con il testo centrato all'interno
"""
class Button():
	def __init__(self, crazyGoose, game, x, y, width, height, text):
		self.crazyGoose = crazyGoose
		self.game = game
		self.x = x
		self.y = y
		self.width = width
		self.height = height
		
		#Crea un oggetto Rect (non lo disegna ancora)
		self.rect = pygame.Rect(x, y, width, height)
		#Crea il rettangolo proprio.
		#					Surface			colore			 Rect
		pygame.draw.rect(self.game.display, self.game.BLACK, self.rect
						 	#se = 0 riempe anche l'interno, se > 0 FA SOLO IL CONTORNO, se < 0 NON DISEGNA
						 , 1
						 	#border-radius (per arrotondare gli angoli)
						 , 4)
		draw_text(self.game, text, 14, self.game.BLACK, (x+self.width/2), (y+self.height/2))
		
		
	def controllaPosCursore(self, mouse):
		#Controlla semplicemente che il cursore si trovi
		# all'interno del button.
		if(self.rect.collidepoint(mouse)):
			self.crazyGoose.tiraDado()
			
	
	def detectMouseOver(self, mouse):
		if(self.rect.collidepoint(mouse)):
			#codice per "evidenziare" il rettangolo
			# (per far capire all'utente che ci sta passando sopra)
			pass
	
	"""Dentro al metodo "Rect.collidepoint(mouse)" non c'è niente di che...
		Ci sarà qualcosa del genere per controllare che il cursore si trovi
		all'interno del rettangolo:
			self.x <= mouse_x <= self.x + self.width
			and self.y <= mouse_y <= self.y + self.height"""
	
class CrazyGoose():
	def __init__(self, game):
		self.game = game
		self.giocoPartito = False
		
	# sovrappone
	def blit_screen(self):
		#Va a disegnare. (a partire dall'angolo in alto a sx, coord. x=0 y=0)
		self.game.window.blit(self.game.display, (0, 0))
		pygame.display.update()
	
	def start(self):
		#Questo metodo è richiamato all'interno di un ciclo, quindi ho settato un flag,
		# per INIZIALIZZARE le variabili una volta soltanto.
		#(volendo il metodo può essere usato per RIAVVIARE il gioco
		#	N.B. BISOGNA RISETTARE A FALSE il FLAG)
		if(self.giocoPartito == False):
			
			self.giocoPartito = True
			self.partitaTerminata = False
			
				#Dentro questa lista ci saranno gli oggetti Casella
			self.caselle = list()
				#Crea il percorso (casuale)
			self.percorso = Percorso()
			
			self.valDadoCOM = "0"
			self.valDadoPL1 = "0"

			self.buttonDadoPL1 = None
			self.player = None
			self.com = None
			self.turnoCOM = None
			
			self.disegnaTutto()
			
	
	def mousePremuto(self, mousePosition):
		#Controllo che sia il turno del PL1 (cioè che sia il suo turno OPPURE l'avversario abbia un fermo)
		if(self.player != None and self.player.turniFermo == 0):
			if(self.player.turnoMio == True or (self.player.turnoMio == False and self.com.turniFermo > 0)):
				if(not self.buttonDadoPL1 == None):
					self.buttonDadoPL1.controllaPosCursore(mousePosition)

	def mouseOver(self, mousePosition):
		if (not self.buttonDadoPL1 == None):
			self.buttonDadoPL1.detectMouseOver(mousePosition)
	
	def disegnaTutto(self):
			#Se è il primo giro deve stabilire chi sarà il primo giocatore a giocare
		flagPrimoGiro = (self.player == None and self.com == None)
		
		""" "ripulisce" tutto.
			  Purtroppo pygame funziona in questo modo, non posso "spostare" un elemento
			  posso solo ripartire da foglio bianco a disegnare"""
		self.game.display.fill(self.game.WHITE)
		
			#Riempe la lista di caselle, cioè "disegna" gli ellissi.
		self.posizionaLeCaselle()
			#Scrive nelle caselle il loro effetto
		self.riempiCaselle()
		
		draw_text(self.game, INFO_PL1, 15, self.game.BLACK, 50, 20)
		draw_text(self.game, INFO_DADO_PL1, 14, self.game.BLACK, 55, 60)
		self.scriviEffetti(self.player, True)


		#Il primo argomento è self xke necessita di questa classe per
		# richiamarne il metodo "tiraDado"
		self.buttonDadoPL1 = Button(self, self.game, 100, 43, 35, 35, self.valDadoPL1)
		
		draw_text(self.game, INFO_COM, 14, self.game.BLACK, 930, 20)
		draw_text(self.game, (INFO_DADO_COM+self.valDadoCOM), 14, self.game.BLACK, 917, 60)
		self.scriviEffetti(self.com, False)


		if(self.player == None or self.player.posizione == 0):
			#Se posizione == 0 vuol dire che è nella casella iniziale (quella "prima" del percorso)
			self.player = Giocatore(self, self.game, self.caselle, self.percorso, "PL1")
		else:
			self.player.spostaPedina(self.com.posizione)
			
		if(self.com == None or self.com.posizione == 0):
			#Se posizione == 0 vuol dire che è nella casella iniziale (quella "prima" del percorso)
			self.com = Giocatore(self, self.game, self.caselle, self.percorso, "COM")
		else:
			self.com.spostaPedina(self.player.posizione)
			
		if(flagPrimoGiro):
			# Decide chi incomincia, tira il dado e vede se il numero tirato è pari o dispari
			# (tra 1 e 6 ci sono 3 pari e 3 dispari, perciò 50% possbilità a testa)
			if (Dado().tiraDado() % 2 == 0):	#Dado().tiraDado() % 2 == 0
				self.player.turnoMio = True
				self.com.turnoMio = False
				
				self.segnalaChiTocca(True)
			else:
				self.player.turnoMio = False
				self.com.turnoMio = True
				
				#Fa giocare il COM. Aspetterà 2 sec e lancierà il dado....
				# il tutto in un altro thread (altro processo) xkè sennò
				# si bloccherebbe TUTTO per 2 secondi (a causa della sleep di 2 sec)
				self.turnoCOM = threading.Thread(target=self.toccaAlCOM)
				self.turnoCOM.start()
			
				self.segnalaChiTocca(False)
		
		self.blit_screen()
	

	def scriviEffetti(self, player_com, isPL1):
		if(player_com != None):
			pxTesto = 13
			font = pygame.font.Font(self.game.font_name, pxTesto)
			xRect = 20

			if(player_com.ultimoMsg != ""):
				dimTesto = font.size(player_com.ultimoMsg)
				if(not isPL1):
					xRect = self.game.DISPLAY_W - 20 - dimTesto[0]

				yRect = 90
				#3.5px distanza dal bordo dx e sx del rettangolo
				xText = xRect+(dimTesto[0])/2 +3.5
				#(i "/2" xkè scriverò il testo CENTRATO, quindi mi servono le x e y CENTRALI)
				#1px distanza dal bordo sup. e inf. del rettangolo
				yText = yRect+(dimTesto[1]/2) +1

				#dimTesto[0]+7  = larghezza del testo più distanza dal bordo a dx + sx
				#dimTesto[0]+2  = larghezza del testo più distanza dal bordo in alto + in basso
				pygame.draw.rect(self.game.display, self.game.BLACK, pygame.Rect(xRect, yRect, dimTesto[0]+7, dimTesto[1]+2), 1)
				draw_text(self.game, player_com.ultimoMsg, pxTesto, self.game.BLACK, xText, yText)

				if(player_com.penultimoMsg != ""):
					dimTesto = font.size(player_com.penultimoMsg)
					if(not isPL1):
						xRect = self.game.DISPLAY_W - 20 - dimTesto[0]

					yRect += (dimTesto[1]+2+1)
					#3.5px distanza dal bordo dx e sx del rettangolo
					xText = xRect+(dimTesto[0])/2 +3.5
					#(i "/2" xkè scriverò il testo CENTRATO, quindi mi servono le x e y CENTRALI)
					#1px distanza dal bordo sup. e inf. del rettangolo
					yText = yRect+(dimTesto[1]/2) +1
					
					pygame.draw.rect(self.game.display, self.game.BLACK, pygame.Rect(xRect, yRect, dimTesto[0]+7, dimTesto[1]+2), 1)
				
					draw_text(self.game, player_com.penultimoMsg, pxTesto, self.game.BLACK, xText, yText)
		

	def tiraDado(self):
			#Se la partita è terminata "blocca" la funzionalità del dado
		if(not self.partitaTerminata):
			numEstratto = Dado().tiraDado()
			if(self.player.turnoMio):
				self.avanzaPlayer1(numEstratto)
			else:
				self.turnoCOM = threading.Thread(target=self.toccaAlCOM, args=(numEstratto,))
				self.turnoCOM.start()
			

	def toccaAlCOM(self, numEstratto=-1):
		#Se il num del dado non viene passato viene settato a -1 e allora lancia il dado
		if(numEstratto == -1):
			numEstratto = Dado().tiraDado()
		
		#Non voglio bloccare il PL1 per 2 secondi, quindi se il COM ha un fermo non
		# faccio la sleep di 2 sec (dopo aver decrementato il fermo lancia il metodo
		# per far avanzare PL1)
		if(self.com.turniFermo == 0):
			time.sleep(2)

		self.avanzaCOM(numEstratto)

	def avanzaPlayer1(self, numEstratto):
		#numEstratto = 40
		if(self.player.turniFermo > 0):
			# Se il PL1 ha beccato un fermo in precedenza deve "consumarlo"
			# (sarà come se avesse tirato l'avversario)
			self.player.turniFermo -= 1
			
			self.player.turnoMio = False
			self.com.turnoMio =	 True

			self.segnalaChiTocca(False)

			self.turnoCOM = threading.Thread(target=self.toccaAlCOM, args=(numEstratto,))
			self.turnoCOM.start()
		else:
			#(La prossima volta che verrà richiamato "disegnaTutto" il numero
			# del dado sarà cambiato)
			self.valDadoPL1 = str(numEstratto)

			toccaAncoraA_Me = self.player.avanza(numEstratto)
			if(not self.player.vincitore):
					#avanza() ritorna self.turnoMio, perciò
					# se ritorna True non tocca all'avversario (gli setto False)
					# se ritorna False tocca all'avversario (gli setto True)
				self.com.turnoMio = not toccaAncoraA_Me
					
					#se prende un fermo ANNULLA il fermo dell'avversario 
					#(SENNÒ NESSUNO GIOCHEREBBE PIÙ per alcuni turni)
				if(self.player.turniFermo > 0):
					self.com.turniFermo = 0
						#Ora il PL1 ha un fermo, quindi tocca all'avversario sicuro
					self.segnalaChiTocca(False)
					
					#Lancerà il dado, entrerà in avanzaPlayer1 che
					# decrementerà il suo fermo e lancerà avanzaCOM
					self.tiraDado()
				else:
					if(self.com.turniFermo > 0):
							#Se l'avversario ha un fermo al 100% tocca al PL1...
						self.segnalaChiTocca(True)
					else:
						#L'avversario non ha un fermo MA non è detto che tocchi a lui 
						# (PL1 potrebbe aver preso un TIRA DI NUOVO) quindi controllo
						if(self.com.turnoMio):
							self.segnalaChiTocca(False)

							self.turnoCOM = threading.Thread(target=self.toccaAlCOM)
							self.turnoCOM.start()
						else:
							self.segnalaChiTocca(True)

			else:
					#Segnala PL1 come vincitore e fa TERMINARE la partita
				self.segnalaVincitore(True)
				self.partitaTerminata = True


	def avanzaCOM(self, numEstratto):
		#numEstratto = 40
		#(Per i commenti VEDI "avanzaPlayer1")
		
		if(self.com.turniFermo > 0):
			self.com.turniFermo -= 1

			self.player.turnoMio = True
			self.com.turnoMio = False

			self.segnalaChiTocca(True)

			self.avanzaPlayer1(numEstratto)
		else:
			self.valDadoCOM = str(numEstratto)

			toccaAncoraA_Me = self.com.avanza(numEstratto)
			
			if(not self.com.vincitore):
				self.player.turnoMio = not toccaAncoraA_Me
				if(self.com.turniFermo > 0):
					self.player.turniFermo = 0
					self.segnalaChiTocca(True)
				else:
					if(self.player.turniFermo > 0):
						self.segnalaChiTocca(False)
						self.tiraDado()
					else:
						if(self.player.turnoMio):
							self.segnalaChiTocca(True)
						else:
							self.segnalaChiTocca(False)
							self.turnoCOM = threading.Thread(target=self.toccaAlCOM)
							self.turnoCOM.start()
			else:
				self.segnalaVincitore(False)
				self.partitaTerminata = True


	def segnalaChiTocca(self, turnoPlayer1):
		#TODO ottimizzare, fa la stessa cosa, basta mettere var 1 o -1
		if(turnoPlayer1):
			pygame.draw.rect(self.game.display, self.game.RED, pygame.Rect(15, 10, 70, 20), 1)
			
			#se < 0 NON LO DISEGNA, se = 0 riempe anche l'interno, se > 0 FA SOLO IL CONTORNO
			pygame.draw.rect(self.game.display, self.game.RED, pygame.Rect(867, 10, 125, 20), -1)
		else:	
			#se < 0 NON LO DISEGNA, se = 0 riempe anche l'interno, se > 0 FA SOLO IL CONTORNO
			pygame.draw.rect(self.game.display, self.game.RED, pygame.Rect(15, 10, 70, 20), -1)

			pygame.draw.rect(self.game.display, self.game.RED, pygame.Rect(867, 10, 125, 20), 1)

		self.blit_screen()

	def segnalaVincitore(self, haVintoPlayer1):
		time.sleep(1)
		if(haVintoPlayer1):
			# print("HA VINTO e sono in PLAYER  !!!")
			self.game.gameWin()

		else:
			# print("HA PERSO E sono in COM  !!!")
			self.game.gameOver()
			
	def riempiCaselle(self):
		"""Cicla per ogni casella e controlla, se la posizione della casella
		 c'è tra le chiavi del dizionario del percorso allora "carico" l'effetto
		 (prendendo il codice contenuto nel valore con quella chiave, il codice della casella),
		 altrimenti non metto nulla (uso il codice -1)"""
		i=1
		for i in range(QTA_CASELLE_TOTALI+1):
			if(i in self.percorso.dictCaselle.keys()):
				self.caselle[i-1].settaEffetto(self.percorso.dictCaselle[i], self.game.font_name)
			else:	#chiave inesistente (cioè posizione VUOTA)
				self.caselle[i-1].settaEffetto(-1, self.game.font_name)


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
		self.caselle.append( Casella(self.game.display, 370, 340, 105, 95) )
