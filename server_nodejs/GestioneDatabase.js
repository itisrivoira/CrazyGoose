const mysql = require("mysql")
class GestioneDatabase {
    constructor() {
        this.conn = mysql.createConnection({
            hostname: "localhost",
            user: "root",
            passw: "",
            //database:"CrazyGoose"
            //la userò per creare il DB che magari ancora non esiste
        })

        this.resettaValori()
    }

    resettaValori() {
        //qui vengono salvati gli identificativi del Utente e del Profilo
        this.email = null
        this.username = null
            //Decido poi per velocità (li necessito spesso e l'unico modo per averli
            // sarebbe fare una query... porta via tempo) di salvarmi anche i nominativi dell'Utente
        this.nome = null
        this.cognome = null
    }

    controllaErrQuery(err) {
        //mi è utile questo metodo perchè non ho da fare ad ogni query
        // l'if != null per stampare il log

        if (err != null) {
            console.log(err)
            return false
        } else {
            return true
        }
    }

    creaDB() {
        this.conn.connect(() => {
            this.conn.query("CREATE DATABASE IF NOT EXISTS CrazyGoose;", (err, result) => {
                if (this.controllaErrQuery(err)) {

                    //------------creazione tabelle------------
                    let tabUtenti = "CREATE TABLE IF NOT EXISTS Utenti ( \
									email VARCHAR(40) NOT NULL PRIMARY KEY, \
									nome VARCHAR(25) NOT NULL, \
									cognome VARCHAR(30) NOT NULL, \
									password VARCHAR(64) NOT NULL );"

                    let tabProfili = "CREATE TABLE IF NOT EXISTS Profili ( \
									username VARCHAR(20) PRIMARY KEY NOT NULL, \
									grado VARCHAR(15) NOT NULL, \
									partiteVinte INT NOT NULL, \
									partitePerse INT NOT NULL, \
									email VARCHAR(40) NOT NULL, \
									FOREIGN KEY(email) REFERENCES Utenti(email) );"

                    let tabPartite = "CREATE TABLE IF NOT EXISTS Partite ( \
									ID_part INT PRIMARY KEY AUTO_INCREMENT NOT NULL, \
									durata INT NOT NULL );"

                    let tabPartecipare = "CREATE TABLE IF NOT EXISTS Partecipare ( \
										ID_partita INT NOT NULL, \
										username VARCHAR(20) NOT NULL, \
										flagVittoria BOOLEAN NOT NULL, \
										numMosse INT NOT NULL, \
										PRIMARY KEY(ID_partita, username), \
										FOREIGN KEY(ID_partita) REFERENCES Partite(ID_part), \
										FOREIGN KEY(username) REFERENCES Profili(username) );"

                    this.conn.query("USE CrazyGoose;", (e, r) => {

                        this.conn.query(tabUtenti, (errUt, resultUt) => {
                            if (this.controllaErrQuery(errUt)) {

                                this.conn.query(tabProfili, (errPro, resultPro) => {
                                    if (this.controllaErrQuery(errPro)) {

                                        this.conn.query(tabPartite, (errPart, resultPart) => {
                                            if (this.controllaErrQuery(errPart)) {

                                                this.conn.query(tabPartecipare, (errPartec, resultPartec) => {
                                                    if (this.controllaErrQuery(errPartec)) {
                                                        //questa connession non mi serve più, da ora userò
                                                        // una connessione che si connette già in autom.
                                                        // al DB appena creato
                                                        this.conn.end()

                                                        this.conn = mysql.createConnection({
                                                            hostname: "localhost",
                                                            user: "root",
                                                            passw: "",
                                                            database: "CrazyGoose"
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    })
                }
            })
        })
    }

    registrati(nome, cognome, email, passw, callback) {
        let registrEffettuata = true

        //---- CODICE PER CIFRARE PASSWORD ---
        // https://melvingeorge.me/blog/create-sha256-hash-nodejs

        this.conn.connect(() => {
            let query = "SELECT * FROM Utenti WHERE email = \"" + email + "\";"

            this.conn.query(query, (err, result) => {
                if (this.controllaErrQuery(err)) {
                    //non dev'esserci un record con quella email (è chiave primaria)
                    if (result.length == 0) {
                        let registra = "INSERT INTO Utenti (nome, cognome, email, password) VALUES (\"" + nome + "\", \"" + cognome + "\", \"" + email + "\", \"" + passw + "\");"

                        this.conn.query(registra, (errInsert, resultInsert) => {
                            if (this.controllaErrQuery(errInsert) == false) {
                                registrEffettuata = false
                            }
                            callback(registrEffettuata)
                        })

                    } else {
                        registrEffettuata = false
                        callback(registrEffettuata)
                    }
                } else {
                    registrEffettuata = false
                    callback(registrEffettuata)
                }
            })
        })
    }

    accedi(email, passw, callback) {
        let accessoEffettuato = true

        //---- CODICE PER CIFRARE PASSWORD ---
        // https://melvingeorge.me/blog/create-sha256-hash-nodejs

        this.conn.connect(() => {
            let query = "SELECT * FROM Utenti WHERE email = \"" + email + "\";"
                //console.log(query)

            this.conn.query(query, (err, result) => {
                if (this.controllaErrQuery(err)) {
                    //L'email che inserisce l'utente per registrarsi è univoca tra gli utenti
                    // quindi controllo che ci sia (ce ne può essere 1 al massimo essendo la PRIMARY KEY)
                    if (result.length == 1) {
                        if (result[0].password == passw) {
                            this.email = result[0].email
                            this.nome = result[0].nome
                            this.cognome = result[0].cognome
                        } else {
                            accessoEffettuato = false
                        }
                    } else {
                        accessoEffettuato = false
                    }
                } else {
                    accessoEffettuato = false
                }

                callback(accessoEffettuato)
            })
        })
    }

    aggiungiProfilo(username, callback) {
        let profiloAggiunto = true

        this.conn.connect(() => {
            let query = "SELECT * FROM Profili WHERE username = \"" + username + "\";"
                //console.log("controllo username: " + query)

            this.conn.query(query, (err, result) => {
                if (this.controllaErrQuery(err)) {
                    if (result.length == 0) {

                        let insert = "INSERT INTO Profili VALUES (\"" + username + "\", \"Novellino\", 0, 0, \"" + this.email + "\");"
                            //console.log("insert profilo: " + insert)

                        this.conn.query(insert, (err, result) => {
                            if (this.controllaErrQuery(err)) {
                                profiloAggiunto = true
                            } else {
                                profiloAggiunto = false
                            }
                            callback(profiloAggiunto)
                        })

                    } else {
                        profiloAggiunto = false
                        callback(profiloAggiunto)
                    }
                } else {
                    callback(profiloAggiunto)
                }
            })
        })
    }

    profiliRegistrati(callback) {
        this.conn.connect(() => {
            let datiProfilo = "SELECT username FROM Profili WHERE email = \"" + this.email + "\";"

            this.conn.query(datiProfilo, (err, result) => {
                //dall'altra parte dovrò poi prendere i dati con: obj[indice].username
                callback(result)
            })
        })
    }

    datiProfilo(callback) {
        this.conn.connect(() => {
            let datiProfilo = "SELECT * FROM Profili WHERE username = \"" + this.username + "\";"

            this.conn.query(datiProfilo, (err, result) => {
                if (this.controllaErrQuery(err)) {
                    //(dalla più recente alla meno recente (ID_part è AUTO_INCREMENT))
                    let recupPartite = "SELECT ID_part, durata, flagVittoria, numMosse FROM Partecipare, Partite WHERE(username = \"" + this.username + "\" AND ID_partita = ID_part) ORDER BY ID_part DESC;"

                    this.conn.query(recupPartite, (errPart, resultPart) => {
                        if (this.controllaErrQuery(errPart)) {
                            //dall'altra parte dovrò poi prendere i dati con: obj.campoDelDB
                            // e per le partite fare un ciclo (e poi per prendere i singoli dati si
                            // fa stesso modo)
                            callback(result[0], resultPart)
                        }
                    })
                }
            })
        })
    }

    esciDalProfilo() {
        this.username = null
    }

    eliminaProfilo(username, callback) {
        //DEVO CANCELLARE IN ORDINE IL PROFILO E TUTTE LE SUE PARTITE !!!
        // Prima cancello il record di Partecipare (che non ha un ID particolare
        // che diventa chiave esterna da qualche parte)
        // Ora posso eliminare la partita con il certo ID (prima non potevo xke era
        // chiave esterna in Partecipare)
        // E QUANDO HO FINITO TUTTI I PARTECIPARE/PARTITE POSSO ELIMINARE IL PROFILO

        this.conn.connect(() => {
            let partecipazioni = "SELECT ID_partita FROM Partecipare WHERE username = \"" + username + "\";"

            this.conn.query(partecipazioni, (err, result) => {
                if (this.controllaErrQuery(err)) {

                    result.forEach(partecipazione => {
                        let id_partita = partecipazione.ID_partita

                        let elimPartecip = "DELETE FROM Partecipare WHERE ID_partita = \"" + id_partita + "\";"

                        this.conn.query(elimPartecip, (errElimPartec, resultElimPartec) => {
                            if (this.controllaErrQuery(errElimPartec)) {

                                let elimPartita = "DELETE FROM Partite WHERE ID_part = \"" + id_partita + "\";"

                                this.conn.query(elimPartita, (errElimPart, resultElimPart) => {
                                    //ricordo che mi stampa nei log l'errore se questo capita
                                    this.controllaErrQuery(errElimPart)
                                })
                            }
                        })
                    })

                    let elimProfilo = "DELETE FROM Profili WHERE username = \"" + username + "\";"
                    this.conn.query(elimProfilo, (errElimProfilo, resultElimProfilo) => {
                        this.controllaErrQuery(errElimProfilo)
                        callback()
                    })
                }
            })
        })
    }

    recuperaDatiPerMenuUtente(callback) {
        if (this.email != null) {
            this.conn.connect(() => {
                let query = "SELECT nome, cognome FROM Utenti WHERE email = \"" + this.email + "\";"

                this.conn.query(query, (err, result) => {
                    if (this.controllaErrQuery(err)) {
                        let nome = result[0].nome
                        let cognome = result[0].cognome
                        let username = null

                        if (this.username != null) {
                            username = this.username
                        }

                        callback(nome, cognome, username)
                    }
                })
            })
        } else {
            callback(null, null, null)
        }
    }

    registraPartitaPartecipazione(durata, numMosse, vitt, callback) {
        this.conn.connect(() => {
            let insertPartita = "INSERT INTO Partite (durata) VALUES (\"" + durata + "\");"

            this.conn.query(insertPartita, (err, result) => {
                if (this.controllaErrQuery(err)) {
                    //devo sapere che ID è stato dato alla Partita, è un AUTO
                    // INCREMENT, e c'è una funzione apposta in MySQL
                    let lastAutoIncrQuery = "SELECT last_insert_id() AS lastAutoIncr;"

                    this.conn.query(lastAutoIncrQuery, (errAutoIncr, resultAutoIncr) => {
                        if (this.controllaErrQuery(errAutoIncr)) {
                            let lastAutoIncr = resultAutoIncr[0].lastAutoIncr
                            let vittBit = 0
                            if (vitt) {
                                vittBit = 1
                            }
                            let insertPartecipare = "INSERT INTO Partecipare VALUES (\"" + lastAutoIncr + "\", \"" + this.username + "\", \"" + vittBit + "\", \"" + numMosse + "\");"

                            this.conn.query(insertPartecipare, (errPartec, resultPartec) => {
                                if (this.controllaErrQuery(errPartec)) {
                                    let getUtente = "SELECT * FROM Profili WHERE username = \"" + this.username + "\";"

                                    this.conn.query(getUtente, (errGetUtente, resultGetUtente) => {
                                        if (this.controllaErrQuery(errGetUtente)) {
                                            let setPartite = ""
                                            let partiteVinteAdesso = (resultGetUtente[0].partiteVinte) + 1;
                                            if (vitt) {

                                                setPartite = "UPDATE Profili SET partiteVinte = \"" + partiteVinteAdesso + "\" WHERE username = \"" + this.username + "\";"
                                            } else {
                                                let partitePerseAdesso = (resultGetUtente[0].partitePerse) + 1;

                                                setPartite = "UPDATE Profili SET partitePerse = \"" + partitePerseAdesso + "\" WHERE username = \"" + this.username + "\";"
                                            }

                                            this.conn.query(setPartite, (errSetPart, resultSetPart) => {
                                                if (this.controllaErrQuery(errSetPart)) {
                                                    let grado = ""
                                                    if (partiteVinteAdesso < 5) {
                                                        grado = "Novellino";
                                                    } else if (partiteVinteAdesso >= 5 && partiteVinteAdesso < 10) {
                                                        grado = "Principiante";
                                                    } else if (partiteVinteAdesso >= 10 && partiteVinteAdesso < 20) {
                                                        grado = "Intermedio";
                                                    } else if (partiteVinteAdesso >= 20 && partiteVinteAdesso < 30) {
                                                        grado = "Esperto";
                                                    } else if (partiteVinteAdesso >= 30) {
                                                        grado = "Maestro";
                                                    }

                                                    let setGrado = "UPDATE Profili SET grado = \"" + grado + "\" WHERE(username = \"" + this.username + "\");"

                                                    this.conn.query(setGrado, (errSetGrado, resultSetGrado) => {
                                                        this.controllaErrQuery(errSetGrado)

                                                        callback()
                                                    })
                                                }
                                            })

                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        })



    }
}

module.exports = GestioneDatabase