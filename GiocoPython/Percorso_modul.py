import random

QTA_CASELLE_TOTALI = 40
	#caselle con effetto randomico (NON include l'ultima e la penultima casella che sono SEMPRE UGUALI)
QTA_CASELLE_DINAMICHE = 22

#Per ogni effetto c'è un array con tre elementi: il codice identificativo,
# il totale di volte in cui deve apparire e il nome che compare nella casella
TIRA_DI_NUOVO = [0, 4, "X2"]
INDIETRO_DI_UNO = [1, 4, "-1"]
INDIETRO_DI_TRE = [2, 2, "-3"]
AVANTI_DI_UNO = [3, 4, "+1"]
AVANTI_DI_QUATTRO = [4, 2, "+4"]
FERMO_DA_UNO = [5, 4, "ALT"]
FERMO_DA_DUE = [6, 2, "ALT X2"]
	
	#compaiono una sola volta, non serve il secondo elemento
TORNA_ALL_INIZIO = [7, "DA CAPO !"]
VITTORIA = [8, "VITTORIA !!!"]

class Percorso():
	def __init__(self):
		random.seed()

		"""Dizionario che avrà come chiave la posizione (la casella) e come valore
		 il codice dell'effetto
		NON CI SONO TUTTE LE POSIZIONI, solo quelle che mi servono, cioè SOLO QUELLE
		 CHE HANNO UN EFFETTO (tutte quelle che non ci sono sono vuote semplicemente)
		"""
		self.dictCaselle = dict()
			
		"""Cicla finchè non sono stati "piazzati" tutti gli effetti. Ad ogni giro tira a sorte
		 	una posizione casuale, e se non è ancora mai stata sorteggiata, tira a sorte un codice
			(il codice dell'effetto), e se il codice è valido, aggiunge nel dizionario un elemento
			con chiave la posizione N della casella e come valore il codice uscito.

			Il codice sorteggiato può non essere valido per due motivi:
				1 - quel determinato effetto è stato già piazzato il massimo di volte
				2 - quel determinato effetto causa UN LOOP INFINITO. Dato che gli effetti
				 vengono applicati anche quando si finisce su uno di essi a causa di un altro
				 effetto potrebbero crearsi LOOP infiniti. Un ESEMPIO BANALE:
				 	sulla casella 5 c'è "Avanti di 1" e sulla casella 6 c'è "Indietro di 1"
					 	==> la pedina continuerà ad andare avanti di 1 e tornare indietro di 1
		"""

		flagTuttiEffettiSettati = False
		while(not flagTuttiEffettiSettati):
			flagPosizioneNonValida = True
			while(flagPosizioneNonValida):
					#ESCLUDO le ultime 2 pos che sono COSTANTI e la PRIMA, la lascio vuota
					# (lascio vuota dato che vi è un effetto che riporta il giocatore sulla
					# 1° casella)
				randomPos = random.randint(2, (QTA_CASELLE_TOTALI-2))
				if(randomPos not in self.dictCaselle.keys()):
					flagPosizioneNonValida = False
			
			if(self.contaEffettiSettati() == QTA_CASELLE_DINAMICHE):
				flagTuttiEffettiSettati = True
			else:
				flagEffettoNonValido = True
				randomCodCasella = random.randint(0,6)
				
				if(randomCodCasella == TIRA_DI_NUOVO[0]):
					if(self.contaEffettiSettati(TIRA_DI_NUOVO[0]) < TIRA_DI_NUOVO[1] ):
						flagEffettoNonValido = False
							
				elif(randomCodCasella == INDIETRO_DI_UNO[0]):
					if(self.contaEffettiSettati(INDIETRO_DI_UNO[0]) < INDIETRO_DI_UNO[1] ):
						if(randomPos > 1):
							flagEffettoNonValido = False

				elif(randomCodCasella == INDIETRO_DI_TRE[0]):
					if(self.contaEffettiSettati(INDIETRO_DI_TRE[0]) < INDIETRO_DI_TRE[1] ):
						if(randomPos > 3):
							flagEffettoNonValido = False

				elif(randomCodCasella == AVANTI_DI_UNO[0]):
					if(self.contaEffettiSettati(AVANTI_DI_UNO[0]) < AVANTI_DI_UNO[1] ):
						flagEffettoNonValido = False
				
				elif(randomCodCasella == AVANTI_DI_QUATTRO[0]):
					if(self.contaEffettiSettati(AVANTI_DI_QUATTRO[0]) < AVANTI_DI_QUATTRO[1] ):
							#intanto QTA_CASELLE_TOTALI -1 NON PUÒ ESSERE (es.su 40 caselle NON DEVE ESSSERE la 38°)
						if( randomPos < QTA_CASELLE_TOTALI-2 ):
							flagEffettoNonValido = False
					
				elif(randomCodCasella == FERMO_DA_UNO[0]):
					if(self.contaEffettiSettati(FERMO_DA_UNO[0]) < FERMO_DA_UNO[1] ):
						flagEffettoNonValido = False
					
				elif(randomCodCasella == FERMO_DA_DUE[0]):
					if(self.contaEffettiSettati(FERMO_DA_DUE[0]) < FERMO_DA_DUE[1] ):
						flagEffettoNonValido = False
			
			
				if(flagEffettoNonValido == False):
					self.dictCaselle[randomPos] = randomCodCasella
		
		self.controllaPossibiliLoop()
		self.controllaQtaCaselleVicino()
		
		self.dictCaselle[QTA_CASELLE_TOTALI-1] = TORNA_ALL_INIZIO[0]
		self.dictCaselle[QTA_CASELLE_TOTALI] = VITTORIA[0]
	
	
	def trovaNuovaPosPerCasella(self, codCasella, oldPos):
		#Estrae una nuova posizione. Se in quella posizione non c'è nessun'altro effetto allora va bene, sennò tira di 

		newPos = oldPos
		while (newPos in self.dictCaselle.keys() or newPos == oldPos):
			if(codCasella == AVANTI_DI_QUATTRO[0]):
				#se ci fosse un +4 in posizione 38 si creerebbe un loop
				newPos = random.randint(2, (QTA_CASELLE_TOTALI - 3))
			elif(codCasella == INDIETRO_DI_TRE[0]):
				#se ci fosse un -3 in posizione 1/2/3 "uscirebbe" dal percorso
				newPos = random.randint(4, (QTA_CASELLE_TOTALI - 2))
			else:
				newPos = random.randint(2, (QTA_CASELLE_TOTALI - 2))
				
		self.dictCaselle[newPos] = codCasella
	

	def controllaQtaCaselleVicino(self):
		#In questo metodo vado a "spezzare" le catene di caselle con effetti.
		#Se c'è una catena di 4 caselle con effetti allora prende 1 di quei
		# effetti e lo sposta da un altra parte
		caselleVicino = True
		while(caselleVicino):
			caselleVicino = False
			
			for i in range(0, QTA_CASELLE_TOTALI-1):
				if(i != 0):
					if(self.controllaSeCasellaNonEVuota((i, i+1, i+2, i+3))):
						casDaTogliere = random.randint(0, 3)
						codCasellaDaTogliere = self.dictCaselle[i+casDaTogliere]

						self.dictCaselle.pop(i+casDaTogliere)
						self.trovaNuovaPosPerCasella(codCasellaDaTogliere, (i+casDaTogliere))
						
						self.controllaPossibiliLoop()
						
						caselleVicino = True
						i = QTA_CASELLE_TOTALI


	def controllaPossibiliLoop(self):
		loopTrovato = True
		while(loopTrovato):
			loopTrovato = False
			
			for (pos, codCasella) in self.dictCaselle.items():
				loopTrovato = self.possibileLoop(pos, codCasella)
				if(loopTrovato):
					#Ferma xke deve ricominciare da capo (per corregere un loop che potrebbe
					# essersi creato)
					break
				else:
					loopTrovato = self.controllaLoopSfigato(pos)
					if (loopTrovato):
						#Ferma xke deve ricominciare da capo (per corregere un loop che potrebbe
						# essersi creato)
						break
	
	
	def controllaLoopSfigato(self, pos):
		#Effetti caselle: +4  +1  +1  -3  -1  -1
		
		loop = False
		if(self.controllaSeCasellaNonEVuota((pos-1, pos-2, pos+1, pos+2, pos+3, pos+4))):
			if(self.dictCaselle[pos] == AVANTI_DI_QUATTRO[0]
				and self.dictCaselle[pos-1] == AVANTI_DI_UNO[0]
				and self.dictCaselle[pos-2] == AVANTI_DI_UNO[0]
				and self.dictCaselle[pos+1] == INDIETRO_DI_TRE[0]
				and self.dictCaselle[pos+2] == INDIETRO_DI_UNO[0]
				and self.dictCaselle[pos+3] == INDIETRO_DI_UNO[0]
				and self.dictCaselle[pos+4] == INDIETRO_DI_UNO[0]):

				self.dictCaselle.pop(pos)
				self.dictCaselle.pop(pos-1)
				self.dictCaselle.pop(pos-2)
				self.dictCaselle.pop(pos+1)
				self.dictCaselle.pop(pos+2)
				self.dictCaselle.pop(pos+3)
				self.dictCaselle.pop(pos+4)

				self.trovaNuovaPosPerCasella(AVANTI_DI_QUATTRO[0], pos)
				self.trovaNuovaPosPerCasella(AVANTI_DI_UNO[0], (pos-1))
				self.trovaNuovaPosPerCasella(AVANTI_DI_UNO[0], (pos-2))
				self.trovaNuovaPosPerCasella(INDIETRO_DI_TRE[0], (pos+1))
				self.trovaNuovaPosPerCasella(INDIETRO_DI_UNO[0], (pos+2))
				self.trovaNuovaPosPerCasella(INDIETRO_DI_UNO[0], (pos+3))
				self.trovaNuovaPosPerCasella(INDIETRO_DI_UNO[0], (pos+4))
				
				loop = True

		return loop


	def possibileLoop(self, pos, codCasella):
		loop = False
		if(codCasella == AVANTI_DI_QUATTRO[0]):
			
			if(self.controllaSeCasellaNonEVuota((pos+1, pos+4)) and
					self.dictCaselle[pos+1] == INDIETRO_DI_UNO[0]
					and self.dictCaselle[pos+4] == INDIETRO_DI_TRE[0]):
				
				#+4  -1  x  x  -3
				# inverto casella +4 con -1
				#-1  +4  x  x  -3
				
				self.dictCaselle[pos] = INDIETRO_DI_UNO[0]
				self.dictCaselle[pos + 1] = AVANTI_DI_QUATTRO[0]
				loop = True
			
			elif(self.controllaSeCasellaNonEVuota((pos-1, pos+1, pos+3, pos+4))
					and self.dictCaselle[pos-1] == AVANTI_DI_UNO[0]
					and self.dictCaselle[pos+3] == INDIETRO_DI_TRE[0]
					and self.dictCaselle[pos+4] == INDIETRO_DI_UNO[0]):
			
				#+1  +4  x  x  -3  -1
				# inverto casella +4 con -3
				#+1  -3  x  x  +4  -1
				
				self.dictCaselle[pos] = INDIETRO_DI_TRE[0]
				self.dictCaselle[pos+3] = AVANTI_DI_QUATTRO[0]
				loop = True
			
			elif(self.controllaSeCasellaNonEVuota((pos+3, pos+4)) and
					self.dictCaselle[pos+3] == INDIETRO_DI_TRE[0]
				and self.dictCaselle[pos+4] == INDIETRO_DI_UNO[0]):
				
				#+4  x  x  -3  -1
				# inverto casella +4 con -1
				#-1  x  x  -3  +4
				
				self.dictCaselle[pos] = INDIETRO_DI_UNO[0]
				self.dictCaselle[pos + 4] = AVANTI_DI_QUATTRO[0]
				loop = True
			
			elif(self.controllaSeCasellaNonEVuota((pos+3, pos+4))
				and (self.dictCaselle.get(pos+3) == AVANTI_DI_UNO[0])
				and (self.dictCaselle.get(pos+4) == INDIETRO_DI_TRE[0]) ):

				#+4  x  x  +1  -3
				#inverto casella +4 con +1
				#+1  x  x  +4  -3

				self.dictCaselle[pos] = AVANTI_DI_UNO[0]
				self.dictCaselle[pos+3] = AVANTI_DI_QUATTRO[0]
				loop = True
			
			
		elif(codCasella == AVANTI_DI_UNO[0]):
			
			if(self.controllaSeCasellaNonEVuota((pos+1,)) and
					self.dictCaselle[pos+1] == INDIETRO_DI_UNO[0]):
				
				#+1  -1
				# inverto casella +1 con -1
				#-1  +1
				
				self.dictCaselle[pos] = INDIETRO_DI_UNO[0]
				self.dictCaselle[pos + 1] = AVANTI_DI_UNO[0]
				loop = True
				
			elif(self.controllaSeCasellaNonEVuota((pos+1, pos+2, pos+3)) and
					self.dictCaselle[pos+1] == AVANTI_DI_UNO[0]
				and self.dictCaselle[pos+2] == AVANTI_DI_UNO[0]
				and self.dictCaselle[pos+3] == INDIETRO_DI_TRE[0]):
				
				#+1  +1  +1  -3
				
				if(pos > 3):
					# inverto casella primo +1 con -3
					#-3  +1  +1  +1
					
					self.dictCaselle[pos] = INDIETRO_DI_TRE[0]
					self.dictCaselle[pos + 3] = AVANTI_DI_UNO[0]
				else:
					#se invertissi finirebbe un -3 nelle prime caselle,
					# e se ci si finisse sopra si dovrebbe "andare fuori dal percorso"
					# quindi metto il -3 in una posizione casuale (in cui non ce nulla)
					#+1  +1  +1  x

					self.dictCaselle.pop(pos+3)
					self.trovaNuovaPosPerCasella(INDIETRO_DI_TRE[0])
				
				loop = True

		return loop
	
	
	def controllaSeCasellaNonEVuota(self, caselleDaControllare):
		#Se nell'if di controllo del loop provasse a prendere una casella non presente nel dizionario
		# lancerebbe una eccezione. Io potrei mettere un grande try except che CONTIENE tutti gli if
		# ma in questo modo "bloccherei" la possibilita' di andare negli if successivi
		
		for casella in caselleDaControllare:
			try:
				x = self.dictCaselle[casella]
			except KeyError:
				return False

		return True
		


	def contaEffettiSettati(self, codEffetto=-1):
		#Prende i valori del dizionario e usa il metodo ".count" delle liste
		# per contare le occorenze di un certo valore

		tot = 0
		if(codEffetto == -1):
			tot += list(self.dictCaselle.values()).count(TIRA_DI_NUOVO[0])
			tot += list(self.dictCaselle.values()).count(INDIETRO_DI_UNO[0])
			tot += list(self.dictCaselle.values()).count(INDIETRO_DI_TRE[0])
			tot += list(self.dictCaselle.values()).count(AVANTI_DI_UNO[0])
			tot += list(self.dictCaselle.values()).count(AVANTI_DI_QUATTRO[0])
			tot += list(self.dictCaselle.values()).count(FERMO_DA_UNO[0])
			tot += list(self.dictCaselle.values()).count(FERMO_DA_DUE[0])
		else:
			tot = list(self.dictCaselle.values()).count(codEffetto)
		
		return tot
