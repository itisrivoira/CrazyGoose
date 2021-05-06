<?php
	function stampaErrore($mysqli, $dove){
		echo "ERRORE $dove: ".$mysqli->error." (".$mysqli->errno.")";
	}
	
	function cambiaPagina($IP){
		//per es. l'utente va nella pagina di login, viene reindirizzato qui, eventualemente crea
		// il DB poi torna indietro
		$endpoint = $_GET["prox"];
			
		$changePage = "Location: http://".$IP.":3000/$endpoint";
		header($changePage);
	}
	
	
	//Mi serve l'IP del server. Questo lo leggo solo nel nodejs all'inizio e non riesco a passarlo
	// a tutte le pagine... lo scrivo su un file e quando ne ho bisogno lo leggo
	$IP = file("../../indirizzo_server.txt")[0];

	//Tento di connettermi al DB CrazyGoose
	$mysqli = new mysqli("localhost", "root", "", "CrazyGoose");
	if($mysqli->connect_error){
		if($mysqli->connect_errno == 1049){		// ==> "Unknown database 'CrazyGoose'"
			//ricreo l'oggetto mysqli (xke non posso usare quello di prima dove
			// ho tentato di connettermi ad un DB inesistente)
			$mysqli = new mysqli("localhost", "root", "");

			$flagErrore = false;

			//Creo il DB. Se la query mi ritorna false = c'e' stato un errore		
			if(!$mysqli->query("CREATE DATABASE CrazyGoose;")){
				stampaErrore($mysqli, "CREAZIONE DB");
				$flagErrore = true;
			}else{
				//come potrebbe darmi errore? Se il DB non esiste... ma l'ho appena creato
				// quindi non controllo neanche che questa query mi dia errore
				$mysqli->query("USE CrazyGoose;");
				
				//creo tutte le varie tabelle
				
				if(!$mysqli->query("CREATE TABLE IF NOT EXISTS Utenti (
										ID_gioc INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
										nome VARCHAR(25) NOT NULL,
										cognome VARCHAR(30) NOT NULL,
										email VARCHAR(40) NOT NULL,
										password VARCHAR(64) NOT NULL
									);")){
		
					stampaErrore($mysqli, "CREAZIONE TAB Utenti");
					$flagErrore = true;
				}else{
					if(!$mysqli->query("CREATE TABLE IF NOT EXISTS Profili (
											username VARCHAR(20) PRIMARY KEY NOT NULL,
											grado VARCHAR(15) NOT NULL,
											partiteVinte INT NOT NULL,
											partitePerse INT NOT NULL,
											ID_giocatore INT NOT NULL,
											FOREIGN KEY(ID_giocatore) REFERENCES Utenti(ID_gioc)
										);")){
		
						stampaErrore($mysqli, "CREAZIONE TAB Profili");
						$flagErrore = true;
					}else{
						if(!$mysqli->query("CREATE TABLE IF NOT EXISTS Partite (
												ID_part INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
												durata INT NOT NULL
											);")){
							
							stampaErrore($mysqli, "CREAZIONE TAB Partite");
							$flagErrore = true;
						}else{
							if(!$mysqli->query("CREATE TABLE IF NOT EXISTS Partecipare (
													ID_partita INT NOT NULL,
													username VARCHAR(20) NOT NULL,
													flagVittoria BOOLEAN NOT NULL,
													numMosse INT NOT NULL,
													PRIMARY KEY(ID_partita, username),
													FOREIGN KEY(ID_partita) REFERENCES Partite(ID_part),
													FOREIGN KEY(username) REFERENCES Profili(username)
												);")){
								
								/* 					!!!!!!!!!!!!!!!!!!!!!
								In realtà SQL non ha il tipo BOOLEAN true false quindi "flagVittoria" sara'
								1-true o 0-false								
													!!!!!!!!!!!!!!!!!!!!!!! */
								
								stampaErrore($mysqli, "CREAZIONE TAB Partecipare");
								$flagErrore = true;
							}
						}
					}
				}
			}
		
			if(!$flagErrore){
				cambiaPagina($IP);
			}
		}else{
			die("Errore (".$mysqli->connect_errno.") nella CONNESSIONE: ".$mysqli->connect_error);
		}
	}else{
		//non mi ha dato errori connettermi al DB CrazyGoose, vuol dire che c'era gia'
		cambiaPagina($IP);
	}
?>
