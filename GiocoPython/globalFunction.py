import pygame

#funzioni usate in ogni file bene o male

#Metodo per disegnare testo (per scrivere) con un
# determinato font, dimensione e colore, il tutto
# centrato in un rettangolo alle coordinate passate
def draw_text(game, text, size, color, x, y):
	font = pygame.font.Font(game.font_name, size)
	text_surface = font.render(text, True, color)
	text_rect = text_surface.get_rect()
	#l'allineamento del testo
	text_rect.center = (x, y)

	# Ora va realmente a disegnare la scritta
	game.display.blit(text_surface, text_rect)
