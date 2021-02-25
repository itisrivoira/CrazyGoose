import pygame
from game import Game

g = Game()

while g.running:
    if(g.curr_menu != None):
        g.curr_menu.display_menu()
        
    g.game_loop()
