<?php
   $to = "crazygoose.help@gmail.com";

   // Oggetto della mail
   $subject = 'INFO';
   $nome = $_POST['nome']; 
   $cognome = $_POST['cognome'];
   $domanda = $_POST['testo'];
   // Messaggio
   $message = '
    <html>
    <head>
        <title>Domanda da: <?php $nome , $cognome?></title>
    </head>
    <body>
        <p><?php $domanda?></p>
    </body>
    </html>
';;
   
   // Per inviare una mail HTML, deve essere opportunamente settato il Content-type dell'header
   $headers[] = 'MIME-Version: 1.0';
   $headers[] = 'Content-type: text/html; charset=iso-8859-1';

   $emailUser = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
   $headers[] = 'From: '.$emailUser;
   $headers[] = $emailUser;
    
   // Inviamo la mail!
   mail($to, $subject, $message, implode("\r\n", $headers));
   echo "<br>"."Ok fatto!"."<br>"; 
?>