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
Y_PLAYER1 = 540
Y_PLAYER2 = 620

WIDTH_PEDINA = 65
HEIGHT_PEDINA = 60

class Giocatore():
	def __init__(self, crazyGoose, game, caselle, percorso, tag, pedinaScelta):
			#Mi serve per lanciare un suo metodo
		self.crazyGoose = crazyGoose
		self.game = game
		self.caselle = caselle
		self.percorso = percorso
		self.tag = tag
		if (self.tag == "PL1"):
			self.pedinaScelta = pedinaScelta
		else:
			#Pedina scelta mi serve solo per scegliere le img giuste anche per il COM, altrimenti
			# serve a nnt al COM
			self.pedinaScelta = None
		
		if(self.tag == "PL1"):
			#self.pedinaScelta sarà uguale a "gialla", "verde", "rossa" o "blu"
			
			self.imgPedinaSxDx = pygame.image.load("./images/pedine/pedineNelGioco/sxVersoDx/pedina_"+pedinaScelta+".png")
			self.imgPedinaDxSx = pygame.image.load("./images/pedine/pedineNelGioco/dxVersoSx/pedina_"+pedinaScelta+".png")
		
		else:
			# self.pedinaScelta sarà uguale a "gialla", "verde", "rossa" o "blu" (l'oca scelta dal player)
			
			self.imgPedinaSxDx = pygame.image.load("./images/pedine/pedineNelGioco/sxVersoDx/pedina_COM.png")
			self.imgPedinaDxSx = pygame.image.load("./images/pedine/pedineNelGioco/dxVersoSx/pedina_COM.png")
			

		self.imgScontroNoEffDxSx = pygame.image.load("./images/pedine/pedineNelGioco/COM_vs_PL1/abilitaNonAttivata/dxVersoSx/COM_vs_"+pedinaScelta+".png")
		self.imgScontroNoEffSxDx = pygame.image.load("./images/pedine/pedineNelGioco/COM_vs_PL1/abilitaNonAttivata/sxVersoDx/"+pedinaScelta+"_vs_COM.png")
		self.imgScontroEffDxSx = pygame.image.load("./images/pedine/pedineNelGioco/COM_vs_PL1/abilitaAttivata/dxVersoSx/COM_vs_" + pedinaScelta + ".png")
		self.imgScontroEffSxDx = pygame.image.load("./images/pedine/pedineNelGioco/COM_vs_PL1/abilitaAttivata/sxVersoDx/"+pedinaScelta+"_vs_COM.png")


		self.posizione = 0
		self.newSpostamento = 0
		self.turnoMio = False
		self.turniFermo = 0
		self.vincitore = False
		
			#flag che mi serve per "bloccare" alcune azioni finchè la pedina ha smesso di muoversi
		self.isMoving = False
			
		self.attendoAbilita = False
		self.abilitaAttivata = False
		
		#qui ci sarà l'effetto e il bg_color
		self.ultimoMsg = ["", ""]
		self.penultimoMsg = ["", ""]

		self.creaCasellaIniziale()


	def creaCasellaIniziale(self):
		if(self.tag == "PL1"):
			x, y = X_PLAYER1, Y_PLAYER1
			radiusN, radiusS = 25, 5
		else:
			x, y = X_PLAYER2, Y_PLAYER2
			radiusN, radiusS = 5, 25
		
		#crea e posiziona l'ellisse (la casella) prima dell'inizio del percorso
		# poi inserisce l'img della pedina del giocatore
		
		self.casellaIniziale = Casella(self.game.display, x, y, 90, 70, radiusN, radiusN, radiusS, radiusS)
		pygame.draw.rect(self.casellaIniziale.display, (255,255,255), pygame.Rect(
			self.casellaIniziale.x + 2, self.casellaIniziale.y + 2,
			self.casellaIniziale.width - 5, self.casellaIniziale.height - 5), 0,
						 0, self.casellaIniziale.radiusNO, self.casellaIniziale.radiusNE,
						 self.casellaIniziale.radiusSO, self.casellaIniziale.radiusSE)
		
		self.game.display.blit(self.imgPedinaSxDx,
							   (self.casellaIniziale.getCenterX() - WIDTH_PEDINA/2,
								self.casellaIniziale.getCenterY() - HEIGHT_PEDINA/2) )
		
	
	def posiziona(self, spostamento, controllaCasella=True):
			#Controlla che con il numero che ha fatto non "esca" dal percorso
		if(self.posizione+spostamento <= QTA_CASELLE_TOTALI):
				#aggiorno la posizione
			self.posizione += spostamento
			
			try:
				if(controllaCasella):
						#prendo il codice della casella in cui si trova il giocatore
					codCasella = self.percorso.dictCaselle[self.posizione]
				#Muove la pedina e POI controlla se è finità su una casella con un effetto
				
				#(Mi serve la posizione di PARTENZA, e io ho già aumentato la posizione. quindi
				# passo la posizione meno lo spostamento)
				self.spostaPedina((self.posizione-spostamento), spostamento)

				if(controllaCasella):
					#Controlla l'effetto contenuto nella
					# casella (richiamerà di nuovo "posiziona()" se ci fosse da spostare la pedina)
					self.controllaCodiceCasella(codCasella)
			except KeyError:
				#Non ha trovato quella posizione nel dizionario, perciò dev'essere una casella VUOTA
				
				#(Mi serve la posizione di PARTENZA, e io ho già aumentato la posizione. quindi
				# passo la posizione meno lo spostamento)
				self.spostaPedina((self.posizione-spostamento), spostamento)

		else:
			#* * * TIRO TROPPO LUNGO: va fino alla casella finale e poi si sposta indietro di tot * * *
			#Sposto fino alla casella finale (Non constrollo il codice
            # casella xkè sennò segnalerebbe la vittoria anche se in realtà non ha vinto)
            # E POI ri-sposto INDIETRO di tot caselle
            # es. sono casella 37 faccio 7 (dovrei andare a 44 ma è oltre le 40 casella)
            #  ==> mi sposto di 3 fino alla casella di vittoria	e poi torno indietro di 4
			
			if (self.newSpostamento == 0):
				self.newSpostamento = -((self.posizione + spostamento) - QTA_CASELLE_TOTALI)
				
			#Sposto la pedina sulla casella finale
			self.posiziona((QTA_CASELLE_TOTALI-self.posizione), False)

			#ferma un attimo il giocatore sulla casella finale
			time.sleep(0.2)
			
			#Ora ri-sposto indietro il giocatore di tot caselle
			self.posiziona(self.newSpostamento)
			
			#lo uso anche come una sorta di flag
			self.newSpostamento = 0
	
	
	def spostaPedina(self, partenza, spostamento):
		#cioè deve tornare alla prima casella.
		# Si muoverà in diagonale tra penultima casella e prima
		if(spostamento == -38):
			x1 = self.caselle[partenza-1].getCenterX()
			y1 = self.caselle[partenza-1].getCenterY()
			x2 = self.caselle[0].getCenterX()
			y2 = self.caselle[0].getCenterY()
			
			#(il 7 come ultimo parametro è per muovere la pedina più velocemente sulle x,
			# rispetto a 5 di default, sennò arriverebbe su una delle prime caselle e poi
			# si muoverebbe in orrizontale fino alla prima casella)
			self.spostaFraDueCaselle(x1, y1, x2, y2, 0, 7)
		else:
			#Se parte dalla casella iniziale (prima dell'inizio del percorso) deve muoversi da lì alla prima casella
			if(partenza == 0):
				x1 = self.casellaIniziale.getCenterX()
				y1 = self.casellaIniziale.getCenterY()
				
				x2 = self.caselle[0].getCenterX()
				y2 = self.caselle[0].getCenterY()
				
				self.spostaFraDueCaselle(x1, y1, x2, y2, 0)
				
				#Ora si muoverà dalla prima casella a quella in cui deve arrivare
				# (spostamento-1 xkè uno spostamento l'ha appena fatto)
				self.spostaPedina(1, spostamento - 1)
			else:
				#Ora muovo la pedina dello spostamento da fare.
				# NON muovo la pedina dalla partenza alla fine DIRETTAMENTE,
				# MA muovo di CASELLA IN CASELLA, per ogni casella che
				# deve superare
				
				if(spostamento > 0):
					
					#partenza è la posizione della casella da 1 a 40,
					# ma la lista di caselle è 0-based per questo "partenza-1"
					i = 0
					while(i < spostamento and self.crazyGoose.giocoPartito):
						casellaCorrente = partenza - 1 + i
						
						x1 = self.caselle[casellaCorrente].getCenterX()
						y1 = self.caselle[casellaCorrente].getCenterY()
						
						#prendo la casella successiva
						x2 = self.caselle[casellaCorrente + 1].getCenterX()
						y2 = self.caselle[casellaCorrente + 1].getCenterY()
						
						self.spostaFraDueCaselle(x1, y1, x2, y2, (casellaCorrente + 1))
						
						i += 1
				else:
					#Lo spostamento è negativo... devo prendere le caselle in modo inverso !
					
					#Lo trasformo in positivo, sennò "i" sarebbe maggiore di "spostamento"
					spostamento = -spostamento
					
					i = 0
					while (i < spostamento and self.crazyGoose.giocoPartito):
						casellaCorrente = partenza - 1 - i
						
						x1 = self.caselle[casellaCorrente].getCenterX()
						y1 = self.caselle[casellaCorrente].getCenterY()
						
						x2 = self.caselle[casellaCorrente - 1].getCenterX()
						y2 = self.caselle[casellaCorrente - 1].getCenterY()
						
						self.spostaFraDueCaselle(x1, y1, x2, y2, (casellaCorrente - 1))
						
						i += 1
			
	
	def spostaFraDueCaselle(self, x1, y1, x2, y2, posCasellaFinale, mov_x=5, mov_y=5):
		partenza_x = x1
		partenza_y = y1
		fine_x = x2
		fine_y = y2
		
		imgPedina = self.cambiaVersoPedina(x1, x2, posCasellaFinale)
		
		continua = True
		while(continua and self.crazyGoose.giocoPartito):
			# metto un minuscolo fermo, altrimenti sarebbe troppo veloce
			pygame.time.wait(14)
			# Non disegnerà il giocatore che si sta muovendo (lo disegna fra poco questo metodo)
			self.crazyGoose.disegnaTutto(self.tag)
			
			if(partenza_x < fine_x):
				partenza_x += mov_x
			elif(partenza_x > fine_x):
				partenza_x -= mov_x
			
			#Controllo se è già arrivato alla fine (pixel in più pixel in meno... lo spostamento con questi
			# pixel non è precisissimo)
			if(partenza_x >= fine_x-5 and partenza_x <= fine_x+5):
				partenza_x = fine_x
			
			if(partenza_y > fine_y):
				partenza_y -= mov_y
			elif(partenza_y < fine_y):
				partenza_y += mov_y
			
			#Controllo se è già arrivato alla fine (pixel in più pixel in meno... lo spostamento con questi
			# pixel non è precisissimo)
			if(partenza_y >= fine_y-5 and partenza_y <= fine_y+5):
				partenza_y = fine_y
			
			
			if (partenza_x == fine_x and partenza_y == fine_y):
				# fermo il loop
				continua = False
				self.game.display.blit(imgPedina,
									   (fine_x - WIDTH_PEDINA / 2,
										fine_y - HEIGHT_PEDINA / 2))
			else:
				self.game.display.blit(imgPedina,
									   (partenza_x - WIDTH_PEDINA / 2,
										partenza_y - HEIGHT_PEDINA / 2))
						
						
			#"disegno veramente" tutto
			self.crazyGoose.blit_screen()
			
	
	def cambiaVersoPedina(self, x_partenza, x_fine, posCasellaFinale):
		#Sceglie in base alla casella in cui deve andare la pedina, se quest'ultima
		# sarà girata (avrà la testa) verso dx oppure sx

		if(7 <= posCasellaFinale <= 12 or 27 <= posCasellaFinale <= 30):
			image = self.imgPedinaDxSx
		elif (18 <= posCasellaFinale <= 22 or 34 <= posCasellaFinale <= 36):
			image = self.imgPedinaSxDx
		else:
			if(x_partenza > x_fine):
				image = self.imgPedinaDxSx
			else:
				image = self.imgPedinaSxDx

		return image
		
	
	def mostraPedina(self):
		if(self.posizione > 0):
			x = self.caselle[self.posizione-1].getCenterX()
			y = self.caselle[self.posizione-1].getCenterY()

			image = self.cambiaVersoPedina(self.caselle[self.posizione - 1].getCenterX(),
										   self.caselle[self.posizione].getCenterX(),
										   self.posizione - 1)

			if(self.tag == "PL1"):
				posAvversario = self.crazyGoose.com.posizione
				flagMovimentoAvversario = self.crazyGoose.com.isMoving
			else:
				posAvversario = self.crazyGoose.player.posizione
				flagMovimentoAvversario = self.crazyGoose.player.isMoving

			if (self.posizione == posAvversario and flagMovimentoAvversario == False):
				if(self.posizione > 2):
					#si attiverà l'abilita del COM. Con questo if capisco se il giocatore
					# è arrivato da dx o da sx
					if(image == self.imgPedinaSxDx):
						image = self.imgScontroEffSxDx
					else:
						image = self.imgScontroEffDxSx
				else:
					# NON si attiverà l'abilita del COM, ma devo cmq far vedere che sono sulla stessa casella.
					# Con questo if capisco se il giocatore è arrivato da dx o da sx
					if (image == self.imgPedinaSxDx):
						image = self.imgScontroNoEffDxSx
					else:
						image = self.imgScontroNoEffDxSx

			
			self.game.display.blit(image,
								   (x - WIDTH_PEDINA / 2,
									y - HEIGHT_PEDINA / 2))
		else:
			#posizione "prima" del percorso quindi mostro la pedina prima del percorso
			self.creaCasellaIniziale()
			

	def avanza(self, spostamento, controllaCodCasella=True):
		if(self.crazyGoose.giocoPartito):
			
			#Di default appena si muove, il giocatore ha finito il turno e quindi setto
			#subito turnoMio = False, tuttavia potrebbe essere risettato a True se il
			# giocatore finisce sulla casella TIRA_DI_NUOVO
			self.turnoMio = False
			
			#il flag tornerà a False solo quando l'animazione sarà finita
			self.isMoving = True
			self.posiziona(spostamento, controllaCodCasella)
			self.isMoving = False
			
			#Quand'è che controllaCodCasella è False ? Quando il COM attiva la sua abilita.
			# Quindi quando il COM attiva la sua abilita il PL1 non potra attivare la sua abilita
			if(controllaCodCasella):
				if(self.abilitaAttivata == False and self.vincitore == False):
					if(self.pedinaScelta == "verde"
							#Controllo che non sia finito su un "Tira di nuovo" o "Stai fermo x giro"
							and self.turnoMio == False and self.turniFermo == 0 and
							# e che non ci sia finito neanche l'avversario
							self.crazyGoose.com.turniFermo == 0):
						
						#Farò 20 giri, ogni 100millisecondi ==> 2 secondi di tempo do
						# all'utente per usare l'abilità
						numGiri = 0
						# (controllo anche che il gioco non sia stato fermato)
						while (numGiri < 20 and self.crazyGoose.giocoPartito):
							self.attendoAbilita = True
							self.crazyGoose.buttonAbilitaPL1.evidenziaTempoRimanente((2000 - numGiri * 100), True)
							
							if (self.abilitaAttivata):
								#fermo il loop
								numGiri = 20
							else:
								numGiri += 1
								pygame.time.wait(100)
						
						# (in CrazyGoose.disegna() non disegna il button per l'abilita se
						# vede attendoAbilita a True, questo xke se è a True vuol dire che
						# è nel while qui sopra e qui sta fancedo evidenziaTempoRimandente
						# che andrà a disegnare il button dell'abilita)
						self.attendoAbilita = False
						
						if (self.abilitaAttivata):
							# Ormai ha attivato l'abilità perciò non la può più usare
							self.crazyGoose.buttonAbilitaPL1.cancellaButtonAbilita()
							#oca verde ==> ritira il dado; mi basta settare un flag
							self.turnoMio = True

					elif(self.pedinaScelta == "blu"
							and self.turnoMio == False and self.turniFermo == 0):
						
						numGiri = 0
						while (numGiri < 20 and self.crazyGoose.giocoPartito):
							self.attendoAbilita = True
							self.crazyGoose.buttonAbilitaPL1.evidenziaTempoRimanente((2000 - numGiri * 100), True)
							
							if (self.abilitaAttivata):
								numGiri = 20
							else:
								numGiri += 1
								pygame.time.wait(100)
						
						self.attendoAbilita = False

						if (self.abilitaAttivata):
							self.crazyGoose.buttonAbilitaPL1.cancellaButtonAbilita()
							self.avanza(2)

		#Ritorna indietro il flag, in questo modo si saprà a chi toccherà
		return self.turnoMio

	
	
	def controllaCodiceCasella(self, codCasella):
		attivatoAbilita = False
		if (self.abilitaAttivata == False and self.pedinaScelta == "rossa" and codCasella != VITTORIA):
			#Farò 20 giri, ogni 100millisecondi ==> 2 secondi di tempo do
			# all'utente per usare l'abilità
			numGiri = 0
			# (controllo anche che il gioco non sia stato fermato)
			while (numGiri < 20 and self.crazyGoose.giocoPartito):
				self.attendoAbilita = True
				self.crazyGoose.buttonAbilitaPL1.evidenziaTempoRimanente((2000 - numGiri * 100), True)
				
				if (self.abilitaAttivata):
					attivatoAbilita = True
					#fermo il loop
					numGiri = 20
				else:
					numGiri += 1
					pygame.time.wait(100)
			
			# (in CrazyGoose.disegna() non disegna il button per l'abilita se
			# vede attendoAbilita a True, questo xke se è a True vuol dire che
			# è nel while qui sopra e qui sta fancedo evidenziaTempoRimandente
			# che andrà a disegnare il button dell'abilita)
			self.attendoAbilita = False
			
			if (self.abilitaAttivata):
				# Ormai ha attivato l'abilità perciò non la può più usare
				self.crazyGoose.buttonAbilitaPL1.cancellaButtonAbilita()
		
		elif(codCasella == VITTORIA):
			self.vincitore = True
		


		#Se non ha attivato l'abilita (ocaRossa) allora subirà l'effetto della casella,
		# altrimenti semplicemente finisce il turno
		if(attivatoAbilita == False):
			"""
			In questo metodo controllo l'effetto della casella su cui è capitato
			 il giocatore. Setto lo spostamento a 0 xkè l'effetto potrebbe lasciare lì
			 dov'è il giocatore (come il fermo e il tira_di_nuovo), se invece lo
			 spostamento cambia (!= 0) vorrà dire che è capitato
			 su una casella che fa muovere il giocatore ==> richiamo di nuovo il "self.posiziona()"
			"""
			
			spostamento = 0
			msg = ""
			color = ""
	
			if(codCasella == TIRA_DI_NUOVO[0]):
				msg = "TIRA ANCORA IL DADO"
				color = BG_COLOR_X2
				self.turnoMio = True
				
	
			elif(codCasella == INDIETRO_DI_UNO[0]):
				msg = "INDIETRO DI UNA CASELLA"
				color = BG_COLOR_MENO1
				spostamento = -1
				
	
			elif(codCasella == INDIETRO_DI_TRE[0]):
				msg = "INDIETRO DI TRE CASELLE"
				color = BG_COLOR_MENO3
				spostamento = -3
				
	
			elif(codCasella == AVANTI_DI_UNO[0]):
				msg = "AVANTI DI UNA CASELLA"
				color = BG_COLOR_PIU1
				spostamento = 1
				
	
			elif(codCasella == AVANTI_DI_QUATTRO[0]):
				msg = "AVANTI DI QUATTRO CASELLE"
				color = BG_COLOR_PIU4
				spostamento = 4
				
	
			elif(codCasella == FERMO_DA_UNO[0]):
				msg = "FERMO PER UN GIRO"
				color = BG_COLOR_FERMO1
				self.turniFermo = 1
				
	
			elif(codCasella == FERMO_DA_DUE[0]):
				msg = "FERMO PER DUE GIRI"
				color = BG_COLOR_FERMO2
				self.turniFermo = 2
				
	
			elif(codCasella == TORNA_ALL_INIZIO[0]):
				msg = "RICOMINCIA DA CAPO !!!"
				color = BG_COLOR_DACAPO
				#Lo fa ritornare alla 1° casella
				#Dalla posizione == 39 va alla 1° ==> si muove di 38 posizioni indietro
				spostamento = -(self.posizione-1)
				
				
			elif(codCasella == VITTORIA[0]):
				self.vincitore = True
	
			if(msg != ""):
				self.penultimoMsg[0] = self.ultimoMsg[0]
				self.penultimoMsg[1] = self.ultimoMsg[1]
				self.ultimoMsg[0] = msg
				self.ultimoMsg[1] = color
				
				#mostrerà i msg
				self.crazyGoose.disegnaTutto()
	
			if(spostamento != 0):
				
				if(self.abilitaAttivata == False):
					if(self.pedinaScelta == "gialla" and spostamento == 1):
						#Farò 20 giri, ogni 100millisecondi ==> 2 secondi di tempo do
						# all'utente per usare l'abilità
						numGiri = 0
						#(controllo anche che il gioco non sia stato fermato)
						while(numGiri < 20 and self.crazyGoose.giocoPartito):
							self.attendoAbilita = True
							self.crazyGoose.buttonAbilitaPL1.evidenziaTempoRimanente((2000-numGiri*100), True)
							
							if(self.abilitaAttivata):
								#aumenta lo spostamento a 3
								spostamento = 3
								#ferma il loop
								numGiri = 20
							else:
								numGiri += 1
								pygame.time.wait(100)
						
						#(in CrazyGoose.disegna() non disegna il button per l'abilita se
						# vede attendoAbilita a True, questo xke se è a True vuol dire che
						# è nel while qui sopra e qui sta fancedo evidenziaTempoRimandente
						# che andrà a disegnare il button dell'abilita)
						self.attendoAbilita = False
						
						if(self.abilitaAttivata):
							#Ormai ha attivato l'abilità perciò non la può più usare
							self.crazyGoose.buttonAbilitaPL1.cancellaButtonAbilita()
				
				
				#attende un attimino sulla casella
				pygame.time.wait(500)
				#ri-sposta la pedina
				self.posiziona(spostamento)