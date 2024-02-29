// JavaScript source code
const gravity = 0.8;

var char;

var blocks = new Array();

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
	
	drawHitbox(ctx) {
		ctx.strokeStyle = "red";
		ctx.strokeRect(this.x, this.y, this.w, this.h);
	}
}

class Player extends GameObject {
	constructor() {
		super("Images/char.png", 32, 64);
		this.dx = 0;
		this.dy = 0;
		this.ay = 0;
		this.xRemainder = 0;
		this.yRemainder = 0;
		this.ground_hitbox = new GameObject("", 32, 8);
		this.grounded = false;
	}
	
	update(blocks) {
		this.colided = false;
		this.moveX(this.dx); // changes this.colided
		this.moveY(this.dy);
		this.ground_hitbox.moveTo(this.x, this.y + 60);
		this.grounded = false;
		for (var i = 0; i < blocks.length; i++) {
			if (this.ground_hitbox.colides(blocks[i])){
				this.grounded = true;
				break;
			}
		}
	}
	
	moveX(distance) {
		this.xRemainder += distance;
		var intMove = Math.round(this.xRemainder);
		this.xRemainder -= intMove;
		var direction = Math.sign(intMove);
		while(intMove != 0) {
			this.x += direction;
			intMove -= direction;
			for (var i = 0; i < blocks.length; i++) {
				if (this.colides(blocks[i])) {
					this.x -= direction;
					this.colided = true;
					return;
				}
			}
		}
	}
	
	moveY(distance) {
		this.yRemainder += distance;
		var intMove = Math.round(this.yRemainder);
		this.yRemainder -= intMove;
		var direction = Math.sign(intMove);
		while(intMove != 0) {
			this.y += direction;
			intMove -= direction;
			for (var i = 0; i < blocks.length; i++) {
				if (this.colides(blocks[i])) {
					this.y -= direction;
					this.colided = true;
					return;
				}
			}
		}
	}
	
	draw(ctx) {
		super.draw(ctx);
		this.ground_hitbox.drawHitbox(ctx);
	}
}



function init() {
	char = new Player();
	var block = new GameObject("Images/char.png", 16, 16);
	blocks.push(block);
	block.moveTo(600, 600);
    addEventListener("keydown", keyDownHandler);
    addEventListener("keyup", keyUpHandler);
    window.requestAnimationFrame(drawFrame);
}

function keyDownHandler(e) {
	if (e.isComposing || e.keyCode === 229) {
		return;
	}
	console.log(e.code);
    if (e.code === "KeyS") {
        keysDown.s = true;
    }
    else if (e.code === "KeyW") {
        keysDown.w = true;
    }
    else if (e.code === "KeyD") {
        keysDown.d = true;
    }
    else if (e.code === "KeyA") {
        keysDown.a = true;
    }
	else if (e.code === "ArrowRight") {
		keysDown.d = true;
	}
	else if (e.code === "ArrowLeft") {
		keysDown.a = true;
	}
	else if (e.code === "ArrowUp") {
		keysDown.w = true;
	}
	else if (e.code === "ArrowDown") {
		keysDown.s = true;
	}
}

function keyUpHandler(e) {
    if (e.code === "KeyS") {
        keysDown.s = false;
    }
    else if (e.code === "KeyW") {
        keysDown.w = false;
    }
    else if (e.code === "KeyD") {
        keysDown.d = false;
    }
    else if (e.code === "KeyA") {
        keysDown.a = false;
    }
	else if (e.code === "ArrowRight") {
		keysDown.d = false;
	}
	else if (e.code === "ArrowLeft") {
		keysDown.a = false;
	}
	else if (e.code === "ArrowUp") {
		keysDown.w = false;
	}
	else if (e.code === "ArrowDown") {
		keysDown.s = false;
	}
}

function drawFrame() {
    ctx = document.getElementById("cvs").getContext("2d");
    ctx.clearRect(0, 0, 1280, 720);
    char.draw(ctx);
	for (var i = 0; i < blocks.length; i++) {
		blocks[i].draw(ctx);
	}
    if (keysDown.a) {
        char.dx = -3;
    } else if (keysDown.d) {
        char.dx = 3;
    } else {
        char.dx = 0;
    }
	char.dy += char.ay;
	if (char.dy > 15) {
		char.dy = 15;
	}
    char.update(blocks);
	if (char.grounded) {
		char.ay = 0;
		char.dy = 0;
	} else {
		char.ay = gravity;
	}
	if (char.colided) {
		console.log("colided");
	}
	if (char.grounded && keysDown.w) {
		char.dy = -20;
	}
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
