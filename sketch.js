let knife, ground, roof, wall1, wall2;
let wall3, wall4
let carrot
var slices = []
var minislices = []
var miniminislices = []
var rotater
var chopsound
var backing = false
var movesound
var popsound
var carrots = 0
var chops = 0
var spawns = floor(random() * 9) + 3
var minispawns = floor(random() * 4) + 2
var miniminispawns = floor(random() * 4) + 2
var green = 0
var bonus
var time
var instructions = "drag your mouse to move the knife and chop the carrots. when all carrots are chopped, carrots are placed into soup."

function setup() {
	//@ts-ignore
    new Canvas(1440, 773);
	world.gravity = {x: 0, y:10}
    var a = createButton("Respawn knife")
    a.position(0, 0)
    a.mousePressed(resetKnife)
	ground = new Sprite(width/2, height, width*5, 50, "k")
	roof = new Sprite(width/2, 0, width*5, 50, "k")
	wall1 = new Sprite(0, height/2, 50, height*5, "k")
	wall3 = new Sprite(0, height/2, 50, height*5, "k")
	wall2 = new Sprite(width, height/2, 50, height*5, "k")
	wall4 = new Sprite(width, height/2, 50, height*5, "k")
    carrot = new Sprite(width/2, height/2, 1008, 387, "k")
    carrot.image = loadImage("carrot.png")
    knife = new Sprite(100, 100, 803, 360)
    knife.image = loadImage("knife.jpg")
    knife.scale = 0.1
    chopsound = loadSound("chop.mp3")
    movesound = loadSound("moving.mp3")
    popsound = loadSound("pop.mp3")
    bonus = 4
    spawns = Math.floor(random() * 6) + bonus + 2
    minispawns = Math.floor(random() * 4) + bonus
    miniminispawns = Math.floor(random() * 4) + bonus
    instructions = "drag your mouse to move the knife and chop the carrots. when all carrots are chopped, carrots are placed into soup."
    time = 0
}
function draw() {
    frameRate(30)
    if (time >= 30 && (carrots + chops*2)/time < 10) {
        instructions = "you've been fired!"
        allSprites.forEach(s => s.remove())
    }
    else if (!backing) {
        time += 1/60
    }
    bonus = 2
    frameRate(60)
    if (green != 0) green -= 0.5
    clear();
    text(`${instructions}\n\ntime: ${Number.parseFloat(time).toFixed(2)}\ncarrots in soup: ${carrots}\nchops: ${chops}\nscore: ${carrots} + ${chops} * 2\nfinal score: ${carrots + chops*2}\nefficiency: ${Number.parseFloat((carrots + chops*2)/time).toFixed(2)} points/second`, width/2, height/2)
    textSize(18);
    textAlign(CENTER);
    fill(200 -  green*4, 200 + green, 200 - green*4);
    allSprites.forEach(s => {
        if (s.x > width + 500 || s.y > height + 500) {
            if (s != ground && s != wall1 && s != wall2 && s != roof && s != knife && !backing) {
                s.remove() 
                popsound.play()
                carrots ++
                green = 55
            }
        }
    })
    if (time >= 30) {instructions = "drag your mouse to move the knife and chop the carrots. when all carrots are chopped, carrots are placed into soup. \nif you fall below 10 points/second, you'll get fired!"}
    else {instructions = "drag your mouse to move the knife and chop the carrots. when all carrots are chopped, carrots are placed into soup. \nif you fall below 10 points/second after 30 seconds, you'll get fired!"}
    if (miniminislices.length == spawns*minispawns*miniminispawns) {
        instructions = "placing carrots in soup..."
        if (!movesound.isPlaying()) {
            movesound.play()
        }
        ground.y += 5
        roof.y += 5
    }
    if (roof.y > height*2) {
        miniminislices = []
        minislices = []
        slices = []
        backing = true
        spawns = floor(random() * 9) + bonus + 2
        minispawns = floor(random() * 4) + bonus
        miniminispawns = floor(random() * 4) + bonus
        for (var i = 0 ; i != spawns; i++) {
            var slice = new Sprite(random() * width, random() * height + 2*height)
            slice.diameter = 400
            slice.image = "carrot slice.png"
            slice.scale = 0.54
            slices.push(slice)
        }
    }
    if (backing) {
        instructions = "spawning new carrots..."
        if (!movesound.isPlaying()) {
            movesound.play()
        }
        ground.y -= 5
        roof.y -= 5
        if (roof.y <=0) {
            backing = false
            movesound.stop()
        }
    }
    if (minislices.length != 0) {
        minislices.forEach(ms => {
            if (ms.collides(knife)) {
                chopsound.play(); chops++; green = 55
                ms.x = 23344
                for (var i = 0; i != miniminispawns; i++) {
                    var slice = new Sprite(random() * width, random() * height)
                    slice.diameter = 400
                    slice.image = "carrot slice.png"
                    slice.scale = 0.14
                    miniminislices.push(slice)
                }
            }
        })
    }
    if (slices.length != 0 && !backing) {
        slices.forEach(s => {
            if (s.collides(knife)) {
                chopsound.play(); chops++; green = 55
                s.x = 23344
                for (var i = 0; i != minispawns; i++) {
                    var slice = new Sprite(random() * width, random() * height)
                    slice.diameter = 400
                    slice.image = "carrot slice.png"
                    slice.scale = 0.29
                    minislices.push(slice)
                }
            }
        })
    }
    if (carrot.collides(knife)) {
        carrot.x = 23984
        for (var i = 0; i != spawns; i++) {
            chopsound.play(); chops++; green = 55
            var slice = new Sprite(random() * width, random() * height)
            slice.diameter = 400
            slice.image = "carrot slice.png"
            slice.scale = 0.54
            slices.push(slice)
        }
    }
    //@ts-ignore
    if (mouse.dragging()) {
		//@ts-ignore
        knife.moveTowards(mouse); 
    }
}


function resetKnife() {
    knife.x = 100;
    knife.y = 100
}