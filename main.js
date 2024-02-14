// JavaScript source code
const gravity = 1;

var char = {
	img: new Image(),
	w: 32,
	h: 64,
	x: 0,
	dx: 0,
	y: 0,
	dy: 0,
	
	draw: (ctx, this_object) => {
		ctx.drawImage(this_object.img, this_object.x, this_object.y, this_object.w, this_object.h);
	}
}

var keysDown = {
    a: false,
    w: false,
    s: false,
    d: false,
};

class GameObject {
	constructor(src, w, h) {
		this.img = new Image();
		this.img.src = src;
		this.img.width = w;
		this.img.height = h;
		this.h = h;
		this.w = w;
		this.x = 0;
		this.y = 0;
	}
	
	colides(other) {
		return (this.x < other.x + other.w &&
		this.x + this.w > other.x &&
		this.y < other.y + other.h &&
		this.y + this.h > other.y)
	}
	
	moveTo(x, y) {
		this.x = x;
		this.y = y;
	}
	
	draw(ctx) {
		ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
	}
}



function init() {
	var new_char = new GameObject("Images/char.png", 32, 64);
	char.img.src = "Images/char.png";
	
	ctx = document.getElementById("cvs").getContext("2d");
	new_char.moveTo(200, 200);
	new_char.draw(ctx);
    addEventListener("keydown", keyDownHandler);
    addEventListener("keyup", keyUpHandler);
    // window.requestAnimationFrame(drawFrame);
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
    char.draw(ctx, char);
    if (keysDown.a) {
        char.dx = -3;
    } else if (keysDown.d) {
        char.dx = 3;
    } else {
        char.dx = 0;
    }
	
	char.dy += gravity;
    char.x += char.dx;
    char.y += char.dy;
    if (char.x < 0 || char.x + char.w > 1280) {
        char.x -= char.dx;
        char.dx = 0;
    }

    if (char.y < 0 || char.y + char.h > 720) {
        char.y -= char.dy;
        char.dy = 0;
		if (keysDown.w) {
        char.dy = -20;
		}
    }

    window.requestAnimationFrame(drawFrame);
}
