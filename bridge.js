var osc = require('node-osc');
var io = require('socket.io')(8081);


var oscServer, oscClient;

var isConnected = false;

io.sockets.on('connection', function (socket) {
	console.log('connection');
	socket.on("config", function (obj) {
		isConnected = true;
    	oscServer = new osc.Server(obj.server.port, obj.server.host);
	    oscClient = new osc.Client(obj.client.host, obj.client.port);
	    oscClient.send('/status', socket.sessionId + ' connected');
		oscServer.on('message', function(msg, rinfo) {
			socket.emit("message", msg);
		});
		socket.emit("connected", 1);
	});
 	socket.on("message", function (obj) {
		oscClient.send.apply(oscClient, obj);
  	});
	socket.on('disconnect', function(){
		if (isConnected) {
			oscServer.kill();
			oscClient.kill();
		}
  	});
});

var express = require('express');
var socket = require('socket.io');
var port = process.env.PORT || 3000;
var app = express();
var server = app.listen(port);

app.use(express.static('public')); 

var io = socket(server);

io.sockets.on('connection', newConnection);

function newConnection(socket){
	console.log('new connection' + socket.id);

	socket.on('mouse', mouseMsg);

	function mouseMsg(data){
	    socket.broadcast.emit('mouse', data);
	    //io.sockets.emit(mouse, data)
		console.log(data)
	}
}