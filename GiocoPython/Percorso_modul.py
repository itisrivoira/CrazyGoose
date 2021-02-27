import random

QTA_CASELLE_TOTALI = 40
	#caselle con effetto randomico (NON include l'ultima e la penultima casella che sono SEMPRE UGUALI)
QTA_CASELLE_DINAMICHE = 22

#Per ogni effetto c'è un array con due elementi: il codice identificativo 
#	e il totale di volte in cui deve apparire
TIRA_DI_NUOVO = [0, 4]
INDIETRO_DI_UNO = [1, 4]
INDIETRO_DI_TRE = [2, 2]
AVANTI_DI_UNO = [3, 4]
AVANTI_DI_QUATTRO = [4, 2]
FERMO_DA_UNO = [5, 4]
FERMO_DA_DUE = [6, 2]
	#Caselle con degli "effetti" che compaiono solo una volta, quindi non serve array
TORNA_ALL_INIZIO = 7
VITTORIA = 8


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

		self.dictCaselle[QTA_CASELLE_TOTALI-1] = 7
		self.dictCaselle[QTA_CASELLE_TOTALI] = 8


	def controllaPossibiliLoop(self):
		"""	Non basta ciclare una volta per tutte le caselle (con quel for) xkè una "correzione"
		di un loop potrebbe generarne un altro """

		loopTrovato = True
		while(loopTrovato):
			loopTrovato = False
			for i in self.dictCaselle.keys():
				try:
					codCasella = self.dictCaselle.get(i)
					if(self.controllaLoop(codCasella, i)):
						loopTrovato = True
				except Exception:
					pass


	def controllaLoop(self, codCasella, posizione):
		loopTrovato = False

			#"not self.dictCaselle.get(posizione-1) == None" (non funzia se non lo metto)
		if(codCasella == INDIETRO_DI_TRE[0]):
			"""
			Esempio: casella 2 c'è "Avanti di 4" ==> il giocatore finirà sulla casella 6
						e su questa vi è "Indietro di 1" ==> il giocatore finirà sulla
						casella 5 e su questa vi è "Indietro di 3"
					IL GIOCATORE RITORNA SULLA CASELLA 2   ==>   LOOP
			"""
			if(not (self.dictCaselle.get(posizione+1) == None)
				and (self.dictCaselle.get(posizione+1) == INDIETRO_DI_UNO[0])
				and not (self.dictCaselle.get(posizione-3) == None)
				and (self.dictCaselle.get(posizione-3) == AVANTI_DI_QUATTRO[0]) ):

				self.dictCaselle[posizione-3] = INDIETRO_DI_TRE[0]
				self.dictCaselle[posizione] = AVANTI_DI_UNO[0]

				loopTrovato = True

		elif(codCasella == INDIETRO_DI_UNO[0]):
			if( not (self.dictCaselle.get(posizione-1) == None)
				and (self.dictCaselle.get(posizione-1) == AVANTI_DI_UNO[0]) ):

				self.dictCaselle[posizione-1] = INDIETRO_DI_UNO[0]
				self.dictCaselle[posizione] = AVANTI_DI_UNO[0]

				loopTrovato = True

			elif(not (self.dictCaselle.get(posizione-1) == None)
				and (self.dictCaselle.get(posizione-1) == AVANTI_DI_QUATTRO[0])
				and not (self.dictCaselle.get(posizione+3) == None)
				and (self.dictCaselle.get(posizione+3) == INDIETRO_DI_TRE[0]) ):

				"""
					Esempio: casella 4 c'è "Avanti di 4" ==> il giocatore finirà sulla
						casella 8 e su questa vi è "Indietro di 3" ==> il giocatore
						finirà sulla casella 5 che ha "Indietro di 1" ==>
					IL GIOCATORE RITORNA SULLA CASELLA 4   ==>   LOOP
				"""

				self.dictCaselle[posizione-1] = INDIETRO_DI_TRE[0]
				self.dictCaselle[posizione+3] = AVANTI_DI_QUATTRO[0]

				#in questo caso non devo ho da cambiare la casella "corrente", ma le altre:
				loopTrovato = True

		

		return loopTrovato


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