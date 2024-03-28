document.addEventListener('DOMContentLoaded', function () {
  const startButton = document.getElementById('startButton');
  const introScreen = document.querySelector('.container');
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;

  canvas.style.display = 'none';

  startButton.addEventListener('click', startGame);

  function startGame() {
    introScreen.style.display = 'none';
    canvas.style.display = 'block';
    gameLoop();
  }

  const BALL_RADIUS = 30;
  const PADDLE_WIDTH = 450;
  const PADDLE_HEIGHT = 40;
  const BRICK_WIDTH = 263;
  const BRICK_HEIGHT = 240;
  const BRICK_GAP = 10;
  const NUM_BRICKS = 15;
  const FPS = 60;

  let ball_x = WIDTH / 2;
  let ball_y = HEIGHT / 2;
  let ball_dx = 30;
  let ball_dy = 30;

  let paddle_x = (WIDTH - PADDLE_WIDTH) / 2;
  let paddle_y = HEIGHT - PADDLE_HEIGHT - 10;
  let paddle_dx = 0;

  let bricks = [];
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 8; col++) {
      let brick = {
        x: col * (BRICK_WIDTH + BRICK_GAP) + BRICK_GAP,
        y: row * (BRICK_HEIGHT + BRICK_GAP) + BRICK_GAP,
        width: BRICK_WIDTH,
        height: BRICK_HEIGHT,
      };
      bricks.push(brick);
    }
  }

  let lives = 3;
  let score = 0;
  let ballBelowPaddleCount = 0;
  let gameWon = false;

  document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft') {
      paddle_dx = -60;
    } else if (event.key === 'ArrowRight') {
      paddle_dx = 60;
    }
  });

  document.addEventListener('keyup', function (event) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      paddle_dx = 0;
    }
  });

  function gameOver() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    var img = new Image();
    img.src = './images/game_over.jpg';
    img.onload = function () {
      const container = createCenteredElement();
      container.appendChild(img);
      const restartButton = createRestartButton();
      container.appendChild(restartButton);
    };
  }

  function win() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    var img = new Image();
    img.src = './images/1_AZNoCmQTYF4w7YCUDoDRug.gif';
    img.onload = function () {
      const container = createCenteredElement();
      container.appendChild(img);

      const restartButton = createRestartButton();
      container.appendChild(restartButton);
    };
  }

  function gameLoop() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    paddle_x += paddle_dx;
    if (paddle_x < 0) {
      paddle_x = 0;
    } else if (paddle_x > WIDTH - PADDLE_WIDTH) {
      paddle_x = WIDTH - PADDLE_WIDTH;
    }

    ball_x += ball_dx;
    ball_y += ball_dy;

    if (ball_x <= 0 || ball_x >= WIDTH) {
      ball_dx = -ball_dx;
    }
    if (ball_y <= 0) {
      ball_dy = -ball_dy;
    }
    if (
      ball_y >= paddle_y - BALL_RADIUS &&
      paddle_x <= ball_x &&
      ball_x <= paddle_x + PADDLE_WIDTH
    ) {
      ball_dy = -ball_dy;
    }

    for (let i = 0; i < bricks.length; i++) {
      let brick = bricks[i];
      if (
        ball_x >= brick.x &&
        ball_x <= brick.x + brick.width &&
        ball_y >= brick.y &&
        ball_y <= brick.y + brick.height
      ) {
        bricks.splice(i, 1);
        ball_dy = -ball_dy;
        score++;
      }
    }

    if (bricks.length === 0 && lives >= 0 && !gameWon) {
      gameWon = true;
      win();
      return;
    }

    if (ball_y > HEIGHT) {
      ballBelowPaddleCount++;
      if (ballBelowPaddleCount >= 4) {
        gameOver();
        return;
      }

      ball_x = WIDTH / 2;
      ball_y = HEIGHT / 2;
      ball_dy = -ball_dy;
      lives--;
    }

    for (let brick of bricks) {
      ctx.fillStyle = 'white';
      ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
    }

    ctx.fillStyle = 'rgba 255 255 0 50';
    ctx.fillRect(paddle_x, paddle_y, PADDLE_WIDTH, PADDLE_HEIGHT);

    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.arc(ball_x, ball_y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = '24px Arial';
    ctx.fillText('Lives: ' + lives, 10, 30);
    ctx.fillText('Score: ' + score, WIDTH - 100, 30);

    requestAnimationFrame(gameLoop);
  }

  function createCenteredElement() {
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = '50%';
    container.style.left = '50%';
    container.style.transform = 'translate(-50%, -50%)';
    container.style.textAlign = 'center';
    document.body.appendChild(container);
    return container;
  }

  function createRestartButton() {
    const restartButton = document.createElement('button');
    restartButton.textContent = 'Restart Game';
    restartButton.style.position = 'absolute';
    restartButton.style.left = '50%';
    restartButton.style.top = '150%';
    restartButton.style.transform = 'translate(-50%, -50%)';
    restartButton.style.fontSize = '25px';
    restartButton.style.padding = '10px 20px';
    restartButton.addEventListener('click', () => {
      document.location.reload();
    });
    return restartButton;
  }
});
