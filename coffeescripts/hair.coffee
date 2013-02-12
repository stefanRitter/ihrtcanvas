###
 *
 *  Hi there, have a look at my source files here:
 *  https://github.com/stefanRitter/
 * 
 *
###

window.hair = (canvas) ->
  "use strict"

  # globals
  canvas.width = document.body.clientWidth
  canvas.height = document.body.clientHeight
  context = canvas.getContext('2d')
  allLines = []
  framerate = 30
  linecount = 10
  linelength = 40

  # agents
  class LineElement

    constructor: (@x, @y, @noise, @color = '#000000') ->

    draw: ->
      context.save()

      context.setTransform(1,0,0,1,0,0) #reset matrix
      context.translate(@x, @y)
      context.rotate(@noise * 360 * Math.PI/180)

      context.strokeStyle = @color
      context.lineWidth = 1

      context.beginPath()
      context.moveTo 0, 0
      context.lineTo(linelength,0)
      context.stroke()
      context.closePath()

      context.restore()

  # Perlin noise after Ken Perlin, NYU
  perlinNoise = (x, y, z = 0) ->
    Math.random()

  # draw all lines
  draw = (x = 0, y = 0, dx = canvas.width, dy = canvas.height) ->
    context.clearRect(x, y, dx, dy)

    for line in allLines when x <= line.x <= (x+dx) and y <= line.y <= (y+dy)
      line.draw()

  handleClick = (event) ->
    range = canvas.width/8

    closest = (line for line in allLines when (line.x - event.clientX)*(line.x - event.clientX) + (line.y - event.clientY)*(line.y - event.clientY) < (range * range))

    for line in closest 
      line.color = '#CC0E5A'
      line.noise = 0.375 # 1 >> 360deg, 0 >> 0deg, 0.5 = 180deg

    draw()

  # initialize
  xstart = Math.floor(Math.random() * 11)
  xnoise = xstart
  ynoise = Math.floor(Math.random() * 11)

  for y in [0..canvas.height] by linecount
    ynoise += 0.1
    xnoise = xstart
    for x in [0..canvas.width] by linecount
      xnoise += 0.1
      allLines.push new LineElement(x, y, perlinNoise(xnoise, ynoise))

  canvas.addEventListener('click', handleClick, false)

  draw()

