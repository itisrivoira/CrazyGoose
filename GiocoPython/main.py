from game import Game

game = Game()

while game.running:
    if(game.curr_menu != None):
        #mostra il menu corrente (quello inizile con le scelte,
        # o le opzioni, ...)
        game.curr_menu.display_menu()
    #else: l'utente sta giocando, nessun menu da mostrare
    
    game.game_loop()
