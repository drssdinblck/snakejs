function setupAutomaticFieldSizing (fieldWidth, fieldHeight) {
  styleAllCells(
    window.innerWidth,
    window.innerHeight - getHeaderHeight(),
    fieldWidth,
    fieldHeight
  )

  $(window).resize(function (event) {
    styleAllCells(
      event.target.innerWidth,
      event.target.innerHeight - getHeaderHeight(),
      fieldWidth,
      fieldHeight
    )
  })
}

function styleAllCells (availableWidth, availableHeight, fieldWidth, fieldHeight) {
  const minLength = Math.min(availableWidth, availableHeight)
  const width = 0.8 * minLength / fieldWidth
  const height = 0.8 * minLength / fieldHeight

  $('.cell').css(cellStyle(width, height))
}

function cellStyle (width, height) {
  return { width: `${Math.floor(width)}px`, height: `${Math.floor(height)}px` }
}

function getHeaderHeight () {
  return $('#head-container').outerHeight(true)
}
