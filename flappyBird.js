var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");
var startButton = document.getElementById("startButton");

// Load images
var bird = new Image();
var bg = new Image();
var fg = new Image();
var pipeNorth = new Image();
var pipeSouth = new Image();
var cookie = new Image();
var lifeImage = new Image();

bird.src = "images/bird.png";
bg.src = "images/bg.png";
fg.src = "images/fg.png";
pipeNorth.src = "images/pipeNorth.png";
pipeSouth.src = "images/pipeSouth.png";
cookie.src = "images/cookie.png";
lifeImage.src = "images/heard.png";

// Load audio files
var fly = new Audio();
var scor = new Audio();
var loss = new Audio();
var music = new Audio();

fly.src = "sounds/fly.mp3";
scor.src = "sounds/score.mp3";
loss.src = "sounds/lose.mp3";
music.src = "sounds/music.mp3";

// Ensure music is loaded and set to loop
music.addEventListener("canplaythrough", function() {
    music.loop = true;
});

// Start the game when the button is clicked
startButton.addEventListener("click", function() {
    startButton.style.display = "none";
    cvs.style.display = "block";

    // Play background music when the game starts
    music.play().catch(function(error) {
        console.log("Music playback failed:", error);
    });

    // Reset game variables and start the game
    resetGame();
    document.addEventListener("keydown", moveUp);
    draw();
});


fly.src = "sounds/fly.mp3";
scor.src = "sounds/score.mp3";
loss.src = "sounds/lose.mp3";
music.src = "sounds/music.mp3";

// Some variables
var gap = 200;
var constant;
var bX = 10;
var bY = 150;
var gravity = 1.5;
var score = 0;
var cookiesCollected = 0;
var lives = 3;

// Start the game when the button is clicked
startButton.addEventListener("click", function() {
    startButton.style.display = "none";
    cvs.style.display = "block";

    // Start background music
    music.loop = true;
    music.play();

    // Reset game variables
    resetGame();
    
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

// Pipe coordinates
var pipe = [];
var cookies = [];

pipe[0] = {
    x: cvs.width,
    y: 0
};

// Draw images
function draw() {
    ctx.drawImage(bg, 0, 0);

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
                scor.play();
                pipe[i].cookieCollected = true;
            }
        }

        pipe[i].x--;

        if (pipe[i].x == 125) {
            pipe.push({
                x: cvs.width,
                y: Math.floor(Math.random() * pipeNorth.height) - pipeNorth.height,
                cookieCollected: false
            });
        }

        // Detect collision with pipes
        if (
            (bX + bird.width >= pipe[i].x && bX <= pipe[i].x + pipeNorth.width &&
            (bY <= pipe[i].y + pipeNorth.height || bY + bird.height >= pipe[i].y + constant)) ||
            bY + bird.height >= cvs.height - fg.height
        ) {
            gameOver();
            return;
        }

        if (pipe[i].x == 5) {
            score++;
        }
    }

    ctx.drawImage(fg, 0, cvs.height - fg.height);
    ctx.drawImage(bird, bX, bY);
    bY += gravity;

    // Draw lives as images
    for (var i = 0; i < lives; i++) {
        ctx.drawImage(lifeImage, cvs.width - (i + 1) * (lifeImage.width + 10), 10);
    }

    ctx.fillStyle = "#000";
    ctx.font = "20px Verdana";
    ctx.fillText("Score : " + score, 10, cvs.height - 20);
    ctx.fillText("Cookies: " + cookiesCollected, 10, cvs.height - 40);

    requestAnimationFrame(draw);
}

// Function to handle game over
function gameOver() {
    document.removeEventListener("keydown", moveUp);
    loss.play();

    if (lives > 1) {
        lives--;
        resetGame();
        draw();
    } else {
        showGameOverScreen();
    }
}

// Function to reset the game variables
function resetGame() {
    bX = 10;
    bY = 150;
    score = 0;
    cookiesCollected = 0;
    pipe = [];
    pipe[0] = {
        x: cvs.width,
        y: 0
    };
}

// Function to show game over screen
function showGameOverScreen() {
    ctx.fillStyle = "#000";
    ctx.font = "40px Verdana";
    ctx.textAlign = "center";
    ctx.fillText("You Lose", cvs.width / 2, cvs.height / 2 - 50);

    ctx.font = "30px Verdana";
    ctx.fillText("Score: " + score, cvs.width / 2, cvs.height / 2);
    ctx.fillText("Cookies: " + cookiesCollected, cvs.width / 2, cvs.height / 2 + 40);

    // Show restart button
    startButton.textContent = "Restart Game";
    startButton.style.display = "block";
    startButton.style.marginTop = "20px";
}
