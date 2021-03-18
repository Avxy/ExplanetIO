const express = require('express');
const app = express();
const path = require('path')
const jsdom = require("jsdom");
const { JSDOM } = jsdom
const { window } = new JSDOM(`...`);
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname,'public_html/blockland'))

app.use(express.static('public_html/blockland'));
app.use(express.static('public_html/libs'));
// app.use(express.static('public_html/blockland/v3'));
app.get('/',function(req, res) {
    res.render('index');
});
app.get('/broadcast', (req, res)=>{
	var body = req.body
	res.render('broadcast', {body:body})
})

let broadcaster

///////////// Nik Code //////////////////////
io.sockets.on('connection', function(socket){
	socket.userData = { x:0, y:0, z:0, heading:0 };//Default values;
 
	console.log(`${socket.id} connected`);
	socket.emit('setId', { id:socket.id });
	
    socket.on('disconnect', function(){
		socket.broadcast.emit('deletePlayer', { id: socket.id });
    });	
	
	socket.on('init', function(data){
		console.log(`socket.init ${data.model}`);
		socket.userData.model = data.model;
		socket.userData.colour = data.colour;
		socket.userData.x = data.x;
		socket.userData.y = data.y;
		socket.userData.z = data.z;
		socket.userData.heading = data.h;
		socket.userData.pb = data.pb,
		socket.userData.action = "Idle";
	});
	
	socket.on('update', function(data){
		socket.userData.x = data.x;
		socket.userData.y = data.y;
		socket.userData.z = data.z;
		socket.userData.heading = data.h;
		socket.userData.pb = data.pb,
		socket.userData.action = data.action;
	});
	
	socket.on('chat message', function(data){
		console.log(`chat message:${data.id} ${data.message}`);
		io.to(data.id).emit('chat message', { id: socket.id, message: data.message });
	})
///////////////////////////////////////////////
	socket.on("broadcaster", () => {
		broadcaster = socket.id;
		socket.broadcast.emit("broadcaster");
	  });
	  socket.on("watcher", () => {
		socket.to(broadcaster).emit("watcher", socket.id);
	  });
	  socket.on("disconnection", () => {
		socket.to(broadcaster).emit("disconnectPeer", socket.id);
	  });

	  socket.on("offer", (id, message) => {
		socket.to(id).emit("offer", socket.id, message);
	});
	socket.on("answer", (id, message) => {
	  socket.to(id).emit("answer", socket.id, message);
	});
	socket.on("candidate", (id, message) => {
	  socket.to(id).emit("candidate", socket.id, message);
	});
});

http.listen(process.env.PORT||8080, function(){
  console.log('listening on *:8080');
});
////////////////////////// Nik Code ///////////////////////
setInterval(function(){
	const nsp = io.of('/');
    let pack = [];
	
    for(let id in io.sockets.sockets){
        const socket = nsp.connected[id];
		//Only push sockets that have been initialised
		if (socket.userData.model!==undefined){
			pack.push({
				id: socket.id,
				model: socket.userData.model,
				colour: socket.userData.colour,
				x: socket.userData.x,
				y: socket.userData.y,
				z: socket.userData.z,
				heading: socket.userData.heading,
				pb: socket.userData.pb,
				action: socket.userData.action
			});    
		}
    }
	if (pack.length>0) io.emit('remoteData', pack);
}, 40);
 
////////////////////////////////////////////////////////////////