var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");
var startButton = document.getElementById("startButton");

// load images
var bird = new Image();
var bg = new Image();
var fg = new Image();
var pipeNorth = new Image();
var pipeSouth = new Image();
var cookie = new Image(); // εικόνα για το cookie

bird.src = "images/bird.png";
bg.src = "images/bg.png";
fg.src = "images/fg.png";
pipeNorth.src = "images/pipeNorth.png";
pipeSouth.src = "images/pipeSouth.png";
cookie.src = "images/cookie.png"; // καθορισμός πηγής για την εικόνα του cookie

// some variables
var gap = 200;
var constant;
var bX = 10;
var bY = 150;
var gravity = 1.5;
var score = 0;
var cookiesCollected = 0; // μεταβλητή για την παρακολούθηση των cookies που έχουν συλλεχθεί

// audio files
var fly = new Audio();
var scor = new Audio();
var loss = new Audio();

fly.src = "sounds/fly.mp3";
scor.src = "sounds/score.mp3";
loss.src = "sounds/lose.mp3";

// Start the game when the button is clicked
startButton.addEventListener("click", function() {
    // Hide the button and show the canvas
    startButton.style.display = "none";
    cvs.style.display = "block";

    // Reset game variables
    bX = 10;
    bY = 150;
    score = 0;
    cookiesCollected = 0; // επαναφορά της μέτρησης των cookies
    pipe = [];
    cookies = []; // πίνακας για την αποθήκευση των cookies
    pipe[0] = {
        x: cvs.width,
        y: 0
    };

    // Add keydown event listener
    document.addEventListener("keydown", moveUp);

    // Start the game loop
    draw();
});

// on key down
function moveUp() {
    bY -= 25;
    fly.play();
}

// pipe coordinates
var pipe = [];
var cookies = []; // πίνακας για τα cookies

pipe[0] = {
    x: cvs.width,
    y: 0
};

// draw images
function draw() {
    ctx.drawImage(bg, 0, 0);

    // Draw pipes and cookies
    for (var i = 0; i < pipe.length; i++) {
        constant = pipeNorth.height + gap;
        ctx.drawImage(pipeNorth, pipe[i].x, pipe[i].y);
        ctx.drawImage(pipeSouth, pipe[i].x, pipe[i].y + constant);

        // Draw cookie if not collected
        if (!pipe[i].cookieCollected) {
            var cookieX = pipe[i].x + pipeNorth.width / 2 - cookie.width / 2;
            var cookieY = pipe[i].y + pipeNorth.height + gap / 2 - cookie.height / 2;
            ctx.drawImage(cookie, cookieX, cookieY);

            // Detect collision with cookie
            if (
                bX + bird.width >= cookieX && bX <= cookieX + cookie.width &&
                bY + bird.height >= cookieY && bY <= cookieY + cookie.height
            ) {
                cookiesCollected++;
                scor.play(); // ήχος για συλλογή cookie
                pipe[i].cookieCollected = true; // mark cookie as collected
            }
        }

        pipe[i].x--;

        if (pipe[i].x == 125) {
            pipe.push({
                x: cvs.width,
                y: Math.floor(Math.random() * pipeNorth.height) - pipeNorth.height,
                cookieCollected: false // initialize new pipe with cookie not collected
            });
        }

        // Detect collision with pipes
        if (
            (bX + bird.width >= pipe[i].x && bX <= pipe[i].x + pipeNorth.width &&
            (bY <= pipe[i].y + pipeNorth.height || bY + bird.height >= pipe[i].y + constant)) ||
            bY + bird.height >= cvs.height - fg.height
        ) {
            gameOver(); // call game over function
            return; // stop the draw loop
        }

        if (pipe[i].x == 5) {
            score++;
        }
    }

    ctx.drawImage(fg, 0, cvs.height - fg.height);
    ctx.drawImage(bird, bX, bY);
    bY += gravity;

    ctx.fillStyle = "#000";
    ctx.font = "20px Verdana";
    ctx.fillText("Score : " + score, 10, cvs.height - 20);
    ctx.fillText("Cookies: " + cookiesCollected, 10, cvs.height - 40); // display collected cookies

    requestAnimationFrame(draw);
}

// function to handle game over
function gameOver() {
    // Remove keydown event listener to prevent further movement
    document.removeEventListener("keydown", moveUp);
    loss.play();
    // Display "You Lose" message
    ctx.fillStyle = "#000";
    ctx.font = "40px Verdana";
    ctx.textAlign = "center";
    ctx.fillText("You Lose", cvs.width / 2, cvs.height / 2 - 50);

    // Display the score and cookies
    ctx.font = "30px Verdana";
    ctx.fillText("Score: " + score, cvs.width / 2, cvs.height / 2);
    ctx.fillText("Cookies: " + cookiesCollected, cvs.width / 2, cvs.height / 2 + 40); // display total cookies

    // Show restart button
    startButton.textContent = "Restart Game";
    startButton.style.display = "block";
    startButton.style.marginTop = "20px";
}
