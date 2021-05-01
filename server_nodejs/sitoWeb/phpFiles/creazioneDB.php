<?php
	$IP = file("../../indirizzo_server.txt")[0];

	$mysqli = new mysqli("localhost", "root", "", "CrazyGoose");
	if($mysqli->connect_error){
		//Unknown database 'CrazyGoose'
		//MI DA CMQ UN WARNING, PERÒ NON RIMANE SU QUESTA PAGINA QUINDI
		// L'UTENTE NON LO VEDE NEANCHE IL WARNING
		if($mysqli->connect_errno == 1049){
			//ricreo l'oggetto mysqli
			$mysqli = new mysqli("localhost", "root", "");

			//creo il DB
			$flagErrore = false;
		
			if(!$mysqli->query("CREATE DATABASE CrazyGoose;")){
				echo "ERRORE CREAZIONE DB: ".$mysqli->error;
				$flagErrore = true;
			}else{
				$mysqli->query("USE CrazyGoose;");
				
				if(!$mysqli->query("CREATE TABLE IF NOT EXISTS Utenti (
										ID_giocatore INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
										nome VARCHAR(25) NOT NULL,
										cognome VARCHAR(30) NOT NULL,
										email VARCHAR(40) NOT NULL,
										password VARCHAR(64) NOT NULL
									);")){
		
					echo "ERRORE CREAZIONE TABELLA UTENTI ".$mysqli->error;
					$flagErrore = true;
				}else{
					if(!$mysqli->query("CREATE TABLE IF NOT EXISTS Profili (
											username VARCHAR(20) PRIMARY KEY NOT NULL,
											grado VARCHAR(15) NOT NULL,
											partiteVinte INT NOT NULL,
											partitePerse INT NOT NULL,
											ID_giocatore INT NOT NULL,
											FOREIGN KEY(ID_giocatore) REFERENCES Utenti(ID_giocatore)
										);")){
		
						echo "ERRORE CREAZIONE TABELLA PROFILI ".$mysqli->error;
						$flagErrore = true;
					}else{
						if(!$mysqli->query("CREATE TABLE IF NOT EXISTS Partite (
												ID_partita INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
												durata INT NOT NULL
											);")){
							
							echo "ERRORE CREAZIONE TABELLA PARTITE ".$mysqli->error."---";
							$flagErrore = true;
						}else{
							if(!$mysqli->query("CREATE TABLE IF NOT EXISTS Partecipare (
													ID_partita INT NOT NULL,
													username VARCHAR(20) NOT NULL,
													flagVittoria BOOL NOT NULL,
													numMosse INT NOT NULL,
													PRIMARY KEY(ID_partita, username),
													FOREIGN KEY(ID_partita) REFERENCES Partite(ID_partita),
													FOREIGN KEY(username) REFERENCES Profili(username)
												);")){
								
								echo "ERRORE CREAZIONE TABELLA PARTECIPARE ".$mysqli->error;
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
			die("Errore(".$mysqli->connect_errno.")nella connessione: ".$mysqli->connect_error);
		}
	}else{
		cambiaPagina($IP);
	}

	function cambiaPagina($IP){
		$endpoint = $_GET["prox"];
		
		$changePage = "Location: http://".$IP.":3000/$endpoint";
		header($changePage);
	}
?>