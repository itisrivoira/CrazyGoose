canvas = document.querySelector("canvas");
ctx = canvas.getContext("2d")

canvas.width = window.innerWidth
canvas.height = window.innerHeight

// Draw the ellipse
ctx.beginPath();
ctx.ellipse(100, 100, 50, 75, Math.PI / 4, 0, 2 * Math.PI);
ctx.stroke();