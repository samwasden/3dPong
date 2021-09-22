const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
let x
let y
let rx
let ry
let ballRadius = 10;
let paddleWidth = 10;
let paddleHeight = 40;
let playerY = canvas.height/2-paddleHeight/2;
let cpuY = canvas.height/2-paddleHeight/2;
let upPressed = false;
let downPressed = false;
let playerTurn;
let randomAngle = 20;
let playerPoint = 0;
let cpuPoint = 0;
let blockfont = new FontFace('blockfont', 'url(./FFFFORWA.TTF)')
let interval;
let negatizer;
ctx.fillStyle = "white";

let button = document.querySelector('button')
button.addEventListener('click', startPoint)


function startPoint() {
    button.style.fontSize = '0pt';
    x = canvas.width/2;
    y = canvas.height/2;
    if (Math.random() > .5) {
        negatizer = 1
    } else {
        negatizer = -1
    }
    rx = (Math.floor(Math.random() * 3) + 4) * negatizer;
    ry = (6 - Math.abs(rx)) * negatizer;
    if (rx < 0) {
        playerTurn = false;
    } else {
        playerTurn = true;
    }
    playerY = canvas.height/2-paddleHeight/2;
    cpuY = canvas.height/2-paddleHeight/2;
    interval = setInterval(draw, 10);
}

blockfont.load().then((font) => {
    document.fonts.add(font);
    drawPoints();

})

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if (e.key == "Up" || e.key == "ArrowUp") {
        e.preventDefault()
        upPressed = true;
    }
    else if (e.key == "Down" || e.key == "ArrowDown") {
        e.preventDefault()
        downPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "Up" || e.key == "ArrowUp") {
        e.preventDefault()
        upPressed = false;
    }
    else if (e.key == "Down" || e.key == "ArrowDown") {
        e.preventDefault()
        downPressed = false;
    }
}

function drawBall() {
    ctx.fillRect(x, y, ballRadius, ballRadius);
}

function drawGame() {
    for(let i=0; i<20; i++) {
        ctx.fillRect(canvas.width/2-5, canvas.height/20*(i+.25), 10, canvas.height/40)
    }
}

function ballBounce() {
    if (y + ry >= canvas.height-ballRadius || y + ry <= 0) {
        ry = -ry
    }
    if (x + rx + ballRadius >= canvas.width-20 && x + rx + ballRadius <= canvas.width-15 && y - ballRadius <= playerY + paddleHeight && y + ballRadius >= playerY) {
        let difference = y-ry - playerY
        console.log(difference)
        if (difference <= 8) {
            rx = -4
            ry = -2
        } else if (difference <= 16) {
            rx = -5
            ry = -1
        } else if (difference <= 24) {
            rx = -6
            ry = 0
        } else if (difference <= 32) {
            rx = -5
            ry = 1
        } else {
            rx = -4
            ry = 2
        }
        playerTurn = false
        randomAngle = Math.floor(Math.random() * 40)
    }
    if (x + rx - ballRadius <= 20 && x + rx - ballRadius >= 15 && y - ballRadius <= cpuY + paddleHeight && y + ballRadius >= cpuY) {
        let difference = y-ry - cpuY
        console.log(difference)
        if (difference <= 8) {
            rx = 4
            ry = -2
        } else if (difference <= 16) {
            rx = 5
            ry = -1
        } else if (difference <= 24) {
            rx = 6
            ry = 0
        } else if (difference <= 32) {
            rx = 5
            ry = 1
        } else if (difference <= 40) {
            rx = 4
            ry = 2
        }
        playerTurn = true
    }
    if (x >= canvas.width || x <= 0 - ballRadius) {
        let point;
        if (x > canvas.width/2) {
            point = 1
        } else {
            point = 0
        }
        addPoint(point)
        clearInterval(interval)
        if (playerPoint === 7) {
            ctx.font = "60px blockfont";
            ctx.fillText(`YOU LOSE`, canvas.width/2-185, canvas.height/2 + 20);
            button.style.fontSize = '20pt';
        } else if (cpuPoint === 7) {
            ctx.font = "60px blockfont";
            ctx.fillText(`YOU WIN`, canvas.width/2-165, canvas.height/2 + 20);
            button.style.fontSize = '20pt';
        } else {
            setTimeout(startPoint, 1500)
        }
    }
}

function addPoint(id) {
    (id > 0) ? playerPoint += 1 : cpuPoint += 1;
}

function drawPoints() {
    ctx.font = "60px blockfont";
    ctx.fillText(`${playerPoint}`, canvas.width/2-60, 100);
    ctx.font = "60px blockfont";
    ctx.fillText(`${cpuPoint}`, canvas.width/2+20, 100);
}

function drawPlayer() {
    if (upPressed && playerY > 0) {
        playerY -= 1.5
    }
    if (downPressed && playerY < canvas.height - paddleHeight) {
        playerY += 1.5
    }
    ctx.fillRect(canvas.width-20, playerY, paddleWidth, paddleHeight)
}

function drawCPU() {
    if (!playerTurn) {
        if (y > cpuY + randomAngle) {
            cpuY += 1.5
        }
        if (y < cpuY + randomAngle) {
            cpuY -= 1.5
        }
    }
    ctx.fillRect(10, cpuY, paddleWidth, paddleHeight)
}

function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawGame();
    drawBall();
    drawPlayer();
    drawCPU();
    ballBounce();
    drawPoints();
    
    x+=rx
    y+=ry
}

drawGame()
drawPlayer();
drawCPU();
