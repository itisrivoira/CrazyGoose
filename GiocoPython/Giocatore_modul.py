import time

from Casella_modul import *
from globalFunction import *
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

#x/y delle CASELLE INIZIALI dei due giocatori
X_PLAYER1 = 25
X_PLAYER2 = 25
Y_PLAYER1 = 565
Y_PLAYER2 = 630


class Giocatore():
	def __init__(self, crazyGoose, game, caselle, percorso, tag):
			#Mi serve per lanciare un suo metodo
		self.crazyGoose = crazyGoose
		self.game = game
		self.caselle = caselle
		self.percorso = percorso
		self.tag = tag

		self.posizione = 30
		self.newSpostamento = 0
		self.turnoMio = False
		self.turniFermo = 0
		self.vincitore = False
			
		self.ultimoMsg = ""
		self.penultimoMsg = ""

		self.creaCasellaIniziale()


	def creaCasellaIniziale(self):
		if(self.tag == "PL1"):
			x, y = X_PLAYER1, Y_PLAYER1
		else:
			x, y = X_PLAYER2, Y_PLAYER2
		
		#crea e posiziona l'ellisse (la casella) prima dell'inizio del percorso
		# poi inserisce la scritta che identifica il giocatore
		self.casellaIniziale = Casella(self.game.display, x, y)
		
		draw_text(self.game, self.tag, 12, (255,0,0,1)
				  , self.casellaIniziale.getCenterX(), self.casellaIniziale.getCenterY())
	
	
	def posiziona(self, spostamento, controllaCasella=True):
			#Controlla che con il numero che ha fatto non "esca" dal percorso
		if(self.posizione+spostamento <= QTA_CASELLE_TOTALI):
				#aggiorno la posizione
			self.posizione += spostamento
			
			try:
				if(controllaCasella):
						#prendo il codice della casella in cui si trova il giocatore
					codCasella = self.percorso.dictCaselle[self.posizione]

				#La pedina si muoverà (prima di un eventuale nuovo spostamento, prima di richiamare
				# il metodo per controllare la casella sottostante)
				self.ridisegnaTutto(spostamento)
				
				if (controllaCasella):
					#Controlla l'effetto contenuto nella
					# casella (richiamerà di nuovo posiziona se ci fosse da spostare la pedina)
					self.controllaCodiceCasella(codCasella)
			except KeyError:
				#Non ha trovato quella posizione nel dizionario, perciò dev'essere una casella VUOTA
				self.ridisegnaTutto(spostamento)

		else:
			# ( se servisse mai la posizione della casella in cui finirà... è newSpostamento+self.posizione
			# (cioè il calcolo qua sopra senza quel "- self.posizione") )
			
			#sposto fino alla casella finale (Non constrollo il codice
			# casella xkè sennò mi darebbe la vittoria) E POI risposto INDIETRO di tot caselle
			# es. sono casella 37 faccio 6 ==> mi sposto di 3 nella casella di vittoria
			# 		e poi torno indietro di 3
			if (self.newSpostamento == 0):
				self.newSpostamento = -((self.posizione + spostamento) - QTA_CASELLE_TOTALI)
				
			self.posiziona((QTA_CASELLE_TOTALI-self.posizione), False)
			#ferma un attimo il giocatore sulla casella finale
			time.sleep(0.3)
			
			#Riposiziona il giocatore
			self.posiziona(self.newSpostamento)
			self.newSpostamento = 0
	
	
	def ridisegnaTutto(self, spostamento):
		#mi serve la pos di partenza, e io ho già aumentato la pos. quindi
		# passo la posizione meno lo spostamento
		self.spostaPedina((self.posizione-spostamento), spostamento)
	
	
	def spostaPedina(self, partenza, spostamento):
		#cioè deve tornare alla prima casella
		if(spostamento == -38):
			x1 = self.caselle[partenza-1].getCenterX()
			y1 = self.caselle[partenza-1].getCenterY()
			x2 = self.caselle[0].getCenterX()
			y2 = self.caselle[0].getCenterY()
			
			self.spostaFraDueCaselle(x1, y1, x2, y2)
		else:
			if(partenza > 0):
				if(spostamento > 0):
					#una sorta di flag per il primo giro
					x1 = None
					
					i = 0
					while(i < spostamento):
						if(x1 == None):
							x1 = self.caselle[partenza-1].getCenterX()
							y1 = self.caselle[partenza-1].getCenterY()
						else:
							x1 = self.caselle[partenza - 1 + i].getCenterX()
							y1 = self.caselle[partenza - 1 + i].getCenterY()
						
						x2 = self.caselle[partenza - 1 + i + 1].getCenterX()
						y2 = self.caselle[partenza - 1 + i + 1].getCenterY()
						
						self.spostaFraDueCaselle(x1, y1, x2, y2)
						
						i += 1
				else:
					spostamento = -spostamento
					# una sorta di flag per il primo giro
					x1 = None
					
					i = 0
					while (i < spostamento):
						if (x1 == None):
							x1 = self.caselle[partenza - 1].getCenterX()
							y1 = self.caselle[partenza - 1].getCenterY()
						else:
							x1 = self.caselle[partenza - 1 - i].getCenterX()
							y1 = self.caselle[partenza - 1 - i].getCenterY()
						
						x2 = self.caselle[partenza - 1 - i - 1].getCenterX()
						y2 = self.caselle[partenza - 1 - i - 1].getCenterY()
						
						self.spostaFraDueCaselle(x1, y1, x2, y2)
						
						i += 1
			else:
				x1 = self.casellaIniziale.getCenterX()
				y1 = self.casellaIniziale.getCenterY()
				
				x2 = self.caselle[0].getCenterX()
				y2 = self.caselle[0].getCenterY()
				
				self.spostaFraDueCaselle(x1, y1, x2, y2)
				self.spostaPedina(1, spostamento-1)
			
	
	def spostaFraDueCaselle(self, x1, y1, x2, y2):
		mov_x = 4
		mov_y = 4
		
		partenza_x = x1
		partenza_y = y1
		fine_x = x2
		fine_y = y2
		
		#!!! Per tutta la durata del loop comincia ad usare moolta CPU...
		continua = True
		while(continua):
			# metto un minuscolo fermo, altrimenti sarebbe troppo veloce
			pygame.time.wait(15)
			# Non disegnerà il giocatore
			self.crazyGoose.disegnaTutto(self.tag)
			
			if(partenza_x < fine_x):
				partenza_x += mov_x
			elif(partenza_x > fine_x):
				partenza_x -= mov_x
			
			if(partenza_x >= fine_x-5 and partenza_x <= fine_x+5):
				partenza_x = fine_x
			
			if(partenza_y > fine_y):
				partenza_y -= mov_y
			elif(partenza_y < fine_y):
				partenza_y += mov_y
			
			if(partenza_y >= fine_y-5 and partenza_y <= fine_y+5):
				partenza_y = fine_y
			
				
			if (partenza_x >= fine_x-5 and partenza_x <= fine_x+5
					and partenza_y >= fine_y-5 and partenza_y <= fine_y+5):
				
				continua = False
				draw_text(self.game, self.tag, 12, (255, 0, 0, 1), fine_x, fine_y)
			else:
				draw_text(self.game, self.tag, 12, (255, 0, 0, 1), partenza_x, partenza_y)
						
						
			# Per disegnare veramente sullo schermo
			self.crazyGoose.blit_screen()
			
			
	def mostraPedina(self, posAvvessario):
		if(self.posizione > 0):
			x = self.caselle[self.posizione-1].getCenterX()
			
			y = self.caselle[self.posizione - 1].getCenterY()
			if(posAvvessario == self.posizione):
				if(self.tag == "PL1"):
					#più in alto
					y -= 15
				else:
					# più in basso
					y += 15
				
			draw_text(self.game, self.tag, 12, (255, 0, 0, 1), x, y)


	def avanza(self, spostamento):
		#Di default appena si muove, il giocatore ha finito il turno e quindi setto
			#subito turnoMio = False, tuttavia potrebbe essere risettato a True se il
			# giocatore finisce sulla casella TIRA_DI_NUOVO
		self.turnoMio = False
		self.posiziona(spostamento)

			#Ritorna indietro il flag, in questo modo si saprà a chi toccherà
		return self.turnoMio
	
	
	def controllaCodiceCasella(self, codCasella):
		"""
		In questo metodo controllo l'effetto della casella su cui è capitato
		 il giocatore. Setto lo spostamento a 0 xkè l'effetto potrebbe lasciare lì
		 dov'è il giocatore (come il fermo e il tira_di_nuovo), se invece lo
		 spostamento cambia (!= 0) vorrà dire che è capitato
		 su una casella che fa muovere il giocatore ==> richiamo di nuovo il "self.posiziona()"
		"""
		
		spostamento = 0
		msg = ""

		if(codCasella == TIRA_DI_NUOVO[0]):
			msg = "TIRA ANCORA IL DADO"
			self.turnoMio = True

		elif(codCasella == INDIETRO_DI_UNO[0]):
			msg = "INDIETRO DI UNA CASELLA"
			spostamento = -1

		elif(codCasella == INDIETRO_DI_TRE[0]):
			msg = "INDIETRO DI TRE CASELLE"
			spostamento = -3

		elif(codCasella == AVANTI_DI_UNO[0]):
			msg = "AVANTI DI UNA CASELLA"
			spostamento = 1

		elif(codCasella == AVANTI_DI_QUATTRO[0]):
			msg = "AVANTI DI QUATTRO CASELLE"
			spostamento = 4

		elif(codCasella == FERMO_DA_UNO[0]):
			msg = "FERMO PER UN GIRO"
			self.turniFermo = 1

		elif(codCasella == FERMO_DA_DUE[0]):
			msg = "FERMO PER DUE GIRI"
			self.turniFermo = 2

		elif(codCasella == TORNA_ALL_INIZIO):
			msg = "RICOMINCIA DA CAPO !!!"
			#Lo fa ritornare alla 1° casella
			#Dalla posizione == 39 va alla 1° ==> si muove di 38 posizioni indietro
			spostamento = -(self.posizione-1)
		elif(codCasella == VITTORIA):
			# print("HAI VINTO "+self.tag+" !!!" )
			self.vincitore = True

		if(msg != ""):
			self.penultimoMsg = self.ultimoMsg
			self.ultimoMsg = msg

			#per mostrare i msg
			self.crazyGoose.disegnaTutto()

		if(spostamento != 0):
			#attende un secondo
			time.sleep(0.5)
			self.posiziona(spostamento)
