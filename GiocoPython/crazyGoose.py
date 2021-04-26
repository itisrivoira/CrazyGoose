from Giocatore_modul import *
from Percorso_modul import *
from Casella_modul import *
from sceltaPedina_modul import *
from menu import *
from globalFunction import *

import pygame
import random
import math
import time
import threading

INFO_PL1 = "Tu (PL1)"
INFO_COM = "Computer (COM)"
INFO_DADO_PL1 = "Dado PL1: "
INFO_DADO_COM = "Dado COM: "

#carica l'img della scritta
imgCrazyGoose = pygame.image.load("../Logo/scrittaCrazyGoose_400x130_noBagliore.png")
sfondo = pygame.image.load("./images/sfondo.png")


class Dado():
	def __init__(self):
		random.seed()

	def tiraDado(self):
			#Tira il dado, ossia un numero casuale tra 1 e 6 (estremi INCLUSI)
		self.dado = random.randint(1,6)
		return self.dado


"""Non essendoci un widget/view Button in pygame ho dovuto "crearlo".
	Questo Button non è altro che un rettangolo
	con il testo centrato all'interno """
class Button():
	def __init__(self, crazyGoose, game, x, y, width, height, text):
		self.crazyGoose = crazyGoose
		self.game = game
		self.x = x
		self.y = y
		self.width = width
		self.height = height
		
		self.dado1 = pygame.image.load("./images/imgDado/dado_1.png")
		self.dado2 = pygame.image.load("./images/imgDado/dado_2.png")
		self.dado3 = pygame.image.load("./images/imgDado/dado_3.png")
		self.dado4 = pygame.image.load("./images/imgDado/dado_4.png")
		self.dado5 = pygame.image.load("./images/imgDado/dado_5.png")
		self.dado6 = pygame.image.load("./images/imgDado/dado_6.png")
		#è una croce rossa, se prova a tirare il dado quando non tocca a lui
		self.nonETuoTurno = pygame.image.load("./images/cross.png")
		
		self.rect = pygame.Rect(self.x, self.y, self.width, self.height)
		
		self.flagAvvisaNonESuoTurno = False
		
		self.disegna(text)
	
	
	def disegna(self, valDado, doBlitScreen = False):
		if (self.crazyGoose.mouseOverDadoPL1):
			# COME PER LA SCELTA DELL'OCA, CREA UN RETTANGOLO DENTRO L'ALTRO PER FARE UN BORDO
			# PIÙ GRANDE E VISIBILE
			
			# Questo verrà nascosto, si vedrà solo più una parte che diventerà il bordo del dado
			pygame.draw.rect(self.game.display, (70, 220, 25),
							 pygame.Rect(self.rect.x-3, self.rect.y-3,
										 self.rect.width + 6, self.rect.height + 6)
							 , 0, 15)
		
		if(1 <= valDado <= 6):
		
			if(valDado == 1):
				imgDado = self.dado1
			elif(valDado == 2):
				imgDado = self.dado2
			elif(valDado == 3):
				imgDado = self.dado3
			elif(valDado == 4):
				imgDado = self.dado4
			elif(valDado == 5):
				imgDado = self.dado5
			else:
				imgDado = self.dado6
		
		else:
			#img default
			imgDado = self.dado1
		
		self.game.display.blit(imgDado, (self.rect.x, self.rect.y))
		
		if(self.flagAvvisaNonESuoTurno):
			self.avvisaNonSuoTurno(False)
			
		if(doBlitScreen):
			self.crazyGoose.blit_screen()
	
	
	def faiGirare(self):
		# in 1 sec "gira" il dado, facendo vedere tutte le facce
		numGiri = 0
		dadiFattiVedere = list()
		while (numGiri < 4 and self.crazyGoose.giocoPartito):
			# ogni volta un dado diverso
			x = Dado().tiraDado()
			while (x in dadiFattiVedere):
				x = Dado().tiraDado()
			dadiFattiVedere.append(x)
			
			if (x == 1):
				imgDado = self.dado1
			elif (x == 2):
				imgDado = self.dado2
			elif (x == 3):
				imgDado = self.dado3
			elif (x == 4):
				imgDado = self.dado4
			elif (x == 5):
				imgDado = self.dado5
			else:
				imgDado = self.dado6
			
			self.game.display.blit(imgDado, (self.rect.x, self.rect.y))
			
			numGiri += 1
			if (numGiri == 5):
				# avrebbe già mostrato vedere ogni possibile dado, devo
				# resettare la lista dei dadi che ha mostrato
				dadiFattiVedere = list()
			
			self.crazyGoose.blit_screen()
			
			pygame.time.wait(250)
		
		pygame.draw.rect(self.game.display, self.game.WHITE, self.rect)
	
	
	def avvisaNonSuoTurno(self, blitScreen):
		self.game.display.blit(self.nonETuoTurno, (self.rect.x, self.rect.y))
		if(blitScreen):
			self.crazyGoose.blit_screen()
		
		
	def detectMouseOver(self, mouse):
		"""Dentro al metodo "Rect.collidepoint(mouse)" non c'è niente di che...
			Ci sarà qualcosa del genere per controllare che il cursore si trovi
			all'interno del rettangolo:
				self.x <= mouse_x <= self.x + self.width
				and self.y <= mouse_y <= self.y + self.height"""
		return self.rect.collidepoint(mouse)
	

#TODO fare poi classe padre e classe figlio (Button padre, ButtonDado e ButtonAbilitaPL1 figli)

class ButtonAbilitaPL1():
	def __init__(self,  crazyGoose, game, ocaScelta, x, y, width, height):
		self.crazyGoose = crazyGoose
		self.game = game
		self.x = x
		self.y = y
		self.width = width
		self.height = height
		
		self.rect = pygame.Rect(self.x, self.y, self.width, self.height)
		self.rectArc = pygame.Rect(self.x-2, self.y-2, self.width+4, self.height+4)
		
		if(ocaScelta == "gialla"):
			cartella = "/OcaGialla"
		elif(ocaScelta == "verde"):
			cartella = "/OcaVerde"
		elif(ocaScelta == "blu"):
			cartella = "/OcaBlu"
		else:
			cartella = "/OcaRossa"
			
		
		self.imgOk = pygame.image.load("./images/imgAbilita"+cartella+"/OK.png")
		self.imgQuasi= pygame.image.load("./images/imgAbilita"+cartella+"/QUASI.png")
		self.imgNonPiu= pygame.image.load("./images/imgAbilita"+cartella+"/NON_PIU.png")
		self.imgNo= pygame.image.load("./images/imgAbilita"+cartella+"/NO.png")
		
		self.evidenziaTempoRimanente(0)
		
	
	
	def disegna(self, ms = 0, doBlitScreen = False, cancellaPrec = True):
		if (cancellaPrec):
			# (Non farà blit_screen, al massimo lo farà dopo ma di certo non
			# non mi serve farlo due volte)
			self.cancellaButtonAbilita(False)
		
		if(self.crazyGoose.player.abilitaAttivata == False):
			if(ms == 0):
				img = self.imgNonPiu
			elif(ms > 1000):
				img = self.imgOk
			else:
				img = self.imgQuasi
		else:
			img = self.imgNo
		
		self.game.display.blit(img, (self.rect.x, self.rect.y))
		
		""" TODO DA VEDERE COME FARE, MAGARI FARE UN CERCHIO INTORNO
		(PER FAR CAPIRE CHE SI TROVA SOPRA IL BUTTON)
		if(self.crazyGoose.mouseOverAbilitaPL1):
			pygame.draw.circle(self.game.display, (170,50,50), (
				self.rect.x+self.rect.width/2, self.rect.y+self.rect.height/2), self.rect.width/2)
		else:
			pygame.draw.circle(self.game.display, self.game.RED, (
				self.rect.x + self.rect.width / 2, self.rect.y + self.rect.height / 2), self.rect.width / 2)"""
	
		if(doBlitScreen):
			self.crazyGoose.blit_screen()
	
	
	def evidenziaTempoRimanente(self, ms=2000, doBlitScreen = False):
		# TODO rimane quadrato bianco... da risolvere
		# (Non farà blit_screen, al massimo lo farà dopo ma di certo non
		# non mi serve farlo due volte)
		self.cancellaButtonAbilita(False)
		
		#sarà l'ultimo giro, non disegno più
		if(ms > 100):
			#(non parto da 0° ma da 90°, quindi non 360° ma 360°+90°)
			gradi = (360*ms / 2000)+90
			
			pygame.draw.arc(self.game.display, self.game.BLACK, pygame.Rect(
				self.rect.x-2, self.rect.y-2, self.rect.width+4, self.rect.height+4
			), math.radians(90), math.radians(gradi), 3)
			
		self.disegna(ms, False, False)
		
		if(doBlitScreen):
			self.crazyGoose.blit_screen()
	
	
	def cancellaButtonAbilita(self, doBlitScreen=True):
		# "cancella" il button che c'era prima
		pygame.draw.rect(self.game.display, self.game.WHITE, self.rectArc)
		if (doBlitScreen):
			self.crazyGoose.blit_screen()
	
	
	def detectMouseOver(self, mouse):
		"""Dentro al metodo "Rect.collidepoint(mouse)" non c'è niente di che...
			Ci sarà qualcosa del genere per controllare che il cursore si trovi
			all'interno del rettangolo:
				self.x <= mouse_x <= self.x + self.width
				and self.y <= mouse_y <= self.y + self.height"""
		return self.rect.collidepoint(mouse)

	
class CrazyGoose():
	def __init__(self, game):
		self.game = game
		self.giocoPartito = False
		self.partitaTerminata = False
		self.sceltaPedina = SceltaPedina(self)
		self.inizializzaAttributi()
		
		
	# sovrappone
	def blit_screen(self):
		if(self.giocoPartito):
			#Va a disegnare. (a partire dall'angolo in alto a sx, coord. x=0 y=0)
			self.game.window.blit(self.game.display, (0, 0))
			pygame.display.update()
		#else: il gioco si è fermato, quindi smetto di disegnare
	
	
	def start(self):
		if(self.sceltaPedina.sceltaFatta == False):
			self.sceltaPedina.mostraScelte()
		else:
			self.mostraGioco()
	
	
	def mostraGioco(self):
		self.giocoPartito = True
		self.partitaTerminata = False
		
		# Dentro questa lista ci saranno gli oggetti Casella
		self.caselle = list()
		# Crea il percorso casuale
		self.percorso = Percorso()
		
		self.inizializzaAttributi()
		
		self.disegnaTutto()
	
	
	def inizializzaAttributi(self):
		self.valDadoCOM = 0
		self.valDadoPL1 = 0
		
		self.buttonAbilitaPL1 = None
		self.mouseOverAbilitaPL1 = False
		
		self.buttonDadoPL1 = None
		self.buttonDadoCOM = None
		
		self.mouseOverDadoPL1 = False
		self.player = None
		self.com = None
		self.aChiTocca = None
		self.turnoCOM = None
		
	
	def mousePremuto(self, mousePosition):
		if(self.sceltaPedina.sceltaFatta == False):
			self.sceltaPedina.mousePremuto()
		#else: non sono più nel menu della scelta dell'oca
			
		#Controllo che sia il turno del PL1 (cioè che sia il suo turno o che l'avversario abbia un fermo)
		if (self.buttonDadoPL1 != None):
			if(self.buttonDadoPL1.detectMouseOver(mousePosition)):
				if(self.aChiTocca and (not self.player.isMoving) and self.player.attendoAbilita == False):
					self.buttonDadoPL1.faiGirare()
					self.tiraDado()

		if(self.mouseOverAbilitaPL1 and self.player.attendoAbilita):
			self.player.abilitaAttivata = True
		

	def mouseOver(self, mousePosition):
		if(self.sceltaPedina.sceltaFatta == False):
			self.sceltaPedina.controllaPosMouse(mousePosition)
		#else: non sono più nel menu della scelta dell'oca
		

		#Controllo che sia il turno del PL1 (cioè che sia il suo turno o che l'avversario abbia un fermo)
		# E CHE NON SI STIA MUOVENDO (altrimenti provocherebbe uno sfarfallio incredibile)
		if (self.aChiTocca and self.buttonDadoPL1 != None
				and (self.player.isMoving == False and self.com.isMoving == False)
				and self.player.attendoAbilita == False):
			
			# Se passa da fuori a dentro o da dentro a fuori del button ha senso che venga richiamato
			# disegnaTutto() per "mostrare" il cambio del button (evidenziare o smettere di evidenziare)
			if (self.mouseOverDadoPL1 != self.buttonDadoPL1.detectMouseOver(mousePosition)):
				self.buttonDadoPL1.flagAvvisaNonESuoTurno = False
				self.mouseOverDadoPL1 = self.buttonDadoPL1.detectMouseOver(mousePosition)
				self.buttonDadoPL1.disegna(self.valDadoPL1, True)
		else:
			self.mouseOverDadoPL1 = False
			if(self.buttonDadoPL1 != None):
				if (self.buttonDadoPL1.detectMouseOver(mousePosition)):
					self.buttonDadoPL1.flagAvvisaNonESuoTurno = True
					
					#quello che gli passo è un flag: True (condizione vera) allora dovrà fare
					# blit_screen() (per "applicare" le modifiche), False (condizione falsa) allora
					# uno dei due Giocatori (si muove) richiama disegna(), e questo metodo alla fine
					# richiama blit_screen() e quindi non serve farlo
					self.buttonDadoPL1.avvisaNonSuoTurno(
						(self.player.isMoving == False and self.com.isMoving == False)
					)
				else:
					self.buttonDadoPL1.flagAvvisaNonESuoTurno = False
					self.buttonDadoPL1.disegna(self.valDadoPL1,
						(self.player.isMoving == False and self.com.isMoving == False)
					)

		if (self.buttonAbilitaPL1 != None):
			# Se passa da fuori a dentro o da dentro a fuori del button ha senso che venga richiamato
			# disegnaTutto() per "mostrare" il cambio del button (provocherebbe sfarfallio fastidioso)
			if (self.mouseOverAbilitaPL1 != self.buttonAbilitaPL1.detectMouseOver(mousePosition)):
				self.mouseOverAbilitaPL1 = self.buttonAbilitaPL1.detectMouseOver(mousePosition)


			
	def disegnaTutto(self, giocDaNonDisegnare=None):
		if(self.partitaTerminata == False and self.giocoPartito):
				#Se è il primo giro deve stabilire chi sarà il primo giocatore a giocare
			flagPrimoGiro = (self.player == None and self.com == None)
			
			""" 
		! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! 
				Purtroppo pygame funziona in questo modo, non posso "spostare" un elemento
				posso solo ripartire da foglio bianco a disegnare
		! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! !
			"""
			#"ripulisce" tutto
			self.game.display.blit(sfondo, (0,0))
			
			self.game.display.blit(imgCrazyGoose, (300,0))
			
				#Riempe la lista di caselle, cioè "disegna" gli ellissi.
			self.posizionaLeCaselle()
				#Scrive nelle caselle il loro effetto
			self.riempiCaselle()
				
				
			self.scriviEffetti(self.player, True)
			self.scriviEffetti(self.com, False)

			#Il primo argomento è self xke necessita di questa classe per
			# richiamarne il metodo "tiraDado"
			if(self.buttonDadoPL1 == None):
				self.buttonDadoPL1 = Button(self, self.game, 15, 35, 70, 70, self.valDadoPL1)
			else:
				self.buttonDadoPL1.disegna(self.valDadoPL1)
				
			if (self.buttonDadoCOM == None):
				self.buttonDadoCOM = Button(self, self.game, 880, 35, 70, 70, self.valDadoCOM)
			else:
				self.buttonDadoCOM.disegna(self.valDadoCOM)
			

			if(giocDaNonDisegnare != "PL1"):
				if(self.player == None):
					self.player = Giocatore(self, self.game, self.caselle, self.percorso, "PL1", self.sceltaPedina.mouseOver)
				else:
					self.player.mostraPedina()
					
					
			if (giocDaNonDisegnare != "COM"):
				if (self.com == None):
								#ha bisogno di sapere quale oca ha scelto l'avversario (il player)
					self.com = Giocatore(self, self.game, self.caselle, self.percorso, "COM", self.sceltaPedina.mouseOver)
				else:
					self.com.mostraPedina()
					
			# Il primo argomento è self xke necessita di questa classe per
			# usare blit_screen
			#(NB. controlli che necessitano che self.player NON SIA None)
			if (self.buttonAbilitaPL1 == None and self.player.abilitaAttivata == False):
				self.buttonAbilitaPL1 = ButtonAbilitaPL1(self, self.game, self.player.pedinaScelta, 170, 10, 70, 70)
			else:
				if (self.player.attendoAbilita == False):
					self.buttonAbilitaPL1.disegna()
				# else: lo sta già facendo (in Giocatore)
			
			
			if(flagPrimoGiro):
				# Decide chi incomincia, tira il dado e vede se il numero tirato è pari o dispari
				# (tra 1 e 6 ci sono 3 pari e 3 dispari, perciò 50% possbilità a testa)
				if (Dado().tiraDado() % 2 == 0):
					self.player.turnoMio = True
					self.com.turnoMio = False
					
					self.aChiTocca = True
				else:
					self.player.turnoMio = False
					self.com.turnoMio = True
					
					#Fa giocare il COM
					# (tutto in un altro thread (altro processo))
					self.turnoCOM = threading.Thread(target=self.toccaAlCOM)
					self.turnoCOM.start()
				
					self.aChiTocca = False
			
			self.segnalaChiTocca()
			self.blit_screen()
	
	
	def scriviEffetti(self, player_com, isPL1):
		if(player_com != None):
			pxTesto = 16
			font = pygame.font.Font(self.game.font_name, pxTesto)
				#(distanza dal margine dx, se isPL1 == True)
			xRect = 20

			#Se effettivamente c'è qualcosa da scrivere entra
			if(player_com.ultimoMsg[0] != ""):
				#Prendo la dimensione che avrà il testo
				dimTesto = font.size(player_com.ultimoMsg[0])
				if(not isPL1):	#caso effetto preso dal COM, va scritto sulla dx della finestra
					xRect = self.game.DISPLAY_W - 23 - dimTesto[0]

				yRect = 120
				
				#3.5px distanza dal bordo dx e sx del rettangolo
				xText = xRect+(dimTesto[0])/2 +3.5
				
				#("dimTesto[]/2" xkè scriverò il testo CENTRATO, quindi mi servono le x e y CENTRALI del rect)
				
				#1px distanza dal bordo sup. e inf. del rettangolo
				yText = yRect+(dimTesto[1]/2) +1

				#(sarà il bordo)
				pygame.draw.rect(self.game.display, self.game.BLACK,
								 pygame.Rect(xRect, yRect, dimTesto[0]+7, dimTesto[1]+2+2), 0)
				# dimTesto[0]+7  = larghezza del testo più distanza dal bordo a dx + sx
				# dimTesto[0]+2  = larghezza del testo più distanza dal bordo in alto + in basso
				#(sarà l'area col testo)
				pygame.draw.rect(self.game.display, player_com.ultimoMsg[1],
								 pygame.Rect(xRect+2, yRect+2, dimTesto[0] + 7-4, dimTesto[1] + 2-2), 0)
				draw_text(self.game, player_com.ultimoMsg[0], pxTesto, self.game.BLACK, xText, yText+2)

				#Se effettivamente c'è qualcosa da scrivere entra
				if(player_com.penultimoMsg[0] != ""):
					pxTesto = 14
					font = pygame.font.Font(self.game.font_name, pxTesto)
					
					dimTesto = font.size(player_com.penultimoMsg[0])
					if(not isPL1):
						xRect = self.game.DISPLAY_W - 23 - dimTesto[0]

					#Aumenta la yRect dell'ultimo effetto, quindi scriverà il penultimo effetto distante 1 px
					# (altezza del testo + 1px di margine sopra e sotto)
					yRect += (dimTesto[1]+4+1)
					
					#3.5px distanza dal bordo dx e sx del rettangolo
					xText = xRect+(dimTesto[0])/2 +3.5
					
					#("dimTesto[]/2" xkè scriverò il testo CENTRATO, quindi mi servono le x e y CENTRALI del rect)
					
					#1px distanza dal bordo sup. e inf. del rettangolo
					yText = yRect+(dimTesto[1]/2) +1
					
					pygame.draw.rect(self.game.display, self.game.BLACK, pygame.Rect(xRect, yRect, dimTesto[0]+7, dimTesto[1]+2), 1)
					
					# (sarà l'area col testo)
					pygame.draw.rect(self.game.display, player_com.penultimoMsg[1],
									 pygame.Rect(xRect + 2, yRect + 2, dimTesto[0] + 7 - 4, dimTesto[1] + 2 - 2), 0)
					
					draw_text(self.game, player_com.penultimoMsg[0], pxTesto, self.game.BLACK, xText, yText + 2)
	
	
	def tiraDado(self):
			#Se la partita è terminata "blocca" la funzionalità del dado
		if(not self.partitaTerminata):
			numEstratto = Dado().tiraDado()
			if(self.player.turnoMio):
				self.turnoPL1 = threading.Thread(target=self.avanzaPlayer1, args=(numEstratto,))
				self.turnoPL1.start()
			else:
				self.turnoCOM = threading.Thread(target=self.toccaAlCOM, args=(numEstratto,))
				self.turnoCOM.start()
			

	def toccaAlCOM(self, numEstratto=-1):
		#Se il num del dado non viene passato (è settato a -1) lancia il dado
		if(numEstratto == -1):
			numEstratto = Dado().tiraDado()
		
		#Non devo bloccare il PL1 per 2 secondi, quindi se il COM ha un fermo non
		# faccio la sleep di 2 sec (dopo aver decrementato il fermo lancia il metodo
		# per far avanzare PL1 quindi tecnicamente si muove il PL1 e si deve muovere
		# subito non dopo 2 sec)
		if(self.com.turniFermo == 0):
			pygame.time.wait(2000)
			self.buttonDadoCOM.faiGirare()

		self.avanzaCOM(numEstratto)


	def avanzaPlayer1(self, numEstratto, controllaCodCasella=True):
		#numEstratto = 40
		
		#se num estratto è < 0 vuol dire che è stata attivata l'abilità
		# del COM (che richiama questo metodo con numEstratto = -2), quindi
		# non importa se il player ha o non ha un fermo
		
		if(self.player.turniFermo > 0 and numEstratto > 0):
			# Se il PL1 ha beccato un fermo in precedenza deve "consumarlo"
			# (poi richiama il metodo per far avanzare il COM, sarà come
			# se avesse tirato l'avversario)
			self.player.turniFermo -= 1
			
			self.player.turnoMio = False
			self.com.turnoMio =	 True

			self.aChiTocca = False

			self.turnoCOM = threading.Thread(target=self.toccaAlCOM, args=(numEstratto,))
			self.turnoCOM.start()
		else:
			#(La prossima volta che verrà richiamato "disegnaTutto" il numero
			# del dado sarà cambiato)
			self.valDadoPL1 = numEstratto

			#controllaCodCasella = False se è stata attivata l'abilità del COM
			toccaAncoraA_Me = self.player.avanza(numEstratto, controllaCodCasella)
			
			#Se la posizione è la stessa del COM, e l'abilità del COM
			# si può attivare, attiva l'abilità del COM
			if (self.player.posizione == self.com.posizione and
				self.player.posizione > 2):
				
				self.attivaAbilitaCOM(True, toccaAncoraA_Me)
			else:
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
						self.aChiTocca = False
						
						#Lancerà il dado, entrerà in avanzaPlayer1 che
						# decrementerà il suo fermo e lancerà avanzaCOM
						self.tiraDado()
					else:
						if(self.com.turniFermo > 0):
								#Se l'avversario ha un fermo al 100% tocca al PL1...
							self.aChiTocca = True
						else:
							#L'avversario non ha un fermo MA non è detto che tocchi a lui
							# (PL1 potrebbe aver preso un TIRA DI NUOVO) quindi controllo
							if(self.com.turnoMio):
								self.aChiTocca = False
								
								self.turnoCOM = threading.Thread(target=self.toccaAlCOM)
								self.turnoCOM.start()
							else:
								self.aChiTocca = True
								
					# finito il turno, segnalerà a chi tocca
					self.disegnaTutto()
				else:
						#Segnala PL1 come vincitore e fa TERMINARE la partita
					self.segnalaVincitore(True)
					self.partitaTerminata = True


	def avanzaCOM(self, numEstratto):
		#numEstratto = 40
		
		#(Per i commenti, più o meno tutti, VEDI "avanzaPlayer1")
		if(self.com.turniFermo > 0):
			self.com.turniFermo -= 1

			self.player.turnoMio = True
			self.com.turnoMio = False

			self.aChiTocca = True
			
			self.turnoPL1 = threading.Thread(target=self.avanzaPlayer1, args=(numEstratto,))
			self.turnoPL1.start()
		else:
			self.valDadoCOM = numEstratto

			toccaAncoraA_Me = self.com.avanza(numEstratto)
			
			if(self.com.posizione == self.player.posizione and
				self.player.posizione > 2):
				
				self.attivaAbilitaCOM(False, toccaAncoraA_Me)
			else:
				if(not self.com.vincitore):
					self.player.turnoMio = not toccaAncoraA_Me
					if(self.com.turniFermo > 0):
						self.player.turniFermo = 0
						self.aChiTocca = True
					else:
						if(self.player.turniFermo > 0):
							self.aChiTocca = False
							self.tiraDado()
						else:
							if(self.player.turnoMio):
								self.aChiTocca = True
							else:
								self.aChiTocca = False
								self.turnoCOM = threading.Thread(target=self.toccaAlCOM)
								self.turnoCOM.start()
								
					# finito il turno, segnalerà a chi tocca
					self.disegnaTutto()
				else:
					self.segnalaVincitore(False)
					self.partitaTerminata = True


	def attivaAbilitaCOM(self, turnoPL1, toccaAncoraA_Me):
		# micro-fermo del PL1 sulla casella del COM
		#in disegnaTutto() farà self.player/self.com  .mostraPedina() e lì cambia l'img
		self.disegnaTutto()
		pygame.time.wait(700)
		
		#sposta di 2 indietro il PL1 (non dovrà controlla l'effetto della casella su cui
		# finisce quindi passo False)
		self.turnoPL1 = threading.Thread(target=self.player.avanza, args=(-2, False))
		self.turnoPL1.start()
		
		#Aspetta che il PL1 sia tornato indietro di 2 (che sia finito il movimento)
		while (self.player.isMoving):
			#si ferma per un attimo così da non occupare girare moltissime volte in un
			# loop "vuoto" che non fa nulla
			pygame.time.wait(200)
		
		
		#(Per i commenti, più o meno tutti, VEDI "avanzaPlayer1")
		if(turnoPL1):
			if (self.player.turniFermo > 0):
				self.com.turniFermo = 0
				self.aChiTocca = False
				
				self.tiraDado()
			else:
				if (self.com.turniFermo > 0):
					self.aChiTocca = True
					self.player.turnoMio = True
				else:
					if (not toccaAncoraA_Me):
						self.aChiTocca = False
						
						self.turnoCOM = threading.Thread(target=self.toccaAlCOM)
						self.turnoCOM.start()
					else:
						self.aChiTocca = True
						self.player.turnoMio = True
				
		else:
			if (self.com.turniFermo > 0):
				self.player.turniFermo = 0
				self.aChiTocca = True
			else:
				if (self.player.turniFermo > 0):
					self.aChiTocca = False
					self.tiraDado()
				else:
					#(siamo nel turno del COM, quindi se il flag è True tocca al COM)
					if (toccaAncoraA_Me):
						self.aChiTocca = False
						self.turnoCOM = threading.Thread(target=self.toccaAlCOM)
						self.turnoCOM.start()
					else:
						self.aChiTocca = True
						self.player.turnoMio = True
				
				
		# finito il turno, segnala a chi tocca
		self.disegnaTutto()
		
			
	def segnalaChiTocca(self):
		if(self.aChiTocca):
			valRectPL1 = 0
			valRectCOM = -1
		else:
			valRectPL1 = -1
			valRectCOM = 0
		
		#Per creare un bordo molto più visibile (potrei usare valRectPL1/valRectCOM = 0 ma è piccolo)
		# creo un rettangolo PIENO rosso e poi ne ricreo uno all'interno bianco dentro cui poi ci scrivo
		#				( esattamente come ho fatto per il dado e la scelta delle oche )
		
		pygame.draw.rect(self.game.display, self.game.RED, pygame.Rect(14, 9, 72, 22), valRectPL1)
		pygame.draw.rect(self.game.display, self.game.WHITE, pygame.Rect(17, 12, 66, 16), 0)
		
	# ! ! ! se < 0 NON LO DISEGNA, se = 0 riempe anche l'interno, se > 0 FA SOLO IL CONTORNO ! ! !
		
		pygame.draw.rect(self.game.display, self.game.RED, pygame.Rect(845, 9, 130, 22), valRectCOM)
		pygame.draw.rect(self.game.display, self.game.WHITE, pygame.Rect(848, 12, 124, 16), 0)
		
		#Ri-disegna le info dei player che si saranno "nascoste"
		draw_text(self.game, INFO_PL1, 15, self.game.BLACK, 50, 20)
		draw_text(self.game, INFO_COM, 15, self.game.BLACK, 910, 20)
		

	def segnalaVincitore(self, haVintoPlayer1):
		#si ferma un attimo sulla casella finale
		time.sleep(1)
		if(haVintoPlayer1):
			self.game.gameWin()
		else:
			self.game.gameOver()
			
			
	def riempiCaselle(self):
		"""Cicla per ogni casella e controlla, se la posizione della casella
		 c'è tra le chiavi del dizionario del percorso allora "carico" l'effetto
		 (prendendo il codice contenuto nel valore con quella chiave, il codice della casella),
		 altrimenti non metto nulla (uso il codice -1)"""
		i=1
		for i in range(QTA_CASELLE_TOTALI+1):
			if(i in self.percorso.dictCaselle.keys()):
				self.caselle[i-1].settaEffetto(self.percorso.dictCaselle[i], self.game.font_name, i)
			else:	#chiave inesistente (cioè posizione VUOTA)
				self.caselle[i-1].settaEffetto(-1, self.game.font_name, i)


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
			#Casella finale non sarà un ellisse di normale dimensioni
		self.caselle.append( Casella(self.game.display, 370, 340, 105, 95) )