<?php
    //Mi serve l'IP del server. Questo lo leggo solo nel nodejs all'inizio e non riesco a passarlo
    // a tutte le pagine... lo scrivo su un file e quando ne ho bisogno lo leggo
    $IP = $_GET["IP"];

    $to = 'crazygoose.help@gmail.com';
    $oggettoEmail = 'Richiesta di assistenza';

    //(sono sicuro che i dati ci siano xke ho fatto i controlli nella pagina  contattaci.php)
    $nome = $_POST['nome']; 
    $cognome = $_POST['cognome'];
    $domanda = $_POST['testo'];

    $messaggio = '
        <html>
        <head>
            <title>Domanda da: '.$nome.' '.$cognome.'</title>
        </head>
        <body>
            <p>'.$domanda.'</p>
        </body>
    </html>';

    // Per inviare una mail HTML, deve essere opportunamente settato il Content-type dell'header
    // (nel $messagio abbiamo usato html e non semplice testo quindi text/html)
    $headers[] = 'MIME-Version: 1.0';
    $headers[] = 'Content-type: text/html; charset=iso-8859-1';

    //Rimuove i caratteri che non sono permessi nell'indirizzo email (ad es. "(" o ")" ))
    $emailUser = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $headers[] = 'To: Crazy Goose team <'.$to.'>';
    $headers[] = 'From: '.$cognome.' <'.$emailUser.'>';

    mail($to, $oggettoEmail, $messaggio, implode("\r\n", $headers));

    //Torna alla pagina contattaci ma passandogli un flag per mostrare un alert di avviso di
    // email spedita all'utente
    $changePage = "Location: http://$IP:3000/contattaci?flag=true";
    header($changePage);
?>