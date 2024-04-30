const gravity = 0.8;

var char;
var spawnX = 0;
var spawnY = 0;

var blocks = new Array(); // for collision and rendering check
// all blocks should be referenced here and in the level array
var level = new Array(80);
for (var i = 0; i < level.length; i++) {
    level[i] = new Array(45);
}
console.log(level);

var keysDown = {
    a: false,
    w: false,
    s: false,
    d: false,
};

var backgroundFrame = 0;

var gameHandle;

class GameObject {
    constructor(src, w, h) {
        this.img = new Image();
        this.img.src = src;
        this.img.width = w;
        this.img.height = h;
        this.animationCanvas = document.createElement("canvas");
        this.animationCanvas.width = w;
        this.animationCanvas.height = h;
        this.animationCanvas.getContext("2d").drawImage(this.img, 0, 0);
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

    /** will return true if collision is with solid block 
     * should return false if this block is not solid
     */
    onColide() {
        return true;
    }

    moveTo(x, y) {
        this.x = x;
        this.y = y;
    }

    draw(ctx) {
        ctx.drawImage(this.animationCanvas, this.x, this.y)
    }

 
    drawHitbox(ctx) {
        ctx.strokeStyle = "red";
        ctx.strokeRect(this.x, this.y, this.w, this.h);
    }
}

class StandartTile extends GameObject {
    constructor(x, y) {
        super("Images/tile.png", 16, 16);
        this.moveTo(x * 16, y * 16);
        this.blocksIndex = blocks.push(this) - 1;
        level[x][y] = this;
        this.exposedBlocks = 0; // using this as a flag integer 0b0000 0000
                                // bit 0 is topleft, 1-top, 2- topright, 3-left, 4-right, 5-bottomleft, 6-bottom, 7-bottomright
        this.texturePosition = [];
        this.initAdjacent(x, y, false);
        this.texturePosition = this.getTexturePosition();
        this.updateTexture();
    }

    /** checks for connecting textures
     * StandartTiles only connect with themselves */
    connectsTo(block) {
        return block != null && isSameClass(this, block);
    }

    /** sets for updates all adjacent blocks and gets the right texture for this block */
    initAdjacent(x, y, toDelete) {
        var mask = 1;
        var res = 0;
        var counter = 0;
        for (var i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
                var block = level[x + j][y + i];
                if (i == 0 && j == 0)
                    continue;
                if (this.connectsTo(block)) {
                    res |= mask;
                    block.setAdjacent(7 - counter, toDelete);
                }
                mask <<= 1;
                counter++;
            }
        }
        this.exposedBlocks = ~res & 255;
    }

    /** updates this blocks adjacent information */
    setAdjacent(position, toDelete) {
        console.log(this, this.exposedBlocks);
        var mask = 1 << position;
        if (toDelete) {
            this.exposedBlocks |= mask; 
        } else {
            this.exposedBlocks &= ~mask;
        }
        this.exposedBlocks &= 255
        console.log(this.exposedBlocks);
        this.texturePosition = this.getTexturePosition();
        this.updateTexture();
    }

    /** gets the right texture checks only orthogonally */
    getTexturePositionAdjacent() {
        var x = this.exposedBlocks & 90;
        if (x == 0)
            return [1, 1];
        else if (x == 2)
            return [1, 0];
        else if (x == 8)
            return [0, 1];
        else if (x === 10)
            return [0, 0];
        else if (x == 16)
            return [2, 1];
        else if (x == 18)
            return [2, 0];
        else if (x == 24)
            return [3, 1];
        else if (x == 26)
            return [3, 0];
        else if (x == 64)
            return [1, 2];
        else if (x == 66)
            return [1, 3];
        else if (x == 72)
            return [0, 2];
        else if (x == 74)
            return [0, 3];
        else if (x == 80)
            return [2, 2];
        else if (x == 82)
            return [2, 3];
        else if (x == 88)
            return [3, 2];
        return [3, 3];
    }

    /** gets the texture for this block also checks corners */
    getTexturePosition() {
        var x = this.exposedBlocks;
        var res = this.getTexturePositionAdjacent();
        if (x == 1)
            res = [5, 1];
        else if (x == 4)
            res = [4, 1];
        else if (x == 5)
            res = [9, 1];
        else if (x == 12)
            res = [6, 3];
        else if (x == 17)
            res = [9, 3];
        else if (x == 32)
            res = [5, 0];
        else if (x == 33)
            res = [9, 0];
        else if (x == 34)
            res = [9, 2];
        else if (x == 37)
            res = [11, 1];
        else if (x == 48)
            res = [7, 2];
        else if (x == 49)
            res = [7, 0];
        else if (x == 50)
            res = [5, 2];
        else if (x == 65)
            res = [7, 3];
        else if (x == 68)
            res = [8, 3];
        else if (x == 69)
            res = [7, 1];
        else if (x == 76)
            res = [4, 3];
        else if (x == 81)
            res = [5, 3];
        else if (x == 128)
            res = [4, 0];
        else if (x == 130)
            res = [6, 2];
        return res
    }       

    /**
     * changes this blocks texture to 
     */
    changeToTexture(i, j) {
        var ctx = this.animationCanvas.getContext("2d");
        ctx.clearRect(0, 0, this.w, this.h)
        ctx.drawImage(this.img, -16 * i, -16 * j);

    }

    updateTexture() {
        this.changeToTexture(...this.texturePosition);
    }

    deleteFromArrays() {
        var x = this.x / 16;
        var y = this.y / 16;
        level[x][y] = null;
        this.initAdjacent(x, y, true);
        blocks.splice(this.blocksIndex, 1);

    }
    
}

class WallTile extends StandartTile {
    constructor(x, y) {
        super(x, y);
        this.img.src = "Images/wall.png";
        this.updateTexture();
    }

    getTexturePosition() {
        return this.getTexturePositionAdjacent()
    }

    onColide() {
        return false; // no colision
    }
}

class Spike extends GameObject {
    onColide() {
        console.log("died");
        return true;
    }

    draw(ctx) {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}

class Player extends GameObject {
    constructor() {
        super("Images/char2.png", 32, 64);
        this.x = spawnX;
        this.y = spawnX;
        this.dx = 0;
        this.dy = 0;
        this.ay = 0;
        this.xRemainder = 0;
        this.yRemainder = 0;
        this.ground_hitbox = new GameObject("", 32, 8);
        this.grounded = false;
        this.animationFrame = 0;
        this.animationDelay = 10;
        this.animationDelayCounter = 0;
        this.mirror = false;
    }

    update(blocks) {
        this.colided = false;
        this.moveX(this.dx); // changes this.colided
        this.moveY(this.dy);
        this.ground_hitbox.moveTo(this.x, this.y + 60);
        this.grounded = false;
        for (var i = 0; i < blocks.length; i++) {
            if (this.ground_hitbox.colides(blocks[i])) {
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
        while (intMove != 0) {
            this.x += direction;
            intMove -= direction;
            for (var i = 0; i < blocks.length; i++) {
                if (this.colides(blocks[i]) && blocks[i].onColide()) {
                    this.x -= direction;
                    this.dx = 0;
                    this.colided = true;
                    return;
                }
            }
        }
    }

    moveY(distance) { // repetitive code :(
        this.yRemainder += distance;
        var intMove = Math.round(this.yRemainder);
        this.yRemainder -= intMove;
        var direction = Math.sign(intMove);
        while (intMove != 0) {
            this.y += direction;
            intMove -= direction;
            for (var i = 0; i < blocks.length; i++) {
                if (this.colides(blocks[i]) && blocks[i].onColide()) {
                    this.y -= direction;
                    this.dy = 0;
                    this.colided = true;
                    return;
                }
            }
        }
    }

    draw(ctx) {
        // super.draw(ctx);
        this.ground_hitbox.drawHitbox(ctx);
        var animationCtx = this.animationCanvas.getContext("2d");
        animationCtx.clearRect(0, 0, 32, 64);

        if (this.dx == 0) {
            this.animationFrame = 0;
        }

        if (this.mirror) {
            animationCtx.save();
            animationCtx.scale(-1, 1);
            animationCtx.drawImage(this.img, -32, -this.animationFrame * 66);
            animationCtx.restore();

        } else {
            animationCtx.drawImage(this.img, 0, -this.animationFrame * 66);
        }

        ctx.drawImage(this.animationCanvas, this.x, this.y);
        this.drawHitbox(ctx);


        this.animationDelayCounter++;
        if (this.animationDelayCounter >= this.animationDelay) { // animation advancer 
            this.animationDelayCounter = 0;
            this.animationFrame++;
            if (this.animationFrame >= 3) {
                this.animationFrame = 0;
            }
        }
    }
}

function isSameClass(obj1, obj2) {
    return obj1.constructor.name == obj2.constructor.name;
}

function init() {
    char = new Player();
    var spoik = new Spike("", 16, 16);
    var block2 = new StandartTile(16, 29);
    new StandartTile(17, 29).deleteFromArrays();
    new StandartTile(2, 0);

    new StandartTile(16, 32);
    var block = new StandartTile(16, 33);
    new StandartTile(16, 34);
    new StandartTile(17, 32);
    new StandartTile(17, 33);
    new StandartTile(17, 34);
    new StandartTile(15, 33);
    new StandartTile(15, 34);
    console.log(block);
    blocks.push(spoik);
    console.log(blocks);
    spoik.moveTo(800, 650);
    var canvas = document.getElementById("game");
    var background = document.getElementById("background");
    var backgroundImage = document.getElementById("backgroundImage");
    addEventListener("keydown", keyDownHandler);
    addEventListener("keyup", keyUpHandler);
    canvas.addEventListener("mousedown", mouseDownHandler);
    canvas.addEventListener("contextmenu", mouseRightClick)
    drawBackground(background, backgroundImage);
    gameHandle = setInterval(gameLoop, 17, canvas); // ~60 fps
    setInterval(drawBackground, 500, background, backgroundImage);
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

function mouseDownHandler(e) {
    console.log(e.offsetX, e.offsetY);
    var blockX = Math.floor(e.offsetX / 16);
    var blockY = Math.floor(e.offsetY / 16);
    new StandartTile(blockX, blockY);
}

function mouseRightClick(e) {
    e.preventDefault();
}

function drawBackground(background, backgroundImage) {
    background.getContext("2d").drawImage(backgroundImage, 0, -722 * backgroundFrame);
    backgroundFrame++;
    if (backgroundFrame > 1) {
        backgroundFrame = 0;
    }
}
function renderBlocks(canvas) {
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 1280, 720);
    for (var i = 0; i < blocks.length; i++) {
        blocks[i].draw(ctx);
    }
    return ctx;
}
function gameLoop(canvas) {
    var ctx = renderBlocks(canvas);
    char.draw(ctx);
    if (keysDown.a) {
        char.dx = -3;
        char.mirror = true;
    } else if (keysDown.d) {
        char.dx = 3;
        char.mirror = false;
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

}
