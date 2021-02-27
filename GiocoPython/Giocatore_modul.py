import time

from Casella_modul import *

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


#Metodo per disegnare testo (per scrivere) con un
# determinato font, dimensione e colore, il tutto
# centrato in un rettangolo alle coordinate passate

#N.B. NON POSSO IMPORTARE IL METODO DAL FILE crazyGoose
# XKE SENNÒ DA ERRORE:
#ImportError: cannot import name 'draw_text' from partially initialized module 'crazyGoose'
def draw_text(game, text, size, color, x, y):
	font = pygame.font.Font(game.font_name, size)
	text_surface = font.render(text, True, color)
	text_rect = text_surface.get_rect()
	text_rect.center = (x, y)
	# Ora va realmente a disegnare la scritta
	game.display.blit(text_surface, text_rect)
	

class Giocatore():
	def __init__(self, crazyGoose, game, caselle, percorso, tag):
			#Mi serve per lanciare un suo metodo
		self.crazyGoose = crazyGoose
		self.game = game
		self.caselle = caselle
		self.percorso = percorso
		self.tag = tag

		self.posizione = 0
		self.turnoMio = False
		self.turniFermo = 0
		self.vincitore = False

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
	
	
	def posiziona(self, spostamento):
			#Controlla che con il numero che ha fatto non "esca" dal percorso
		if(self.posizione+spostamento <= QTA_CASELLE_TOTALI):
				#aggiorno la posizione
			self.posizione += spostamento

			try:
					#prendo il codice della casella in cui si trova il giocatore 
				codCasella = self.percorso.dictCaselle[self.posizione]

				self.ridisegnaTutto()
				
				#Controlla l'effetto contenuto nella casella
				self.controllaCodiceCasella(codCasella)

			except KeyError:
				#Non ha trovato quella posizione nel dizionario, perciò dev'essere una casella VUOTA
				self.ridisegnaTutto()

		else:
				#Calcolo lo spostamento che dovrà fare dalla casella attuale
			newSpostamento = (QTA_CASELLE_TOTALI-(spostamento - (QTA_CASELLE_TOTALI - self.posizione))
							  ) - self.posizione
			#( se servisse mai la posizione della casella in cui finirà... è newSpostamento+self.posizione
			# (cioè il calcolo qua sopra senza quel "- self.posizione") )
			
			#Riposiziona il giocatore
			self.posiziona(newSpostamento)
	
	def ridisegnaTutto(self):
		# "sposterà" il giocatore. In realtà ripartirà da
		# un "foglio bianco" e disegnare il giocatore in
		# una certa posizione
		
		#Piccolo fermo per far capire all'utente cosa stia succedendo
		time.sleep(0.5)
		
		self.crazyGoose.disegnaTutto()
		
	def spostaPedina(self, posAvvessario):
		if(self.posizione > 0):
			x = self.caselle[self.posizione-1].getCenterX()
			
			y = self.caselle[self.posizione - 1].getCenterY()
			if(posAvvessario == self.posizione):
				if(self.tag == "PL1"):
					#più in alto
					y -= 20
				else:
					# più in basso
					y += 20
				
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

		#TODO !!! PRINT DI CONTROLLO DA SOSTITUIRE CON AVVISO AL GIOCATORE OPPURE TOGLIERE PROPRIO
		
		spostamento = 0

		if(codCasella == TIRA_DI_NUOVO[0]):
			print("TIRA ANCORA IL DADO "+self.tag)
			self.turnoMio = True

		elif(codCasella == INDIETRO_DI_UNO[0]):
			
			spostamento = -1
			print("INDIETRO DI UNA CASELLA "+self.tag)

		elif(codCasella == INDIETRO_DI_TRE[0]):
			
			spostamento = -3
			print("INDIETRO DI TRE CASELLA "+self.tag)

		elif(codCasella == AVANTI_DI_UNO[0]):
			
			spostamento = 1
			print("AVANTI DI UNA CASELLA "+self.tag)

		elif(codCasella == AVANTI_DI_QUATTRO[0]):
			
			spostamento = 4
			print("AVANTI DI QUATTRO CASELLE "+self.tag)

		elif(codCasella == FERMO_DA_UNO[0]):
			
			print("STATTE FERMO PER UN GIRO "+self.tag)
			self.turniFermo = 1
		
		elif(codCasella == FERMO_DA_DUE[0]):
		
			print("STATTE FERMO PER DUE GIRI "+self.tag)
			self.turniFermo = 2

		elif(codCasella == TORNA_ALL_INIZIO):
			print(self.tag+" TORNA DA CAPO !!!" )
			
			#Lo fa ritornare alla 1° casella
			#Dalla posizione == 39 va alla 1° ==> si muove di 38 posizioni indietro
			self.posiziona(-(self.posizione-1))

		elif(codCasella == VITTORIA):
			print("HAI VINTO "+self.tag+" !!!" )
			self.vincitore = True


		if(spostamento != 0):
			self.posiziona(spostamento)