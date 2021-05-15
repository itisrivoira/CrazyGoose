<?php 
    class GestDB{
        public function __construct() {
            $this->mysqli = new mysqli("localhost", "root", "", "CrazyGoose");
            if($this->mysqli->connect_error){
                if($this->mysqli->connect_errno == 1049){
                    $this->creaDB();
                }else{
                    die("Errore:".$this->mysqli->connect_errno." per ".$this->mysqli->connect_error);
                }
            }
        }
        private function creaDB(){
            //Questa funzione è richiamata SOLO se non esiste il DB (è richiamata nel costruttore
            
            $this->mysqli = new mysqli("localhost", "root", "");
            if($this->mysqli->connect_error){
                die("Errore:".$this->mysqli->connect_errno." per ".$this->mysqli->connect_error);
            }else{
                if(!$this->mysqli->query("CREATE DATABASE CrazyGoose;")){
                    die("ERRORE creazione DB: ".$this->mysqli->error." (".$this->mysqli->errno.")");
                }else{
                    //(non controllo nemmero che dia o meno errore...  il DB l'ho appena creato)
                    $this->mysqli->query("USE CrazyGoose;");

                    //creo tutte le varie tabelle

                    if(!$this->mysqli->query("CREATE TABLE IF NOT EXISTS Utenti (
                                            nome VARCHAR(25) NOT NULL,
                                            cognome VARCHAR(30) NOT NULL,
                                            email VARCHAR(40) PRIMARY KEY NOT NULL,
                                            password VARCHAR(64) NOT NULL
                                        );")){

                        die("ERRORE CREAZIONE TAB Utenti: ".$this->mysqli->error." (".$this->mysqli->errno.")");
                    }else{
                        if(!$this->mysqli->query("CREATE TABLE IF NOT EXISTS Profili (
                                                username VARCHAR(20) PRIMARY KEY NOT NULL,
                                                grado VARCHAR(15) NOT NULL,
                                                partiteVinte INT NOT NULL,
                                                partitePerse INT NOT NULL,
                                                emailUtente VARCHAR(40) NOT NULL,
                                                FOREIGN KEY(emailUtente) REFERENCES Utenti(email)
                                            );")){

                            die("ERRORE CREAZIONE TAB Profili: ".$this->mysqli->error." (".$this->mysqli->errno.")");
                        }else{
                            if(!$this->mysqli->query("CREATE TABLE IF NOT EXISTS Partite (
                                                    ID_part INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
                                                    durata INT NOT NULL
                                                );")){

                                die("ERRORE CREAZIONE TAB Partite: ".$this->mysqli->error." (".$this->mysqli->errno.")");
                            }else{
                                if(!$this->mysqli->query("CREATE TABLE IF NOT EXISTS Partecipare (
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

                                    die("ERRORE CREAZIONE TAB Partecipare: ".$this->mysqli->error." (".$this->mysqli->errno.")");
                                }
                            }
                        }
                    }
                }
            }
        }
        
        function accedi($email, $password) {
            $query= $this->mysqli->query("SELECT * FROM Utenti WHERE email = \"$email\" AND password = \"$password\";");
            if(!$query){
                die("ERRORE SELECT Utente $email $password: ".$this->mysqli->error." (".$this->mysqli->errno.")");
            }else{
                //Mi ritorna un array posizionale, dove in ogni posizione (0,1,2,3,...) ho un Utente
                // sotto forma di array associativo ([ID_gioc]=..., [nome]=...)
                $queryResult = $query->fetch_all();
                
                if(!empty($queryResult)){
                    return true;
                }else{
                    return false;
                }
            }
        }
        
        function registra($nome, $cognome, $email, $password){
            $query = $this->mysqli->query("SELECT * FROM Utenti WHERE email = \"$email\";");
            if(!$query){
                die("ERRORE SELECT Utente $email: ".$this->mysqli->error." (".$this->mysqli->errno.")");
            }else{
                $queryResult = $query->fetch_all();
                if(!empty($queryResult)){
                    return false;
                }else{
                    //(li specifico prima nelle parentesi xke non sono scritti in ordine)
                    $query = $this->mysqli->query("INSERT INTO Utenti (nome, cognome, email, password) VALUES ('$nome', '$cognome', '$email', '$password');");
                    if(!$query){
                        die("ERRORE insert utente: ".$mysqli->error." (".$mysqli->errno.")");
                    }else{
                        return true;
                    }
                }
            }
        }
        
        function datiUtente($email){
            $query = $this->mysqli->query("SELECT nome, cognome FROM Utenti WHERE email = \"$email\";");
            if(!$query){
                die("ERRORE SELECT Utente $email: ".$this->mysqli->error." (".$this->mysqli->errno.")");
            }else{
                //Nella select ho usato where con la CHIAVE PRIMARIA, quindi mi ritorna una tabella con i 
                // campi nome e cognome in UN SOLO record. Posso usare fetch_assoc
                $queryResult = $query->fetch_assoc();
                
                if(!empty($queryResult)){
                    return $queryResult;
                }else{
                    return null;
                }
            }
        }
        
        function profiliUtente($email){
            $query = $this->mysqli->query("SELECT username FROM Profili WHERE emailUtente = \"$email\" ORDER BY username ASC;");
            if(!$query){
                die("ERRORE SELECT Profili di $email: ".$this->mysqli->error." (".$this->mysqli->errno.")");
            }else{
                //avrò array POSIZIONALE dove in ogni posizione c'è un username accessibile
                // con ["username"]
                $queryResult = $query->fetch_all(MYSQLI_ASSOC);
                return $queryResult;
            }
        }
        
        function datiProfilo($username){
            $query = $this->mysqli->query("SELECT * FROM Profili WHERE username = \"$username\";");
            if(!$query){
                die("ERRORE SELECT Profilo $username: ".$this->mysqli->error." (".$this->mysqli->errno.")");
            }else{
                //Nella select ho usato where con la CHIAVE PRIMARIA, quindi mi ritorna una tabella con i 
                // tutti i campi del profilo in UN SOLO record. Posso usare fetch_assoc
                $queryResult = $query->fetch_assoc();
                return $queryResult;
            }
        }
        
        function partiteProfilo($username){
            $query = $this->mysqli->query("SELECT ID_part, durata, flagVittoria, numMosse FROM Partecipare, Partite WHERE(username = \"$username\" AND ID_partita = ID_part) ORDER BY ID_part DESC;");
            if(!$query){
                die("ERRORE SELECT Partite/Partecipare di $username ".$this->mysqli->error." (".$this->mysqli->errno.")");
            }else{
                $queryResult = $query->fetch_all(MYSQLI_ASSOC);
                return $queryResult;
            }
        }
        
        function aggiungiProfilo($email, $username){
            $query = $this->mysqli->query("INSERT INTO Profili VALUES (\"$username\", \"Novellino\", 0, 0, \"$email\");");
            if(!$query){
                //username già presente ==> Error: Duplicate entry usernameScritto for key 'PRIMARY'
                if($this->mysqli->errno == 1062){
                    return false;
                }else{
                    die("ERRORE INSERT Profilo $username di $email: ".$this->mysqli->error." (".$this->mysqli->errno.")");
                }
            }else{
                return true;
            }
        }
        
        function eliminaProfilo($username){
            //DEVO CANCELLARE IN ORDINE IL PROFILO E TUTTE LE SUE PARTITE !!!
			// Prima cancello il record di Partecipare (che non ha un ID particolare
			// che diventa chiave esterna da qualche parte)
			// Ora posso eliminare la partita con il certo ID (prima non potevo xke il foreign
			// key di Partecipare sarebbe "rimasto appeso lì senza sapere più il suo valore")
			// E QUANDO HO FINITO TUTTI I PARTECIPARE/PARTITE POSSO ELIMINARE IL PROFILO

            $query = $this->mysqli->query("SELECT * FROM Partecipare WHERE username = \"$username\";");
            if(!$query){
                die("ERRORE SELECT Partecipare di $username: ".$this->mysqli->error." (".$this->mysqli->errno.")");
            }else{
                //Avrò una tabella con tutte i campi di Partecipare e un record
                // per ogni partita fatta da questo profilo
                $queryResult = $query->fetch_all(MYSQLI_ASSOC);
                
                foreach($queryResult as $recordPartecipare){
                    $idPartita = $recordPartecipare["ID_partita"];

                    $query = $this->mysqli->query("DELETE FROM Partecipare WHERE ID_partita = \"$idPartita\";");
                    if(!$query){
                        die("Errore delete partecipare: ".$this->mysqli->error);
                    }else{
                        $query= $this->mysqli->query("DELETE FROM Partite WHERE ID_part = \"$idPartita\";");
                        if(!$query){
                            die("Errore delete partita: ".$this->mysqli->error);
                        }
                    }
                }

                $query= $this->mysqli->query("DELETE FROM Profili WHERE username = \"$username\";");
                if(!$query){
                    die("Errore delete profilo: ".$this->mysqli->error);
                }else{
                    return true;
                }
            }
        }
        
        function aggiungiPartita($username, $durata, $numMosse, $vitt){
            $query = $this->mysqli->query("INSERT INTO Partite (durata) VALUES (\"$durata\");");
            if(!$query){
                die("ERRORE INSERT Partita: ".$this->mysqli->error." (".$this->mysqli->errno.")");     
            }else{
                //!!! 
				//ritorna l'ultimo ID assegnato automaticamente (campo AUTO_INCREMENT) nell'ultima query
				$idPartita = $this->mysqli->insert_id;
				//!!!
                
                $query = $this->mysqli->query("INSERT INTO Partecipare VALUES (\"$idPartita\", \"$username\", \"$vitt\", \"$numMosse\");");
                
                if(!$query){
                    die("ERRORE INSERT Partecipare di $idPartita-$username: ".$this->mysqli->error." (".$this->mysqli->errno.")");  
                }else{
                    $query = $this->mysqli->query("SELECT * FROM Profili WHERE username = \"$username\";");
                    if(!$query){
                        die("ERRORE SELECT Profilo $username: ".$this->mysqli->error." (".$this->mysqli->errno.")");
                    }else{
                        $queryResult = $query->fetch_assoc();
                        
                        if($vitt == true){
                            $partiteVinteAdesso = $queryResult["partiteVinte"]+1;

							$query= $this->mysqli->query("UPDATE Profili SET partiteVinte = \"$partiteVinteAdesso\" WHERE username = \"$username\";");
                            
                            if(!$query){
                                die("ERRORE SET partVinte Profilo $username: ".$this->mysqli->error." (".$this->mysqli->errno.")");
                            }
                        }else{
                            $partitePerseAdesso = $queryResult["partitePerse"]+1;

							$query= $this->mysqli->query("UPDATE Profili SET partitePerse= \"$partitePerseAdesso\" WHERE username = \"$username\";");
                            
                            if(!$query){
                                die("ERRORE SET partPerseProfilo $username: ".$this->mysqli->error." (".$this->mysqli->errno.")");
                            }
                        }
                        
                        $query = $this->mysqli->query("SELECT partiteVinte FROM Profili WHERE username = \"$username\";");
                        if(!$query){
                            die("ERRORE SELECT partVinte Profilo $username: ".$this->mysqli->error." (".$this->mysqli->errno.")");
                        }else{
                            $queryResult = $query->fetch_assoc();
                            
                            $vittorie = $queryResult["partiteVinte"];
                            
                            if($vittorie < 5){
                                $grado = "Novellino";
                            }elseif($vittorie >= 5 && $vittorie < 10){
                                $grado = "Principiante";
                            }elseif($vittorie >= 10 && $vittorie < 20){
                                $grado = "Intermedio";
                            }elseif($vittorie >= 20 && $vittorie < 30){
                                $grado = "Esperto";
                            }elseif($vittorie >= 30){
                                $grado = "Maestro";
                            }
                            
                            $query= $this->mysqli->query("UPDATE Profili SET grado = \"$grado\" WHERE(username = \"$username\");");
                            if(!$query){
                                die("ERRORE SET grado Profilo $username: ".$this->mysqli->error." (".$this->mysqli->errno.")");
                            }else{
                                return true;
                            }
                        }
                        
                    }
                }
            }
        }
    }
?>