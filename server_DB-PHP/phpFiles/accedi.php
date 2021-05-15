<?php 
    require("GestoreDB.php");
    
	//Mi serve l'IP del server. Questo lo leggo solo nel nodejs all'inizio e non riesco a passarlo
	// a tutte le pagine... lo scrivo su un file e quando ne ho bisogno lo leggo
	$IP = file("../indirizzo_server.txt")[0];
    $gestDB = new GestDB();
    
	//Si connette al DB CrazyGoose
    //(sono sicuro che i dati ci siano xke ho fatto i controlli nella pagina  accedi.html)
    $email = $_POST["email"];
    //cifra la password (è memorizzata cifrata nel DB)
    $password = hash("sha256", $_POST["password"]);

    $accessoEff = $gestDB->accedi($email, $password);
    if($accessoEff == true){
        session_start();

        $_SESSION["email"] = $email;

        //(in caso si stesse loggando con un altro utente ma durante la stessa sessione
        // non gli deve mostrare un profilo di un altro account utente)
        unset($_SESSION["username"]);

        $changePage = "Location: http://$IP:3000/passaAPaginaPHP?pagina=sitoWeb/phpPages/home.php";
    }else{
        //Passo semplicemente in GET un flag alla fine... mi serve per modificare
        // con jsdom la pagina e mostrare o meno il msg "email o passw errati"
        $changePage = "Location: http://$IP:3000/accedi?err=1";
    }
    header($changePage);
?>