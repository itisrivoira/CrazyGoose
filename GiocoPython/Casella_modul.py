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

import tkinter as tk

class Casella():
	def __init__(self, finestra, objCanvas, posx, posy, tagChosen="", width=90, height=60):
		self.finestra = finestra
		
		self.x1 = posx
		self.y1 = posy
		self.x2 = posx + width
		self.y2 = posy + height

			#il tag mi serve ad individuare l'oggetto canvas (ad es. serve per eliminarlo)
		objCanvas.create_oval(self.x1, self.y1, self.x2, self.y2, tag=tagChosen)
	
	def settaEffetto(self, codCasella):
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

		self.lbl = tk.Label(self.finestra, text=testo)
		self.lbl.place(x=self.getCenterX(), y=self.getCenterY(), anchor=tk.CENTER)


	def getCenterX(self):
		       #[                   ] => il risultato di questo è il width
		return ( (self.x2-self.x1)/2 + self.x1 )
		
	def getCenterY(self):
		       #[                   ] => il risultato di questo è la height
		return ( (self.y2-self.y1)/2 + self.y1 )