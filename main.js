const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x000000 );
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, .1, 1000 );


camera.position.z = 110;
camera.position.y = 90;
camera.position.x = 0;
camera.rotation.x = -.9;

// camera.position.z = 140;
// camera.position.y = 31;
// camera.rotation.x = 0;

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio );

document.body.appendChild( renderer.domElement );

let neonColors = [0xFFFF00, 0xFFFF33, 0xF2EA02, 0xE6FB04, 0xFF0000, 0xFD1C03, 0xFF3300, 0xFF6600, 0x00FF00, 0x00FF33, 0x00FF66, 0x33FF00, 0x00FFFF, 0x099FFF, 0x0062FF, 0x0033FF, 0xFF00FF, 0xFF00CC, 0xFF0099, 0xCC00FF, 0x9D00FF, 0xCC00FF, 0x6E0DD0, 0x9900FF]

const ambientLight = new THREE.AmbientLight( 'white', .7 );
scene.add( ambientLight);

const light1 = new THREE.DirectionalLight( returnNeonColor(), .5 );
const light2 = new THREE.DirectionalLight( returnNeonColor(), .8 );

light1.position.x = 4
light1.position.z = -12
light2.position.x = -4
light2.position.z = -12


scene.add( light1, light2 );


function returnNeonColor() {
    return neonColors[Math.floor(Math.random() * neonColors.length)]
}

// Controller Code //

let leftPressed;
let rightPressed;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if (e.key == "Left" || e.key == "ArrowLeft") {
        e.preventDefault()
        leftPressed = true;
    }
    else if (e.key == "Right" || e.key == "ArrowRight") {
        e.preventDefault()
        rightPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "Left" || e.key == "ArrowLeft") {
        e.preventDefault()
        leftPressed = false;
    }
    else if (e.key == "Right" || e.key == "ArrowRight") {
        e.preventDefault()
        rightPressed = false;
    }
}

// Game Code //

let loader = new THREE.FontLoader();
let font;
loader.load('./fonts/blockfont.json', (blockfont) => {
    font = blockfont
    createScoreboard() 
})
let userPaddle; 
let cpuPaddle;
let userScore;
let cpuScore;
let ball;
let ballLength = 2;
let rx = 1;
let rz = 1;
let paddleWidth = 20;
let paddleHeight = 8;
let paddleLength = 2;
let wallWidth = 4;
let boardLength = 200;
let boardWidth = 120;
let playerScore = 0;
let computerScore = 0;
let animator;

function setPoint() {
    rx = 1;
    rz = 1;
    playerTurn = true;
    ball.position.x = 0;
    ball.position.z = 0;
}

function scoreBoard(score) {
    const fGeometry = new THREE.TextGeometry( score, {
        font: font,
        size: 20,
        height: 5,
        curveSegments: 12,
    })
    const fMaterial = new THREE.MeshLambertMaterial( {color: 'white'} )
    const number = new THREE.Mesh( fGeometry, fMaterial )
    return number
}

function createWalls() {
    let wall1 = createWall()
    let wall2 = createWall()
    wall1.position.x -= boardWidth/2 + wallWidth/2
    wall2.position.x += boardWidth/2 + wallWidth/2
    scene.add( wall1, wall2 )
}

function createWall() {
    let wGeometry = new THREE.BoxGeometry(wallWidth, 10, boardLength);
    let wMaterial = new THREE.MeshLambertMaterial( {color: 'white'} )
    let wall = new THREE.Mesh( wGeometry, wMaterial );
    return wall
}

function createPaddles() {
    userPaddle = createPaddle()
    userPaddle.position.z += boardLength/2-1
    userPaddle.material.transparent = true;
    userPaddle.material.opacity = .75;
    cpuPaddle = createPaddle()
    cpuPaddle.position.z -= boardLength/2-1
    scene.add( userPaddle, cpuPaddle )
}

function createPaddle() {
    let pGeometry = new THREE.BoxGeometry( paddleWidth, paddleHeight, paddleLength );
    let pMaterial = new THREE.MeshLambertMaterial( {color: 'white'} )
    let paddle = new THREE.Mesh( pGeometry, pMaterial );
    return paddle
}

function createBall() {
    let ballGeometry = new THREE.BoxGeometry( ballLength, ballLength, ballLength );
    let ballMaterial = new THREE.MeshLambertMaterial( {color: 'white'} )
    ball = new THREE.Mesh( ballGeometry, ballMaterial );
    ball.position.y += ballLength/2
    scene.add( ball )
}

function createScoreboard() {
    userScore = scoreBoard(playerScore.toString())
    userScore.position.x += boardLength/2-20
    userScore.position.z += 20
    userScore.rotation.x = -1.5708
    cpuScore = scoreBoard(computerScore.toString())
    cpuScore.position.x -= boardLength/2-4
    cpuScore.position.z += 20
    cpuScore.rotation.x = -1.5708

    scene.add( userScore, cpuScore )
}

function createMark() {
    let mGeometry = new THREE.BoxGeometry(boardWidth/24)
    let mMaterial = new THREE.MeshLambertMaterial( {color: 'white' })
    let mark = new THREE.Mesh( mGeometry, mMaterial )
    return mark;
}

function createMarks() {
    let markGroup = new THREE.Group();
    for (let i=-7; i<8; i++) {
        let newMark = createMark()
        newMark.position.x = (boardWidth/16) * i
        markGroup.add(newMark)
    }
    scene.add(markGroup)
}

function setScore(winner) {
    if (winner > 0) {
        playerScore += 1
    } else {
        computerScore += 1
    }
    scene.remove( userScore, cpuScore )
    createScoreboard()

}

function createGame() {
    createWalls()
    createMarks()
    createPaddles()
    createBall()
    setPoint()
}


function playerController() {
    if (rightPressed && userPaddle.position.x + paddleWidth/2 <= boardWidth/2) {
        userPaddle.position.x += 1
    }
    if (leftPressed && userPaddle.position.x - paddleWidth/2 >= -(boardWidth/2)) {
        userPaddle.position.x -= 1
    }
}

function ballController() {
    if (ball.position.x + ballLength/2 >= boardWidth/2 || ball.position.x - ballLength/2 <= -boardWidth/2) {
        rx = -rx
    }
    if (ball.position.z + ballLength/2 === userPaddle.position.z - paddleLength/2 &&
        ball.position.x >= userPaddle.position.x - paddleWidth/2 &&
        ball.position.x <= userPaddle.position.x + paddleWidth/2) {
            rz = -rz
            playerTurn = false;
        }
    if (ball.position.z - ballLength/2 === cpuPaddle.position.z + paddleLength/2 &&
        ball.position.x >= cpuPaddle.position.x - paddleWidth/2 &&
        ball.position.x <= cpuPaddle.position.x + paddleWidth/2) {
            rz = -rz
            playerTurn = true;
        }
    if (ball.position.z >= boardLength/2 || ball.position.z <= -boardLength/2) {
        if (ball.position.z > 0) {
            setScore(0)
        } else {
            setScore(1)
        }
        cancelAnimationFrame(animator)
        if (playerScore === 7) {
            displayMessage("YOU WIN")
        } else if (computerScore === 7) {
            displayMessage("YOU LOSE")
        } else {
            setPoint()
            setTimeout(animate, 2000)
        }
    }
        ball.position.x += rx;
        ball.position.z += rz
    }

    function displayMessage(display) {
        const dGeometry = new THREE.TextGeometry( display, {
            font: font,
            size: 10,
            height: 4,
            curveSegments: 12,
        })
        const dMaterial = new THREE.MeshLambertMaterial( {color: 'white'} )
        const message = new THREE.Mesh( dGeometry, dMaterial )
        if (display === "YOU LOSE") {
            message.position.x -= 40
        } else {
            message.position.x -= 36
        }
        message.position.z += 60
        message.rotation.x = -1.5708
        scene.add(message)
    }

    function cpuController() {
        if (!playerTurn) {
            if (ball.position.x > cpuPaddle.position.x && cpuPaddle.position.x + paddleWidth/2 <= boardWidth/2) {
                cpuPaddle.position.x += .8
            } else if (ball.position.x < cpuPaddle.position.x && cpuPaddle.position.x - paddleWidth/2 >= -(boardWidth/2)) {
                cpuPaddle.position.x -= .8
            }
        }
    }
    
    function animate() {
        animator = requestAnimationFrame( animate );
        ballController()
        cpuController()
        playerController()
        
        
        renderer.render( scene, camera );
    }
    
    
createGame()
animate()
