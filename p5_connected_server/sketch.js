//python -m http.server
//node bridge.js in master folder

//movement to start/stop video/playback speed A LA arcade fire
//something with flashing colors
//only play if presented with red color

var pagex = screen.width;
var pagey = screen.height;
var face = [];
var position = {x:0, y:0};
var scale = 0;
var orientation = {x:0, y:0, z:0};
var mouthWidth = 0;
var mouthHeight = 0;
var eyebrowLeft = 0;
var eyebrowRight = 0;
var eyeLeft = 0;
var eyeRight = 0;
var jaw = 0;
var nostrils = 0;
var mCapture;
var myimg;
var snap;
var capx = 320;
var capy = 240;
var sunstatus;

var newcolor;

var sunpos;
var sunvel;
var sunaccel;

// var radius = pagey/2;
// var angle = 0;
// var speed = 0.03;
// var centerX = pagex/2;
// var centerY = pagey/2;

var sun;
var sunobject;

function preload(){
	sun = loadSound('data/herecomesthesun.m4a');
	sun.setLoop(true);
}

function setup() {
  	createCanvas(pagex, pagey);
	setupOsc(8338, 3334);
	pixelDensity(1);
	mCapture = createCapture(VIDEO);
	mCapture.size(capx,capy);
	mCapture.hide();

	sunobject = new sunobj(0,400);

}

var go = false;

function sunfunc(){
	sunstatus = !sunstatus;
}

function draw() {
	mCapture.loadPixels();

	var r1 = mCapture.get(100,100)[0]
	var r2 = mCapture.get(110,100)[0]
	var r3 = mCapture.get(100,110)[0]
	var r4 = mCapture.get(90,100)[0];
	var r5 = mCapture.get(100,90)[0];
	var r = (r1+r2+r3+r4+r5)/5;

	var g1 = mCapture.get(100,100)[1]
	var g2 = mCapture.get(110,100)[1]
	var g3 = mCapture.get(100,110)[1]
	var g4 = mCapture.get(90,100)[1];
	var g5 = mCapture.get(100,90)[1];
	var g = (g1+g2+g3+g4+g5)/5;

	var b1 = mCapture.get(100,100)[2]
	var b2 = mCapture.get(110,100)[2]
	var b3 = mCapture.get(100,110)[2]
	var b4 = mCapture.get(90,100)[2];
	var b5 = mCapture.get(100,90)[2];
	var b = (b1+b2+b3+b4+b5)/5;

	newcolor = [r,g,b];

	// background('black');
	// 33-98;
	var bval = map(sun.currentTime(),0,sun.duration(),33,98);
	var finalcolor = 'hsb(191, 28%,'+bval.toString()+'%)';
	background(finalcolor)
	// fill(188, 216, 210);
	fill(newcolor);
	noStroke();
	rect(pagex/2-250, 0, 500, pagey)
	image(mCapture, pagex/2-capx/2, 430, capx, capy);

	

	// FACE_OUTLINE : 0 - 16
	// LEFT_EYEBROW : 17 - 21
	// RIGHT_EYEBROW : 22 - 26
	// NOSE_BRIDGE : 27 - 30
	// NOSE_BOTTOM : 31 - 35
	// LEFT_EYE : 36 - 41
	// RIGHT_EYE : 42 - 47
	// INNER_MOUTH : 48 - 59
	// OUTER_MOUTH : 60 - 65

	
	// var mouth = map(mouthHeight,0,12,1,10);
	var mouth = map(mouthWidth,14,20,1,5);
	var brow = map(eyebrowRight,6.6,10,0,255);
	// fill(brow,brow-25,0);
	// rect(position.x,position.y,100*mouth,100*mouth);

	if(mouthHeight>4 && !sun.isPlaying()){
		sun.play();
	}
	if(mouthHeight<=4 && sun.isPlaying()){
		sun.pause();
	}

	if(eyebrowRight>8){
		sunobject.display();
		sunobject.move();
	}


	// print(sun.currentTime());
}

function receiveOsc(address, value) {
	if (address == '/raw') {
		face = [];
		for (var i=0; i<value.length; i+=2) {
			face.push({x:value[i], y:value[i+1]});
		}
	}
	else if (address == '/pose/position') {
		position = {x:value[0], y:value[1]};
		// print(position);
	}
	else if (address == '/pose/scale') {
		scale = value[0];
	}
	else if (address == '/pose/orientation') {
		orientation = {x:value[0], y:value[1], z:value[2]};
	}
	else if (address == '/gesture/mouth/width') {
		mouthWidth = value[0];
		// print(mouthWidth);
	}
	else if (address == '/gesture/mouth/height') {
		mouthHeight = value[0];
		print(mouthHeight);
	}
	else if (address == '/gesture/eyebrow/left') {
		eyebrowLeft = value[0];
	}
	else if (address == '/gesture/eyebrow/right') {
		eyebrowRight = value[0];
		// print(eyebrowRight);
		// 6-9.8
	}
	else if (address == '/gesture/eye/left') {
		eyeLeft = value[0];
	}
	else if (address == '/gesture/eye/right') {
		eyeRight = value[0];
	}
	else if (address == '/gesture/jaw') {
		jaw = value[0];
	}
	else if (address == '/gesture/nostrils') {
		nostrils = value[0];
	}
}

function setupOsc(oscPortIn, oscPortOut) {
	var socket = io.connect('http://127.0.0.1:8081', { port: 8081, rememberTransport: false });
	socket.on('connect', function() {
		socket.emit('config', {	
			server: { port: oscPortIn,  host: '127.0.0.1'},
			client: { port: oscPortOut, host: '127.0.0.1'}
		});
	});
	socket.on('message', function(msg) {
		if (msg[0] == '#bundle') {
			for (var i=2; i<msg.length; i++) {
				receiveOsc(msg[i][0], msg[i].splice(1));
			}
		} else {
			receiveOsc(msg[0], msg.splice(1));
		}
	});
}

class sunobj{
    constructor(tempX,tempY){
        this.x=tempX;
        this.y=tempY;
        this.loc = createVector(tempX,tempY);
		this.vel = createVector(7,-8.36);
        this.accel = createVector(0,0.098);
	}

	display(){
		push();
		fill('yellow');
		noStroke();
		ellipse(this.loc.x,this.loc.y,80,80);
		pop();
	}
	
	move(){
		this.loc = this.loc.add(this.vel);
		this.vel = this.vel.add(this.accel);

		if(this.loc.x>pagex){
			this.loc.x=0;
			this.loc.y=400;
			this.vel = createVector(7,-9.36);
		}
	}

}