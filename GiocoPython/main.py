import pygame
from game import Game

game = Game()

while game.running:
    if(not game.curr_menu == None):
        #mostra il menu corrente (quindi o quello iniziale
        # con la scelta, o quello delle opzioni, ...)
        game.curr_menu.display_menu()
    #else: l'utente sta giocando, nessun menu da mostrare
    
    game.game_loop()