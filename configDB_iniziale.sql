--https://www.strongdm.com/blog/mysql-create-user-manage-access-privileges-how-to

CREATE DATABASE IF NOT EXISTS CrazyGoose;
USE CrazyGoose;

CREATE TABLE IF NOT EXISTS Utenti (
    nome VARCHAR(25) NOT NULL,
    cognome VARCHAR(30) NOT NULL,
    email VARCHAR(40) PRIMARY KEY NOT NULL,
    password VARCHAR(64) NOT NULL
);

CREATE TABLE IF NOT EXISTS Profili (
    username VARCHAR(20) PRIMARY KEY NOT NULL,
    grado VARCHAR(15) NOT NULL,
    partiteVinte INT NOT NULL,
    partitePerse INT NOT NULL,
    emailUtente VARCHAR(40) NOT NULL,
    FOREIGN KEY(emailUtente) REFERENCES Utenti(email)
);

CREATE TABLE IF NOT EXISTS Partite (
    ID_part INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    durata INT NOT NULL
);

CREATE TABLE IF NOT EXISTS Partecipare (
    ID_partita INT NOT NULL,
    username VARCHAR(20) NOT NULL,
    flagVittoria BOOLEAN NOT NULL,
    numMosse INT NOT NULL,
    PRIMARY KEY(ID_partita, username),
    FOREIGN KEY(ID_partita) REFERENCES Partite(ID_part),
    FOREIGN KEY(username) REFERENCES Profili(username)
);



CREATE USER 'Giocatore'@'%' IDENTIFIED BY '1gioc!CrazyGoose?';

GRANT SELECT, INSERT, UPDATE ON CrazyGoose.Utenti TO 'Giocatore'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON CrazyGoose.Profili TO 'Giocatore'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON CrazyGoose.Partite TO 'Giocatore'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON CrazyGoose.Partecipare TO 'Giocatore'@'%';

--REVOKE DELETE ON CrazyGoose.Utenti FROM 'Giocatore'@'%';
