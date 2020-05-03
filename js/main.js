const FIELD_WIDTH = 64;
const FIELD_HEIGHT = 64;
const FOOD_COLORS = ['red', 'lavenderblush', 'lightsalmon', 'lightpink', 'lightgreen', 'lightblue']
const UP = [0, -1];
const DOWN = [0, 1];
const LEFT = [-1, 0];
const RIGHT = [1, 0];

function directionString (direction) {
  switch (direction) {
    case UP:
      return 'up';
    case DOWN:
      return 'down';
    case LEFT:
      return 'left';
    case RIGHT:
      return 'right';
  }
}

function initialSnake (fieldWidth, fieldHeight) {
  const xTail = fieldWidth / 2;
  const xHead = xTail + 6;
  const y = fieldHeight / 2;

  let positions = [];

  for (let i = xTail; i <= xHead; i++) {
    positions.push([i, y])
  }

  return {
    color: 'lightblue',
    positions: positions,
    head: () => positions[positions.length - 1],
    tail: () => positions[0],
    direction: RIGHT
  }
}

function selectCell(position) {
  return $(`#cell\\[${position[0]}\\,${position[1]}\\]`)
}

function clearField (width, height) {
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      selectCell([i, j])
        .css('background-color', '')
        .removeClass('snake')
        .removeClass('food')
        .removeClass('head');
    }
  }
}

function initEmptyField (width, height, selector = '#head-container') {
  let field = "<table class='field'>"

  for (let i = 0; i < height; i++) {
    field += "<tr>"
    for (let j = 0; j < width; j++) {
      field += `<td id="cell[${j},${i}]" class="cell"></td>`
    }
    field += "</tr>"
  }

  field += "</table>"

  $(selector).after(field)
}

function setupKeypressHandlers (game) {
  $(document).keydown(function (event) {
    const snake = game.snake

    switch (event.code) {
      case 'ArrowLeft':
        if (snake.direction !== RIGHT)
          snake.direction = LEFT;
        break;
      case 'ArrowRight':
        if (snake.direction !== LEFT)
          snake.direction = RIGHT;
        break;
      case 'ArrowUp':
        if (snake.direction !== DOWN)
          snake.direction = UP;
        break;
      case 'ArrowDown':
        if (snake.direction !== UP)
          snake.direction = DOWN;
        break;
      case 'KeyP':
        $(document).trigger('pause')
        break;
      case 'KeyN':
        $(document).trigger('restart')
        break;
    }

    updateStats(game)
  })
}

function placeSnake (snake) {
  snake.positions.forEach(
    (pos) => {
      selectCell(pos).addClass('snake').css('background-color', snake.color)
    }
  )
  selectCell(snake.head()).addClass('head')
  selectCell(snake.tail()).addClass('tail')
}

function placeFood (food) {
  selectCell(food.position)
    .addClass('food')
    .css('background-color', food.color);
}

function randomPosition (width, height, exclude = []) {
  const pos = [randomInteger(0, width), randomInteger(0, height)];

  for (let i = 0; i < exclude.length; i++) {
    if (pos[0] === exclude[i][0] && pos[1] === exclude[i][1])
      return randomPosition(width, height, exclude)
  }

  return pos
}

function willEat (snake, food) {
  return snake.head()[0] + snake.direction[0] === food.position[0] &&
    snake.head()[1] + snake.direction[1] === food.position[1]
}

function eat (snake, food) {
  selectCell(snake.head()).removeClass('head')
  snake.color = food.color;
  snake.positions.push(food.position);
  selectCell(snake.head()).removeClass('food').addClass('head')
  placeSnake(snake)

  $(document).trigger('eaten')
}

function moveSnake (snake) {
  selectCell(snake.head()).removeClass('head')

  const newHead = [snake.head()[0] + snake.direction[0], snake.head()[1] + snake.direction[1]];

  selectCell(snake.tail()).removeClass('snake').removeClass('tail').css('background-color', '')
  selectCell(newHead).addClass('snake').addClass('head').css('background-color', snake.color)

  snake.positions.shift();
  selectCell(snake.tail()).addClass('tail')
  snake.positions.push(newHead);
}

function generateNewFood (snake, food) {
  food.position = randomPosition(FIELD_WIDTH, FIELD_HEIGHT, snake.positions);
  food.color = FOOD_COLORS[randomInteger(0, FOOD_COLORS.length)];

  return food;
}

function makeGameStep (game) {
  if (willEat(game.snake, game.food)) {
    eat(game.snake, game.food);
    placeFood(generateNewFood(game.snake, game.food));
  } else {
    moveSnake(game.snake);
  }

  updateStats(game)
}

function updateStats (game) {
  const pad = obj => obj.toString().padStart(8, ".")

  $('#eaten-count').text(pad(game.getEatenCount()))
  $('#velocity').text(pad(game.velocity().toFixed(2)))
  $('#snake-location').text(pad(game.snake.head()))
  $('#food-location').text(pad(game.food.position))
  $('#direction').text(pad(directionString(game.snake.direction)))
}

function clearKeypressHandlers () {
  $(document).off('keydown')
}

function restartGame () {
  clearKeypressHandlers();
  clearField(FIELD_WIDTH, FIELD_HEIGHT);
  let snake = initialSnake(FIELD_WIDTH, FIELD_HEIGHT);
  let food = generateNewFood(snake, {})
  let eatenCount = 0;
  let velocity = 1.0

  placeSnake(snake);
  placeFood(food);

  const game = {
    snake: snake,
    food: food,
    getEatenCount: () => eatenCount,
    incrementEatenCount: () => {
      eatenCount++;
      velocity *= 1.05
    },
    velocity: () => velocity
  }

  setupKeypressHandlers(game);
  updateStats(game)

  return game
}

function pause (runner) {
  if (runner) clearInterval(runner);
}

function runGame (game, previousRunner) {
  if (previousRunner) clearInterval(previousRunner);

  return setInterval(
    () => makeGameStep(game),
    100 / game.velocity()
  )
}

$(document).ready(
  function () {
    initEmptyField(FIELD_WIDTH, FIELD_HEIGHT);
    setupAutomaticFieldSizing(FIELD_WIDTH, FIELD_HEIGHT);

    let runner;
    let game = restartGame();
    let isPaused = false;

    $(document).on(
      'restart',
      () => {
        pause(runner)
        game = restartGame();
        if (isPaused) return;
        runner = runGame(game);
      }
    )

    $(document).on(
      'eaten',
      () => {
        game.incrementEatenCount();
        runner = runGame(game, runner);
      }
    )

    $(document).on(
      'pause',
      () => {
        if (isPaused) {
          runner = runGame(game)
        } else {
          pause(runner)
        }
        isPaused = !isPaused
      }
    )

    runner = runGame(game)
  }
)

