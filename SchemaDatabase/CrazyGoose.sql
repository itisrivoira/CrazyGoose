CREATE DATABASE IF NOT EXISTS CrazyGoose;
USE CrazyGoose;

CREATE TABLE IF NOT EXISTS Utenti (
	ID_giocatore INT PRIMARY KEY NOT NULL,
	nome VARCHAR(25) NOT NULL,
	cognome VARCHAR(30) NOT NULL,
	email VARCHAR(40) NOT NULL,
	password VARCHAR(20) NOT NULL
);
--ID_giocatore semplice contatore (non lo sceglie l'utente reale)

CREATE TABLE IF NOT EXISTS Profili (
	username VARCHAR(20) PRIMARY KEY NOT NULL,
	grado VARCHAR(15) NOT NULL,
	partiteVinte INT NOT NULL,
	partitePerse INT NOT NULL,
	ID_giocatore INT NOT NULL,
	FOREIGN KEY(ID_giocatore) REFERENCES Utenti(ID_giocatore)
);
/*grado:
	-novellino
	-principiante
	-intermedio
	-esperto
	-maestro
*/

CREATE TABLE IF NOT EXISTS Partite (
	ID_partita INT PRIMARY KEY NOT NULL,
	durata INT NOT NULL
);
--ID_partita semplice contatore

CREATE TABLE IF NOT EXISTS Partecipare (
	ID_partita INT NOT NULL,
	username VARCHAR(20) NOT NULL,
	flagVittoria BOOL NOT NULL,
	numMosse INT NOT NULL,
	PRIMARY KEY(ID_partita, username),
	FOREIGN KEY(ID_partita) REFERENCES Partite(ID_partita),
	FOREIGN KEY(username) REFERENCES Profili(username)
);
