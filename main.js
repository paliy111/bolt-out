// JavaScript source code
var x = 0;
var y = 0;
var char = document.getElementById("char");
function init() {
    addEventListener("keydown", () => {

        if (event.key === "s") {
            y += 2;
        }
        if (event.key === "w") {
            y -= 2;
        }
        if (event.key === "d") {
            x += 2;
        }
        if (event.key === "a") {
            x -= 2;
        }
    })
    window.requestAnimationFrame(DrawFrame);
}

function DrawFrame() {
    ctx = document.getElementById("cvs").getContext("2d");

    ctx.drawImage(char, x, y);

    window.requestAnimationFrame(DrawFrame)
}

init();