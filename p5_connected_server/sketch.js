//python -m http.server
//node bridge.js in master folder

//movement to start/stop video/playback speed A LA arcade fire
//something with flashing colors
//only play if presented with red color

var pagex;
var pagey;
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
var sunimg;
var mouthx;
var mouthy;

var curtain;

var newcolor;
var nighttime;
var compcolor;

var sunpos;
var sunvel;
var sunaccel;

var txt2;
var txt3;
var txt4;
var txt6;
var txt8;
var txt9;
var txt15;
var txt17;
var txt19;
var txt22;
var txt28;


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
	sunimg = loadImage('data/sunart.png');
	curtain = loadImage('data/curtain.png');
}

function setup() {
	pagex = windowWidth;
	pagey = windowHeight;
  	createCanvas(pagex, pagey);
	setupOsc(8338, 3334);
	pixelDensity(1);
	mCapture = createCapture(VIDEO);
	mCapture.size(capx,capy);
	mCapture.hide();

	nighttime=0;


	sunobject = new sunobj(0,400);

}

function sunfunc(){
	sunstatus = !sunstatus;
}

function draw() {
	mCapture.loadPixels();	
	
	var r1 = mCapture.get(80,80)[0]
	var r2 = mCapture.get(90,80)[0]
	var r3 = mCapture.get(80,90)[0]
	var r4 = mCapture.get(70,80)[0];
	var r5 = mCapture.get(80,70)[0];
	var r = (r1+r2+r3+r4+r5)/5;

	var g1 = mCapture.get(80,80)[1]
	var g2 = mCapture.get(90,80)[1]
	var g3 = mCapture.get(80,90)[1]
	var g4 = mCapture.get(70,80)[1];
	var g5 = mCapture.get(80,70)[1];
	var g = (g1+g2+g3+g4+g5)/5;

	var b1 = mCapture.get(80,80)[2]
	var b2 = mCapture.get(90,80)[2]
	var b3 = mCapture.get(80,90)[2]
	var b4 = mCapture.get(70,80)[2];
	var b5 = mCapture.get(80,70)[2];
	var b = (b1+b2+b3+b4+b5)/5;

	newcolor = [r,g,b];
	

	// 33-98;
	var bval = map(sun.currentTime(),0,sun.duration(),33,98);
	var finalcolor = 'hsb(191, 28%,'+bval.toString()+'%)';
	background(finalcolor)
	fill(newcolor);
	noStroke();
	rect(pagex/2-250, 0, 500, pagey)
	
	//webcam image
	image(mCapture, pagex/2-capx/2, 420, capx, capy);

	push();
	colorMode(HSB,1)
	var hsbcolor = RGBtoHSB(newcolor[0],newcolor[1],newcolor[2]);
	var shift = hsbcolor[0]+0.5
	if(shift>1){
		shift = hsbcolor[0]+0.5 - 1;
	}
	compcolor = [shift,hsbcolor[1],hsbcolor[2]]

	fill(compcolor);
	rect(pagex/2-capx/2, 420+capy, capx,30);

	peacesign((pagex/2-250)/3,200);
	peacesign(2*(pagex/2-250)/3,600);
	peacesign((pagex/2+320),100);
	peacesign((pagex/2+570),400);

	pop();

	



	if(nighttime>8){
		image(curtain,pagex/2-capx/2, 420+5,103+(nighttime-10)*3,231);
		image(curtain,pagex/2-capx/2+capx, 420+5,-1*(103+(nighttime-10)*3),231);
	}
	
	push();
	translate(pagex/2-capx/2, 420);
	noFill();
	strokeWeight(3);
	stroke('black');
	ellipse(position.x/2-30, position.y-165, 40, 40);
	ellipse(position.x/2+30, position.y-165, 40, 40);
	line(position.x/2-10, position.y-170, position.x/2+10, position.y-170)
	pop();
	
	mouthx = position.x/2;
	mouthy = (position.y+40+mouthHeight)/2;

	//mouthtracking test
	// push();
	// translate(pagex/2-capx/2, 430);
	// fill('red');
	// ellipse(mouthx,mouthy,5,5);
	// pop();


	//playing/pausing song
	if(mouthHeight>4 && !sun.isPlaying()){
		sun.play();
	}
	if(mouthHeight<=4 && sun.isPlaying()){
		sun.pause();
	}


	//sun progression across sky
	if(eyebrowRight>8){
		sunobject.display();
		sunobject.move();
	}


	////////////////////////////LYRICS//////////////////////////
	if(sun.currentTime()>2){
		if(sun.currentTime()<2.5){
			txt2 = new textobj(mouthx,mouthy, "here comes");
		}
		txt2.display();
		txt2.move();
	}
	if(sun.currentTime()>3){
		if(sun.currentTime()<3.5){
			txt3 = new textobj(mouthx,mouthy, "the sun");
		}
		txt3.display();
		txt3.move();
	}
	if(sun.currentTime()>4){
		if(sun.currentTime()<4.5){
			txt4 = new textobj(mouthx,mouthy, "doo doo doo doo");
		}
		txt4.display();
		txt4.move();
	}


	if(sun.currentTime()>6){
		if(sun.currentTime()<6.5){
			txt6 = new textobj(mouthx,mouthy, "here comes the sun");
		}
		txt6.display();
		txt6.move();
	}

	
	if(sun.currentTime()>8){
		if(sun.currentTime()<8.5){
			txt8 = new textobj(mouthx,mouthy, "and I say");
		}
		txt8.display();
		txt8.move();
	}

	if(sun.currentTime()>9.5){
		if(sun.currentTime()<10){
			txt9 = new textobj(mouthx,mouthy, "it's alright");
		}
		txt9.display();
		txt9.move();
	}

	if(sun.currentTime()>15.3){
		if(sun.currentTime()<15.9){
			txt15 = new textobj(mouthx,mouthy, "here comes the sun");
		}
		txt15.display();
		txt15.move();
	}

	if(sun.currentTime()>17.3){
		if(sun.currentTime()<17.8){
			txt17 = new textobj(mouthx,mouthy, "doo doo doo doo");
		}
		txt17.display();
		txt17.move();
	}

	if(sun.currentTime()>19){
		if(sun.currentTime()<19.5){
			txt19 = new textobj(mouthx,mouthy, "here comes the sun");
		}
		txt19.display();
		txt19.move();
	}


	if(sun.currentTime()>22.3){
		if(sun.currentTime()<22.6){
			txt22 = new textobj(mouthx,mouthy, "it's alright");
		}
		txt22.display();
		txt22.move();
	}

	if(sun.currentTime()>28.4){
		if(sun.currentTime()<28.8){
			txt28 = new textobj(mouthx,mouthy, "it's alright");
		}
		txt28.display();
		txt28.move();
	}
	


//////////////////////////////////////////////////////////////////////////////

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
		// print(scale);
	}
	else if (address == '/pose/orientation') {
		orientation = {x:value[0], y:value[1], z:value[2]};
		// print(orientation);
	}
	else if (address == '/gesture/mouth/width') {
		mouthWidth = value[0];
		// print(mouthWidth);
	}
	else if (address == '/gesture/mouth/height') {
		mouthHeight = value[0];
		// print(mouthHeight);
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
		// print(eyeLeft)
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
		if(msg.length==3){
			nighttime+=1;
		}
		else{
			nighttime=0;
		}
		if (msg[0] == '#bundle') {
			for (var i=2; i<msg.length; i++) {
				receiveOsc(msg[i][0], msg[i].splice(1));
			}
		} else {
			receiveOsc(msg[0], msg.splice(1));
		}
	});
}

//////////////////////////////////////////////////////////////////////////////////////////

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
		image(sunimg,this.loc.x,this.loc.y,sunimg.width/2,sunimg.height/2);
		// fill('yellow');
		// noStroke();
		// ellipse(this.loc.x,this.loc.y,80,80);
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

class textobj{
    constructor(tempX,tempY,tempText){
        this.x=tempX;
        this.y=tempY;
        this.txt = tempText;
	}

	display(){
		push();
		translate(pagex/2-capx/2, 420);
		textAlign(CENTER);
		textSize(18)
		colorMode(HSB,1);
		fill(compcolor);
		text(this.txt,this.x,this.y);
		pop();
	}
	
	move(){
		this.x = this.x + random(-8, 8);
		this.y = this.y - 10;

	}

}

// FROM java.awt.Color
function RGBtoHSB(red, green,blue){
	array = [3];
	// Calculate brightness.
	var min;
	var max;
	if (red < green){
		min = red;
		max = green;
	}
	else
	{
		min = green;
		max = red;
	}
	if (blue > max){
		max = blue;
	}
		
	else if (blue < min){
		min = blue;
	}
	
	array[2] = max / 255;

	// Calculate saturation.
	if (max == 0){
		array[1] = 0;
	}
	else{
		array[1] = ((max - min)) / (max);
	}
	
	// Calculate hue.
	if (array[1] == 0){
		array[0] = 0;
	}
	
	else
	{
		var delta = (max - min) * 6;
		if (red == max){
			array[0] = (green - blue) / delta;
		}
		
		else if (green == max){
			array[0] = 1/ 3 + (blue - red) / delta;
		}
		
		else{
			array[0] = 2/ 3 + (red - green) / delta;
		}
		
		if (array[0] < 0){
			array[0]++;
		}
		
	}
	return array;
}


function peacesign(px,py){
	push();
	noFill();
	stroke(compcolor);
	strokeWeight(6);
	translate(px,py);
	ellipse(0,0,100,100);
	line(0,0,35,35)
	line(0,0,-35,35)
	line(0,-50,0,50);
	pop();
}
