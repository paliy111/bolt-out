// JavaScript source code
var x = 0;
var y = 0;
var vx = 0;
var vy = 0;

var keysDown = {
    a: false,
    w: false,
    s: false,
    d: false,
};
var char = document.getElementById("char");

function init() {
    addEventListener("keydown", keyDownHandler);
    addEventListener("keyup", keyUpHandler)
    window.requestAnimationFrame(drawFrame);
}

function keyDownHandler(e) {
    if (e.key === "s") {
        keysDown.s = true;
    }
    if (e.key === "w") {
        keysDown.w = true;
    }
    if (e.key === "d") {
        keysDown.d = true;
    }
    if (e.key === "a") {
        keysDown.a = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "s") {
        keysDown.s = false;
    }
    if (e.key === "w") {
        keysDown.w = false;
    }
    if (e.key === "d") {
        keysDown.d = false;
    }
    if (e.key === "a") {
        keysDown.a = false;
    }
}

function drawFrame() {
    ctx = document.getElementById("cvs").getContext("2d");
    ctx.clearRect(0, 0, 1280, 720);
    ctx.drawImage(char, x, y);
    if (keysDown.a) {
        vx = -2;
    } else if (keysDown.d) {
        vx = 2;
    } else {
        vx = 0;
    }

    if (keysDown.w) {
        vy = -2;
    } else if (keysDown.s) {
        vy = 2;
    } else {
        vy = 0;
    }

    x += vx;
    y += vy;

    window.requestAnimationFrame(drawFrame);
}

init();