###
 *
 *  Hi there, have a look at my source files here:
 *  https://github.com/stefanRitter/
 * 
###

window.hair = (canvas) ->
  "use strict"

  # globals
  context = canvas.getContext('2d')
  allLines = []
  framerate = 24
  lineDensity = 14
  linelength = 40
  interval = null
  animLength = framerate*3


  # agents
  class LineElement

    constructor: (@x, @y, noise, @color = '#000000') ->
      @rotate = noise * 360 * Math.PI/180
      @difference = 0
      @count = animLength+1 #no animation
      @colorfactor = 0

    draw: ->
      context.save()

      context.setTransform(1,0,0,1,0,0) #reset matrix
      context.translate(@x, @y)

      if @count < animLength
        @rotate += @difference
        @count++
        @color = "rgb(#{@colorfactor-@count*2}, 0, 0)"

        if @count >= Math.floor((Math.random() * animLength) + 2*animLength/3)
          handleClick { clientX: Math.floor(Math.random() * canvas.width), clientY: Math.floor(Math.random() * canvas.height) }

      context.rotate(@rotate) 

      context.strokeStyle = @color
      context.lineWidth = 1

      context.beginPath()
      context.moveTo 0, 0 #rotation defines start point
      context.lineTo(linelength,0)
      context.stroke()
      context.closePath()

      context.restore()


  # draw all lines
  draw = (x = 0, y = 0, dx = canvas.width, dy = canvas.height) ->
    context.clearRect(x, y, dx, dy)

    for line in allLines when x <= line.x <= (x+dx) and y <= line.y <= (y+dy)
      line.draw()

    if allLines[0].count >= animLength
        clearInterval(interval) if interval != null
        interval = null


  handleClick = (event) ->
    range = canvas.width/8
    clientY = event.clientY
    clientX = event.clientX

    for line in allLines 
      rotX = (line.x - clientX)
      rotY = (line.y - clientY)
      factor = Math.atan2(rotX, rotY) * 360 * Math.PI/180 #instead of orienting towards the mouse over-rotate each line to create flower effect

      difference = factor - line.rotate

      line.difference = difference / animLength
      line.count = 0
      
      # radially go red and back to black
      closedist = rotX*rotX + rotY*rotY # radial distance from mouse: if closedist < (range * range)
      line.colorfactor = parseInt 255 - (closedist/600)

    # start animation
    clearInterval(interval) if interval != null
    interval = setInterval( ->
          draw()
        , 1000/framerate)


  # resize & initialize
  doResize = ->
    clearInterval(interval) if interval != null
    interval = null

    canvas.width = document.body.clientWidth
    canvas.height = document.body.clientHeight
    allLines = []

    xstart = Math.floor(Math.random() * 11)
    xnoise = xstart
    ynoise = Math.floor(Math.random() * 11)

    for y in [0..canvas.height] by lineDensity
      ynoise += 0.1
      xnoise = xstart
      for x in [0..canvas.width] by lineDensity
        xnoise += 0.1
        allLines.push new LineElement(x, y, Math.random())

    draw()


  handleKey = (event) ->
    if event.keyCode == 27 # 27 = ESC
      clearInterval(interval) if interval != null
      interval = null


  # play demo for user
  demo = () ->

    randX = Math.floor(Math.random() * (canvas.width - canvas.width/4 + 1)) + canvas.width/8
    randY = Math.floor(Math.random() * (canvas.height - canvas.height/4 + 1)) + canvas.height/8

    context.fillStyle = '#CC0E5A'
    context.font = 'italic 3em EB Garamond serif'
    context.fillText("click!", randX, randY)

    setTimeout( ->
        handleClick({clientX: randX, clientY: randY})
      , 800)


  # start the show
  window.addEventListener('resize', doResize, false)
  window.addEventListener('keyup', handleKey, false)
  canvas.addEventListener('click', handleClick, false)

  doResize()

  header = document.getElementsByTagName('header')
  header[0].style.background = 'transparent'

  # wait for canvas fade-in then show demo
  setTimeout( ->
      demo()
    , 1900)

