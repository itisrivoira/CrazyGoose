from Casella_modul import *
import tkinter as tk

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
Y_PLAYER1 = 575
Y_PLAYER2 = 640


class Giocatore():
	def __init__(self, finestra, objCanvas, caselle, percorso, tag):
		self.finestra = finestra
		self.objCanvas = objCanvas
		self.caselle = caselle
		self.percorso = percorso
		self.tag = tag

		self.posizione = 0
		self.turnoMio = False
		self.turniFermo = 0
		self.creaCasellaIniziale()

		self.vincitore = False


	def creaCasellaIniziale(self):
		if(self.tag == "PL1"):
			x, y = X_PLAYER1, Y_PLAYER1
		else:
			x, y = X_PLAYER2, Y_PLAYER2
		
			#crea e posiziona l'ellisse (la casella) prima dell'inizio del percorso
			# poi inserisce la scritta che identifica il giocatore
		casellaIniziale = Casella(self.finestra, self.objCanvas, x, y, self.tag)
		self.player = tk.Label(self.finestra, text=self.tag, fg="#f00f0f")
		self.player.place(x=casellaIniziale.getCenterX(), y=casellaIniziale.getCenterY(), anchor=tk.CENTER)	

	
	def posiziona(self, spostamento):

		try:
				#Elimina la casella iniziale (l'ellisse prima dell'inizio del percorso)
			self.objCanvas.delete(self.tag)
		except Exception:
			pass

			#Controlla che con il numero che ha fatto non "esca" dal percorso
		if(self.posizione+spostamento <= QTA_CASELLE_TOTALI):
				#aggiorno la posizione
			self.posizione += spostamento

			try:
					#prendo il codice della casella in cui si trova il giocatore 
				codCasella = self.percorso.dictCaselle[self.posizione]

					#metodo che "fisicamente" muove la pedina
				self.spostaPedina()
				self.controllaCodiceCasella(codCasella)

			except KeyError:
					#Non ha trovato quella posizione nel dizionario, perciò dev'essere una casella VUOTA
				codCasella = -1
				self.spostaPedina()

		else:
				#Calcolo lo spostamento che dovrà fare dalla casella attuale
			newSpostamento = (QTA_CASELLE_TOTALI-(spostamento - (QTA_CASELLE_TOTALI - self.posizione))) - self.posizione
			#( se servisse mai la posizione della casella in cui finirà... è newSpostamento+self.posizione
			# (cioè il calcolo qua sopra senza quel "- self.posizione") )
			
				#Riposiziona il giocatore
			self.posiziona(newSpostamento)
		
			
	def spostaPedina(self):
			#Sposta semplicemente il nome del player (per ora)
		self.player.place(
				#quella è una lista di Casella, le liste sono 0-based !
			x=self.caselle[self.posizione-1].getCenterX(),
			y=self.caselle[self.posizione-1].getCenterY(),
			anchor=tk.CENTER)



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

		#TODO !!! PRINT DI CONTROLLO DA RIMUOVERE POI
		
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
