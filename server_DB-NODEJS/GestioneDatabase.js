const mysql = require("mysql")
class GestioneDatabase {
    constructor() {
        /*Abbiamo già il file di configurazione del DB che crea un utente apposta, ma
            non riusciamo ad usarlo qui:
        this.conn = mysql.createConnection({
            hostname: "localhost",
            user: "Giocatore",
            passw: "1gioc!CrazyGoose?",
            database: "CrazyGoose"
        })

        Non da nessun log nel terminale, ma alla prima query da errore:
        "Error: Cannot enqueue Query after fatal error"
        */

        //Crea la connessione per ora senza selezionare già il DB,
        // dopo SE non esiste lo creerà.
        this.conn = mysql.createConnection({
            hostname: "localhost",
            user: "root",
            passw: ""
        })
        this.creaDB()

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
        //Questo metodo mi serve solo per comodità di non dover scrivere in ogni
        // singola query il controllo se c'è stato un errore e stamparlo in quel caso

        if (err != null) {
            console.log(err)
            return false
        } else {
            return true
        }
    }

    creaDB() {
        this.conn.connect(() => {
            this.conn.query("CREATE DATABASE CrazyGoose;", (err, result) => {
                if (err != null && err.errno == 1007) {
                    //Codice 1007  =  "Can't create database 'CrazyGoose'; database exists"

                    //Questa connession non mi serve più, da ora userò
                    // una connessione che si connette già in autom.
                    // al DB appena creato
                    this.conn.end()

                    this.conn = mysql.createConnection({
                        hostname: "localhost",
                        user: "root",
                        passw: "",
                        database: "CrazyGoose"
                    })
                } else {
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
                                        emailUtente VARCHAR(40) NOT NULL, \
                                        FOREIGN KEY(emailUtente) REFERENCES Utenti(email) );"

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

                                                            //Questa connession non mi serve più, da ora userò
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
                }
            })
        })
    }

    registrati(nome, cognome, email, passw, callback) {
        //Controlla che NON ci sia nessun'altro utente con quella email,
        // dopodichè fa la insert del nuovo utente

        let registrEffettuata = true

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
        //Controlla che esista un utente con quella email,
        // e se esiste ne controlla la password (la query
        // controllando la chiave primaria può restituire
        // 0 oppure 1 record)

        let accessoEffettuato = true

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
        //Controlla che non vi siano già altri Profili con quel
        // username e poi lo aggiunge (con dei valori di default)

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
        //Ritorna un array con tutti gli username dei profili
        // di questo Utente

        this.conn.connect(() => {
            let datiProfilo = "SELECT username FROM Profili WHERE emailUtente = \"" + this.email + "\";"

            this.conn.query(datiProfilo, (err, result) => {
                //dall'altra parte dovrò poi prendere i dati con: obj[indice].username
                callback(result)
            })
        })
    }

    datiProfilo(callback) {
        //Prende i dati dentro la tabella Profilo e tutti quelli delle partite,
        // dopo aver controllato che il profilo appartenga proprio a quel utente
        // (il profilo è scritto in GET e quindi uno potrebbe pensare di modificare
        // l'URL per loggarsi con un profilo di qualcun'altro)

        this.conn.connect(() => {
            let datiProfilo = "SELECT * FROM Profili WHERE username = \"" + this.username + "\" AND emailUtente = \"" + this.email + "\";"

            this.conn.query(datiProfilo, (err, result) => {
                if (this.controllaErrQuery(err) || result.length == 0) {
                    //(dalla più recente alla meno recente (ID_part è AUTO_INCREMENT))
                    let recupPartite = "SELECT ID_part, durata, flagVittoria, numMosse FROM Partecipare, Partite WHERE(username = \"" + this.username + "\" AND ID_partita = ID_part) ORDER BY ID_part DESC;"

                    this.conn.query(recupPartite, (errPart, resultPart) => {
                        if (this.controllaErrQuery(errPart)) {
                            //(Ai dati si accederà con objResult.nomeCampo e objResultPart[indice].nomeCampo)
                            callback(result[0], resultPart)
                        } else {
                            callback(null, null)
                        }
                    })
                } else {
                    callback(null, null)
                }
            })
        })
    }

    esciDalProfilo() {
        this.username = null
    }

    eliminaProfilo(username, callback) {
        this.username = null

        //DEVO CANCELLARE IN ORDINE IL PROFILO E TUTTE LE SUE PARTITE !!!
        // Prima cancello il record di Partecipare (che non ha un ID particolare
        // che diventa chiave esterna da qualche parte)
        // Poi posso eliminare la partita con il certo ID (prima non potevo xke era
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

    registraPartitaPartecipazione(durata, numMosse, vitt, callback) {

        this.conn.connect(() => {
            let insertPartita = "INSERT INTO Partite (durata) VALUES (\"" + durata + "\");"

            this.conn.query(insertPartita, (err, result) => {
                if (this.controllaErrQuery(err)) {
                    //Devo sapere che ID è stato dato alla Partita (è un AUTO
                    // INCREMENT): c'è una funzione apposta in MySQL
                    let lastAutoIncrQuery = "SELECT last_insert_id() AS lastAutoIncr;"

                    this.conn.query(lastAutoIncrQuery, (errAutoIncr, resultAutoIncr) => {
                        if (this.controllaErrQuery(errAutoIncr)) {
                            let lastAutoIncr = resultAutoIncr[0].lastAutoIncr
                            let vittBit = 0
                            if (vitt == true) {
                                vittBit = 1
                            } //else è settato a 0

                            let insertPartecipare = "INSERT INTO Partecipare VALUES (\"" + lastAutoIncr + "\", \"" + this.username + "\", \"" + vittBit + "\", \"" + numMosse + "\");"

                            this.conn.query(insertPartecipare, (errPartec, resultPartec) => {
                                if (this.controllaErrQuery(errPartec)) {
                                    let getUtente = "SELECT * FROM Profili WHERE username = \"" + this.username + "\";"

                                    this.conn.query(getUtente, (errGetUtente, resultGetUtente) => {
                                        if (this.controllaErrQuery(errGetUtente)) {
                                            let setPartite = ""
                                            let partiteVinteAdesso = (resultGetUtente[0].partiteVinte) + 1;
                                            if (vitt == true) {

                                                setPartite = "UPDATE Profili SET partiteVinte = \"" + partiteVinteAdesso + "\" WHERE username = \"" + this.username + "\";"
                                            } else {
                                                let partitePerseAdesso = (resultGetUtente[0].partitePerse) + 1;

                                                setPartite = "UPDATE Profili SET partitePerse = \"" + partitePerseAdesso + "\" WHERE username = \"" + this.username + "\";"
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