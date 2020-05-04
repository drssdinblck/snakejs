function randomInteger (min, max) {
  return Math.floor(min + (max - min) * Math.random())
}

function positions (object) {
  return object.positions || [object.position]
}

function randomPosition (width, height, exclude = []) {
  const pos = [randomInteger(0, width), randomInteger(0, height)];

  for (let i = 0; i < exclude.length; i++) {
    if (pos[0] === exclude[i][0] && pos[1] === exclude[i][1])
      return randomPosition(width, height, exclude)
  }

  return pos
}

function positionOneStepInDirection (position, direction) {
  return [position[0] + direction[0], position[1] + direction[1]];
}
