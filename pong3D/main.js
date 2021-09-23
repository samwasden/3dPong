function runGame() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x000000 );

    // top view //

    // const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, .1, 1000 );
    // camera.position.z = 110;
    // camera.position.y = 90;
    // camera.position.x = 0;
    // camera.rotation.x = -.9;

    // player view //

    const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, .1, 1000 );
    camera.position.z = 180;
    camera.position.y = 0;
    camera.rotation.x = 0;

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
    let upPressed;
    let downPressed;

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);

    function keyDownHandler(e) {
        if (e.key == "Left" || e.key == "ArrowLeft" || e.key == "KeyA") {
            e.preventDefault()
            leftPressed = true;
        }
        else if (e.key == "Right" || e.key == "ArrowRight" || e.key == "KeyD") {
            e.preventDefault()
            rightPressed = true;
        } 
        else if (e.key == "Up" || e.key == "ArrowUp" || e.key == "KeyW") {
            e.preventDefault()
            upPressed = true;
        }
        else if (e.key == "Down" || e.key == "ArrowDown" || e.key == "KeyS") {
            e.preventDefault()
            downPressed = true;
        }
    }

    function keyUpHandler(e) {
        if (e.key == "Left" || e.key == "ArrowLeft" || e.key == "KeyA") {
            e.preventDefault()
            leftPressed = false;
        }
        else if (e.key == "Right" || e.key == "ArrowRight" || e.key == "KeyD") {
            e.preventDefault()
            rightPressed = false;
        } else if (e.key == "Up" || e.key == "ArrowUp" || e.key == "KeyW") {
            e.preventDefault()
            upPressed = false;
        }
        else if (e.key == "Down" || e.key == "ArrowDown" || e.key == "KeyS") {
            e.preventDefault()
            downPressed = false;
        }
    }

    // Game Code //

    let loader = new THREE.FontLoader();
    let font;
    loader.load('/jsonFont', (blockfont) => {
        font = blockfont
        createScoreboard() 
    })
    let userPaddle; 
    let cpuPaddle;
    let userScore;
    let cpuScore;
    let ball;
    let ballLength = 2;
    let rx;
    let rz;
    let ry;
    let paddleWidth = 20;
    let paddleHeight = 12;
    let paddleLength = 2;
    let wallWidth = 4;
    let wallHeight = 64;
    let boardLength = 200;
    let boardWidth = 120;
    let playerScore = 0;
    let computerScore = 0;
    let playerSpeed;
    let cpuSpeed;
    let ballSpeed;
    let animator;
    let difficulty;
    let username;
    let playerName;
    let cpuName;


    function negatizer() {
        return Math.random() > .5 ? 1 : -1 
    }

    function setPoint() {

        rx = (ballSpeed/3) * negatizer();
        rz = (ballSpeed/3) * negatizer();
        ry = (ballSpeed/3) * negatizer();
        playerTurn = rz > 0 ? true : false;
        ball.position.x = 0;
        ball.position.z = 0;
        ball.position.y = 0;
        userPaddle.position.z = boardLength/2-1
        userPaddle.position.x = 0
        userPaddle.position.y = 0
        cpuPaddle.position.z = -(boardLength/2-1)
        cpuPaddle.position.x = 0
        cpuPaddle.position.y = 0
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
        let wGeometry = new THREE.BoxGeometry(wallWidth, wallHeight, boardLength);
        let wMaterial = new THREE.MeshLambertMaterial( {color: 'white'} )
        let wall = new THREE.Mesh( wGeometry, wMaterial );
        return wall
    }

    function createPaddles() {
        userPaddle = createPaddle()
        userPaddle.position.z += boardLength/2-1
        cpuPaddle = createPaddle()
        cpuPaddle.position.z -= boardLength/2-1
        scene.add( userPaddle, cpuPaddle )
    }

    function createPaddle() {
        let pGeometry = new THREE.BoxGeometry( paddleWidth, paddleHeight, paddleLength );
        let pMaterial = new THREE.MeshLambertMaterial( {color: 'white', transparent: true, opacity: .75 } )
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
        userScore.position.x += 20
        userScore.position.y -= 18
        userScore.position.z -= boardLength/2 + 10
        cpuScore = scoreBoard(computerScore.toString())
        cpuScore.position.x -= 38
        cpuScore.position.y -= 18
        cpuScore.position.z -= boardLength/2 + 10

        scene.add( userScore, cpuScore )
    }

    function createMark() {
        let mGeometry = new THREE.BoxGeometry(boardWidth/24)
        let mMaterial = new THREE.MeshLambertMaterial( {color: 'white' })
        let mark = new THREE.Mesh( mGeometry, mMaterial )
        return mark;
    }

    function createMarks(multiplier) {
        let markGroup1 = new THREE.Group();
        for (let i=-7; i<8; i++) {
            let newMark = createMark()
            newMark.position.x = (boardWidth/16) * i
            markGroup1.add(newMark)
        }
        markGroup1.position.y = (wallHeight/2 - boardWidth/36) * multiplier
        scene.add(markGroup1)
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

    function createBackWalls() {
        let playBottom = createGoal()
        let playTop = createGoal()
        let cpuBottom = createGoal()
        let cpuTop = createGoal()
        playBottom.position.z += boardLength/2 - .5
        playBottom.position.y -= wallHeight/2 - .5
        playTop.position.z += boardLength/2 - .5
        playTop.position.y += wallHeight/2 - .5
        cpuBottom.position.z -= boardLength/2 - .5
        cpuBottom.position.y -= wallHeight/2 - .5
        cpuTop.position.z -= boardLength/2 - .5
        cpuTop.position.y += wallHeight/2 - .5

        scene.add(playBottom, playTop, cpuBottom, cpuTop)
    }

    function createGoal() {
        let gGeometry = new THREE.BoxGeometry(boardWidth, 1, 1)
        let gMaterial = new THREE.MeshLambertMaterial( {color: 'white'} )
        let goal = new THREE.Mesh(gGeometry, gMaterial)
        return goal
    }

    function createNames() {
        playerName = createName(username)
        let xMove = 27 - (username.length * 2)
        playerName.position.x += xMove
        playerName.position.y -= 26
        playerName.position.z -= boardLength/2 + 10
        cpuName = createName('CPU')
        cpuName.position.x -= 36
        cpuName.position.y -= 26
        cpuName.position.z -= boardLength/2 + 10
        scene.add(playerName, cpuName)
    }

    function createName(name) {
        const nGeometry = new THREE.TextGeometry( name, {
            font: font,
            size: 4,
            height: 2,
            curveSegments: 12,
        })
        const nMaterial = new THREE.MeshLambertMaterial( {color: 'white'} )
        const newName = new THREE.Mesh( nGeometry, nMaterial )
        return newName
    }

    function createGame() {
        createWalls()
        createBackWalls()
        createMarks(-1)
        createMarks(1)
        createPaddles()
        createBall()
        createNames()
        setDifficulty()
        setPoint()
    }

    function setDifficulty() {
        if (difficulty == 0 ) {
            cpuSpeed = .38;
            ballSpeed = 1.5;
            playerSpeed = .75;
        } else if (difficulty == 1) {
            cpuSpeed = .5
            ballSpeed = 2
            playerSpeed = 1
        } else {
            cpuSpeed = .75;
            ballSpeed = 2.5;
            playerSpeed = 1;
            paddleWidth = 16;
            paddleHeight = 8;
        }
    }


    function playerController() {
        if (rightPressed && userPaddle.position.x + paddleWidth/2 <= boardWidth/2) {
            userPaddle.position.x += playerSpeed
        }
        if (leftPressed && userPaddle.position.x - paddleWidth/2 >= -(boardWidth/2)) {
            userPaddle.position.x -= playerSpeed
        }
        if (upPressed && userPaddle.position.y + paddleHeight/2 < wallHeight/2) {
            userPaddle.position.y += playerSpeed
        }
        if (downPressed && userPaddle.position.y - paddleHeight/2 > -(wallHeight/2)) {
            userPaddle.position.y -= playerSpeed
        }
    }

    function ballController() {
        if (ball.position.x + ballLength/2 >= boardWidth/2 || ball.position.x - ballLength/2 <= -boardWidth/2) {
            rx = -rx
        }
        if (ball.position.y + ballLength/2 >= wallHeight/2 || ball.position.y - ballLength/2 <= -wallHeight/2) {
            ry = -ry
        }
        if (ball.position.z + ballLength/2 >= userPaddle.position.z - paddleLength/2 &&
            ball.position.x >= userPaddle.position.x - paddleWidth/2 &&
            ball.position.x <= userPaddle.position.x + paddleWidth/2 &&
            ball.position.y >= userPaddle.position.y - paddleHeight/2 &&
            ball.position.y <= userPaddle.position.y + paddleHeight/2) {
                let xd = (ball.position.x - userPaddle.position.x)/6
                let xy = (ball.position.y - userPaddle.position.y)/4
                if (xd === 0) {
                    xd = .5 * negatizer()
                }
                if (xy === 0) {
                    xy = .5 * negatizer()
                }
                let xz = (Math.abs(xd) + Math.abs(xy))
                let percent = (ballSpeed/(Math.abs(xd)+Math.abs(xy)+xz))
                rx = xd * percent
                ry = xy * percent
                rz = -(xz * percent)

                playerTurn = false;
            }

        if (ball.position.z - ballLength/2 <= cpuPaddle.position.z + paddleLength/2 &&
            ball.position.x >= cpuPaddle.position.x - paddleWidth/2 &&
            ball.position.x <= cpuPaddle.position.x + paddleWidth/2 &&
            ball.position.y >= cpuPaddle.position.y - paddleHeight/2 &&
            ball.position.y <= cpuPaddle.position.y + paddleHeight/2) {
                let xd = (ball.position.x - cpuPaddle.position.x)/6
                let xy = (ball.position.y - cpuPaddle.position.y)/4
                if (xd === 0) {
                    xd = .1 * negatizer()
                }
                if (xy === 0) {
                    xy = .1 * negatizer()
                }
                let xz = (Math.abs(xd) + Math.abs(xy))
                let percent = (ballSpeed/(Math.abs(xd)+Math.abs(xy)+xz))
                rx = xd * percent
                ry = xy * percent
                rz = (xz * percent)

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
                scene.remove(userScore, cpuScore, userPaddle, cpuPaddle, playerName, cpuName)
                replayButton()
            } else if (computerScore === 7) {
                displayMessage("YOU LOSE")
                scene.remove(userScore, cpuScore, userPaddle, cpuPaddle, playerName, cpuName)
                replayButton()
            } else {
                setPoint()
                setTimeout(animate, 2000)
            }
        }
            ball.position.x += rx;
            ball.position.z += rz;
            ball.position.y += ry;
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
            message.position.y -= 10
            message.position.z += 60
            scene.add(message)
        }

        function cpuController() {
            if (!playerTurn) {
                if (ball.position.x > cpuPaddle.position.x && cpuPaddle.position.x + paddleWidth/2 <= boardWidth/2) {
                    if (ball.position.x < cpuPaddle.position.x + cpuSpeed) {
                        cpuPaddle.position.x = ball.position.x
                    } else {
                        cpuPaddle.position.x += cpuSpeed
                    }
                } else if (ball.position.x < cpuPaddle.position.x && cpuPaddle.position.x - paddleWidth/2 >= -(boardWidth/2)) {
                    if (ball.position.x > cpuPaddle.position.x - cpuSpeed) {
                        cpuPaddle.position.x = ball.position.x
                    } else {
                        cpuPaddle.position.x -= cpuSpeed
                    }
                }
                if (ball.position.y > cpuPaddle.position.y && cpuPaddle.position.y + paddleHeight/2 < wallHeight/2) {
                    if (ball.position.y < cpuPaddle.position.y + cpuSpeed) {
                        cpuPaddle.position.y = ball.position.y
                    } else {
                        cpuPaddle.position.y += cpuSpeed
                    }
                } else if (ball.position.y < cpuPaddle.position.y && cpuPaddle.position.y - paddleHeight/2 > -(wallHeight/2)) {
                    if (ball.position.y > cpuPaddle.position.y - cpuSpeed) {
                        cpuPaddle.position.y = ball.position.y
                    } else {
                        cpuPaddle.position.y -= cpuSpeed
                    }
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


        
    function startGame() {
        createGame()
        animate()
    }

    function promptUser() {
        let form = document.querySelector('form');
        form.style.display = 'flex';
        form.addEventListener('submit', (e) => {
            e.preventDefault()
            form.style.display = 'none';
            username = document.querySelector('#username').value
            difficulty = document.querySelector('input[name="difficulty"]:checked').value
            if (username.length === 0) {
                username = 'PLAYER'
            } else {
                username = username.toUpperCase()
            }
            startGame()
        })
    }

    promptUser()

    function replayButton() {
        let replay = document.querySelector("#replayButton")
        replay.addEventListener('click', () => {
            location.reload()
        })
        replay.style.display = 'flex';
    }

    return

}

runGame()