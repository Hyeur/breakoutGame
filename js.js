$(function() {
    var canvas = document.getElementById('Canvas');
    if (canvas.getContext) {
        var context = canvas.getContext('2d');

        var centerX = canvas.width / 2;
        var radius = 10;
        var quarterRadius = radius / 2;
        var moveY = canvas.height / 2;
        // var round = 1;
        var speed = 2.0;
        var dx = speed;
        var dy = speed;
        var fps = 60;
        var score = 0;
        var lives = 2;


        var paddleAcceleration = 1;
        var paddleHeight = 15;
        var paddleWidth = 100;
        var paddleX = (canvas.width - paddleWidth) / 2;

        var angle = 2.0 / (paddleWidth / 2);

        var rightPressed = false;
        var leftPressed = false;

        var brickRowCount = 3;
        var brickColumnCount = 8;
        var brickWidth = 75;
        var brickHeight = 20;
        var brickPadding = 10;
        var brickOffsetTop = 30;
        var brickOffsetLeft = 30;

        function nextRound() {
            speed++;
        }

        var bricks = [];
        for (var c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for (var r = 0; r < brickRowCount; r++) {
                bricks[c][r] = { x: 0, y: 0, status: 1 };
            }
        }

        document.addEventListener("keydown", keyDownHandler, false);
        document.addEventListener("keyup", keyUpHandler, false);
        document.addEventListener("mousemove", mouseMoveHandler, false);

        function keyDownHandler(e) {
            if (e.key == "d" || e.key == "ArrowRight") {
                rightPressed = true;
            }
            if (e.key == "a" || e.key == "ArrowLeft") {
                leftPressed = true;
            }
        }

        function keyUpHandler(e) {
            if (e.key == "d" || e.key == "ArrowRight") {
                rightPressed = false;
            }
            if (e.key == "a" || e.key == "ArrowLeft") {
                leftPressed = false;
            }
        }


        function draw() {
            PaddleX0 = paddleX;
            context.clearRect(0, 0, canvas.width, canvas.height); // clear the before canvas



            drawPaddle();

            PaddleX1 = paddleX;

            ball();

            collisionDetection();

            drawBricks();
            drawLives();

            checkScore();

            drawScore();


            centerX -= dx;
            moveY -= dy;

            checkColPaddle();

            if (rightPressed) {
                paddleX += speed + 1.0;
                if (paddleX + paddleWidth > canvas.width) {
                    paddleX = canvas.width - paddleWidth;
                }
            } else if (leftPressed) {
                paddleX -= speed + 1.0;
                if (paddleX < 0) {
                    paddleX = 0;
                }
            }
            if (moveY > canvas.height) {
                lives--;
                if (!lives) {
                    alert("GAME OVER");
                    cancelAnimationFrame(draw);
                    document.location.reload();
                    clearInterval(interval); // Needed for Chrome to end game
                } else {
                    centerX = canvas.width / 2;
                    moveY = canvas.height / 2;
                    dx = speed;
                    dy = speed;
                    paddleX = (canvas.width - paddleWidth) / 2;
                }

            }
            requestAnimationFrame(draw);
        }



    }
    requestAnimationFrame(draw);

    function checkColPaddle() {
        if (centerX > (canvas.width - radius) || (centerX < radius)) {
            dx = -dx;
        }
        if (moveY < radius) {
            dy = -dy;
        }
        if (centerX > paddleX - quarterRadius && centerX < paddleX + paddleWidth + quarterRadius && moveY > canvas.height - paddleHeight - radius && moveY < canvas.height - paddleHeight - radius + speed + 1) {
            dy = -dy;

            if ((centerX - paddleX) == paddleWidth / 2) {
                dx = 1 * dx;
            }

            if ((centerX - paddleX) < paddleWidth / 2 && dx < 0) {
                dx = paddleAcceleration * ((centerX - paddleX - (paddleWidth / 4)) * angle) * dx;

            }
            if ((centerX - paddleX) < paddleWidth / 2 && dx < 0) {
                dx = paddleAcceleration * ((centerX - paddleX - (paddleWidth / 4)) * angle) * dx;
            }
            if ((centerX - paddleX) > paddleWidth / 2 && dx > 0) {
                dx = paddleAcceleration - ((centerX - paddleX - (paddleWidth * 3 / 4)) * angle) * dx;
            }
            if ((centerX - paddleX) > paddleWidth / 2 && dx > 0) {
                dx = paddleAcceleration - ((centerX - paddleX - (paddleWidth * 3 / 4)) * angle) * dx;
            }
            // if (dx > sp) {
            //     dx = speed;
            // }

        }
        if (centerX > paddleX - radius && centerX < paddleX + paddleWidth + radius && moveY > canvas.height - paddleHeight - radius + speed + 1 && moveY < canvas.height - radius) {
            dx = -dx;

        }

    }

    function drawLives() {
        context.font = "16px Arial";
        context.fillStyle = "#0095DD";
        context.fillText("Lives: " + lives, canvas.width - 65, 20);
    }

    function ball() {
        context.beginPath();
        context.arc(centerX, moveY, radius, 0, 2 * Math.PI, false);
        context.fillStyle = '#FE0000';
        context.fill();
        context.closePath();
    }

    function drawPaddle() {
        context.beginPath();
        context.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        context.fillStyle = "#0095DD";
        context.fill();
        context.closePath();
    }

    function mouseMoveHandler(e) {
        var relativeX = e.clientX - canvas.offsetLeft;
        if (relativeX > paddleWidth / 2 && relativeX < canvas.width - (paddleWidth / 2)) {
            paddleX = relativeX - paddleWidth / 2;
        }
    }

    function drawBricks() {
        for (var c = 0; c < brickColumnCount; c++) {
            for (var r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status == 1) {
                    var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                    var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    context.beginPath();
                    context.rect(brickX, brickY, brickWidth, brickHeight);
                    context.fillStyle = "#0095DD";
                    context.fill();
                    context.closePath();
                }
            }
        }
    }

    function collisionDetection() {
        for (var c = 0; c < brickColumnCount; c++) {
            for (var r = 0; r < brickRowCount; r++) {
                var b = bricks[c][r];
                if (b.status == 1) {
                    if (centerX > (b.x - quarterRadius) && centerX < (b.x + brickWidth + quarterRadius) && moveY > (b.y - quarterRadius) && moveY < (b.y + brickHeight + quarterRadius)) {
                        b.status = 0;
                        dy = -dy;
                        score++;
                    } else if (centerX > (b.x - radius) && centerX < (b.x + brickWidth + radius) && moveY > (b.y) && moveY < (b.y + brickHeight)) {
                        b.status = 0;
                        dx = -dx;
                        score++;
                    }
                }
            }
        }
    }

    function checkScore() {
        if (score == brickRowCount * brickColumnCount) {
            alert("NEXT ROUND, CONGRATULATIONS!");
            score = 0;

            document.location.reload();
        }

    }

    function drawScore() {
        context.font = "16px Arial";
        context.fillStyle = "#0095DD";
        context.fillText("Score: " + score, 8, 20);
    }

});