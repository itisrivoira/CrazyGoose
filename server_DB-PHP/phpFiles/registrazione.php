<?php 
    require("GestoreDB.php");
//Mi serve l'IP del server. Questo lo leggo solo nel nodejs all'inizio e non riesco a passarlo
	// a tutte le pagine... lo scrivo su un file e quando ne ho bisogno lo leggo
	$IP = file("../indirizzo_server.txt")[0];

    $gestDB = new GestDB($IP);
    
    //(sono sicuro che i dati ci siano xke ho fatto i controlli nella pagina  registrati.html)
    $nome = $_POST["nome"];
    $cognome = $_POST["cognome"];
    $email = $_POST["email"];
    //cifra la password (è memorizzata cifrata nel DB)
    $password = hash("sha256", $_POST["password"]);

    if($gestDB->registra($nome, $cognome, $email, $password)){
        //È andato tutto bene, si è registrato...
        $changePage = "Location: http://$IP:3000/accedi";
    }else{
        //Passo semplicemente in GET un flag alla fine... mi serve per modificare con jsdom la pagina
        // e mostrare o meno il msg "email gia' in uso"
        $changePage = "Location: http://$IP:3000/registrati?err=1";
    }
    header($changePage);
?>
