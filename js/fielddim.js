function setupAutomaticFieldSizing (fieldWidth, fieldHeight) {
  styleAllCells(
    window.innerWidth,
    window.innerHeight - getOuterContentHeight(),
    fieldWidth,
    fieldHeight
  )

  $(window).resize(function (event) {
    styleAllCells(
      event.target.innerWidth,
      event.target.innerHeight - getOuterContentHeight(),
      fieldWidth,
      fieldHeight
    )
  })
}

function styleAllCells (availableWidth, availableHeight, fieldWidth, fieldHeight) {
  const minLength = Math.min(availableWidth, availableHeight)
  const width = 0.9 * minLength / fieldWidth
  const height = 0.9 * minLength / fieldHeight

  $('.cell').css(cellStyle(width, height))
}

function cellStyle (width, height) {
  return { width: `${Math.floor(width)}px`, height: `${Math.floor(height)}px` }
}

function getOuterContentHeight () {
  return $('#head-container').outerHeight(true) + $('#stats').outerHeight(true)
}
