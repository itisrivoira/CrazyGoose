<?php
    require("GestoreDB.php");

    session_start();
	
	//Mi serve l'IP del server. Questo lo leggo solo nel nodejs all'inizio e non riesco a passarlo
	// a tutte le pagine... lo scrivo su un file e quando ne ho bisogno lo leggo
	$IP = file("../indirizzo_server.txt")[0];

    $gestDB = new GestDB();
    
    $email = $_SESSION["email"];
    //(sono sicuro che il dato ci sia xke ho fatto i controlli nella pagina  registrati.html)
    $username = $_POST["username"];
    
    if($gestDB->aggiungiProfilo($email, $username)){
        $changePage = "Location: http://$IP:80/progetti/CrazyGoose/server_DB-PHP/sitoWeb/phpPages/profilo.php";
    }else{
        //Passo semplicemente in GET un flag alla fine... mi serve per
        // mostrare o meno il msg "username già in uso"
        $changePage = "Location: http://$IP:80/progetti/CrazyGoose/server_DB-PHP/sitoWeb/phpPages/profilo.php?agg=1&err=1";
    }
    header($changePage);
?>
