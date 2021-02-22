from Giocatore_modul import * 
from Percorso_modul import *
from Casella_modul import *

import tkinter as tk
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
		

class Gioco():
	def __init__(self):
		self.finestra = tk.Tk()
		self.finestra.title("Gioco dell'oca")
		self.finestra.geometry("1000x700+200+0")
		self.finestra.resizable(0,0)
		""" Ho bisogno di controllare che quando preme la X per chiudere la scheda il COM
			abbia fatto la sua mossa, altrimenti rimarra appeso al nulla un Thread,
			quello del COM, e crasherebbe tutto """
		self.finestra.protocol('WM_DELETE_WINDOW', self.controllaPrimaDiChiudere)
		
	def start(self):
		self.partitaTerminata = False

		self.creaWidgets()
		
		self.finestra.mainloop()

	def controllaPrimaDiChiudere(self):
		if(not self.com.turnoMio):
			self.finestra.destroy()

	def creaWidgets(self):
			#L'oggetto canvas ricopre l'intera finestra
		canvasObj = tk.Canvas(self.finestra, width=1000, height=700)
		canvasObj.place(x=0, y=0)
		
			#lista di oggetti Casella
		self.caselle = list()
		self.percorso = Percorso()
		
			#"DISEGNA" gli ellissi
		self.posizionaLeCaselle(canvasObj)
			#scrive nelle caselle il loro effetto
		self.riempiCaselle()
		
			#posiziona info del Player1
		self.lblInfoPl = tk.Label(self.finestra, text="Tu (PL1)")
		self.lblInfoPl.place(x=50, y=20, anchor=tk.CENTER)
		
		lblInfoPL1 = tk.Label(self.finestra, text="Dado PL1:")
		lblInfoPL1.place(x=55, y=60, anchor=tk.CENTER)

		self.valDadoPL1 = tk.IntVar()
		self.valDadoPL1.set(0)
			#Pulsante che funge da dado (brutto brutto per ora ma vabbè)
		self.btnDadoPL1 = tk.Button(self.finestra, textvariable=self.valDadoPL1, command=lambda:self.tiraDado())
		self.btnDadoPL1.place(x=120, y=60, anchor=tk.CENTER)

			#posiziona info del COM
		self.lblInfoCom = tk.Label(self.finestra, text="Computer (COM)")
		self.lblInfoCom.place(x=930, y=20, anchor=tk.CENTER)
		
		self.valDadoCOM = tk.StringVar()
		self.valDadoCOM.set( (INFO_DADO_COM+"0") )
		lblInfoCOM = tk.Label(self.finestra, textvariable=self.valDadoCOM)
		lblInfoCOM.place(x=917, y=60, anchor=tk.CENTER)

			#crea le pedine
		self.player = Giocatore(self.finestra, canvasObj, self.caselle, self.percorso, "PL1")
		self.com = Giocatore(self.finestra, canvasObj, self.caselle, self.percorso, "COM")
		
		
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
			self.valDadoPL1.set(numEstratto)

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
			self.valDadoCOM.set( (INFO_DADO_COM+str(numEstratto)) )

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
		if(turnoPlayer1):
			self.lblInfoPl.configure(bg="red")
			self.lblInfoCom.configure(bg="grey")
		else:
			self.lblInfoPl.configure(bg="grey")
			self.lblInfoCom.configure(bg="red")
	
	def segnalaVincitore(self, haVintoPlayer1):
		if(haVintoPlayer1):
			self.lblInfoPl.configure(bg="orange")
			self.lblInfoCom.configure(bg="grey")
		else:
			self.lblInfoPl.configure(bg="grey")
			self.lblInfoCom.configure(bg="orange")

			
	def riempiCaselle(self):
		"""
		Cicla per ogni casella e controlla, se la posizione della casella
		 c'è tra le chiavi del dizionario del percorso allora "carico" l'effetto
		 (prendendo il codice contenuto nel valore con quella chiave, il codice della casella),
		 altrimenti non metto nulla (uso il codice -1)
		"""
		i=1
		for i in range(QTA_CASELLE_TOTALI+1):
			if(i in self.percorso.dictCaselle.keys()):
				self.caselle[i-1].settaEffetto(self.percorso.dictCaselle[i])
			else:	#chiave inesistente (cioè posizione VUOTA)
				self.caselle[i-1].settaEffetto(-1)


	def posizionaLeCaselle(self, canvasObj):
		self.caselle.append( Casella(self.finestra, canvasObj, 160, 610) )
		self.caselle.append( Casella(self.finestra, canvasObj, 270, 610) )
		self.caselle.append( Casella(self.finestra, canvasObj, 380, 610) )
		self.caselle.append( Casella(self.finestra, canvasObj, 490, 610) )
		self.caselle.append( Casella(self.finestra, canvasObj, 600, 610) )
		self.caselle.append( Casella(self.finestra, canvasObj, 710, 610) )
		
		self.caselle.append( Casella(self.finestra, canvasObj, 790, 555) )
		self.caselle.append( Casella(self.finestra, canvasObj, 840, 485) )
		self.caselle.append( Casella(self.finestra, canvasObj, 850, 415) )
		self.caselle.append( Casella(self.finestra, canvasObj, 840, 345) )
		self.caselle.append( Casella(self.finestra, canvasObj, 790, 275) )
		
		self.caselle.append( Casella(self.finestra, canvasObj, 710, 220) )
		self.caselle.append( Casella(self.finestra, canvasObj, 600, 190) )
		self.caselle.append( Casella(self.finestra, canvasObj, 490, 190) )
		self.caselle.append( Casella(self.finestra, canvasObj, 380, 190) )
		self.caselle.append( Casella(self.finestra, canvasObj, 270, 190) )
		self.caselle.append( Casella(self.finestra, canvasObj, 170, 230) )

		self.caselle.append( Casella(self.finestra, canvasObj, 125, 310) )
		self.caselle.append( Casella(self.finestra, canvasObj, 125, 395) )
		self.caselle.append( Casella(self.finestra, canvasObj, 125, 480) )

		self.caselle.append( Casella(self.finestra, canvasObj, 215, 540) )
		self.caselle.append( Casella(self.finestra, canvasObj, 325, 540) )
		self.caselle.append( Casella(self.finestra, canvasObj, 435, 540) )
		self.caselle.append( Casella(self.finestra, canvasObj, 545, 540) )
		self.caselle.append( Casella(self.finestra, canvasObj, 653, 525) )
		
		self.caselle.append( Casella(self.finestra, canvasObj, 735, 475) )
		self.caselle.append( Casella(self.finestra, canvasObj, 735, 390) )
		self.caselle.append( Casella(self.finestra, canvasObj, 680, 315) )
		
		self.caselle.append( Casella(self.finestra, canvasObj, 585, 270) )
		self.caselle.append( Casella(self.finestra, canvasObj, 475, 270) )
		self.caselle.append( Casella(self.finestra, canvasObj, 365, 270) )
		
		self.caselle.append( Casella(self.finestra, canvasObj, 265, 305) )
		self.caselle.append( Casella(self.finestra, canvasObj, 230, 380) )
		self.caselle.append( Casella(self.finestra, canvasObj, 270, 455) )
		
		self.caselle.append( Casella(self.finestra, canvasObj, 380, 470) )
		self.caselle.append( Casella(self.finestra, canvasObj, 490, 470) )
		self.caselle.append( Casella(self.finestra, canvasObj, 590, 450) )
		
		self.caselle.append( Casella(self.finestra, canvasObj, 625, 380) )
		self.caselle.append( Casella(self.finestra, canvasObj, 525, 345) )
		self.caselle.append( Casella(self.finestra, canvasObj, 370, 350, "", 105, 95) )


class StartGame():
	def __init__(self):
		gioco = Gioco()
		gioco.start()