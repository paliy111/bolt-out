// JavaScript source code
var x = 0;
var y = 0;
var vx = 0;
var vy = 0;
const gravity = 1;

var keysDown = {
    a: false,
    w: false,
    s: false,
    d: false,
};
var char = document.getElementById("char");

function init() {
    addEventListener("keydown", keyDownHandler);
    addEventListener("keyup", keyUpHandler);
    window.requestAnimationFrame(drawFrame);
}

function keyDownHandler(e) {
    if (e.key === "s") {
        keysDown.s = true;
    }
    else if (e.key === "w") {
        keysDown.w = true;
    }
    else if (e.key === "d") {
        keysDown.d = true;
    }
    else if (e.key === "a") {
        keysDown.a = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "s") {
        keysDown.s = false;
    }
    else if (e.key === "w") {
        keysDown.w = false;
    }
    else if (e.key === "d") {
        keysDown.d = false;
    }
    else if (e.key === "a") {
        keysDown.a = false;
    }
}

function drawFrame() {
    ctx = document.getElementById("cvs").getContext("2d");
    ctx.clearRect(0, 0, 1280, 720);
    ctx.drawImage(char, x, y);
    if (keysDown.a) {
        vx = -3;
    } else if (keysDown.d) {
        vx = 3;
    } else {
        vx = 0;
    }
	
	vy += gravity;
    x += vx;
    y += vy;
    if (x < 0 || x + char.width > 1280) {
        x -= vx;
        vx = 0;
    }

    if (y < 0 || y + char.height > 720) {
        y -= vy;
        vy = 0;
		if (keysDown.w) {
        vy = -20;
		}
    }

    window.requestAnimationFrame(drawFrame);
}

init();