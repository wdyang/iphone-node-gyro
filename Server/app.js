var osc=require('node-osc');
var oscClient = new osc.Client('127.0.0.1', 9000);

var express = require('express'),
    http = require('http'),
    app = express(),
    server = http.createServer(app),
    io = require('socket.io').listen(server),
    path = require('path');

app.configure(function(){
  app.set('port', 8080);
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(path.join(__dirname, 'public')));
});

app.get('/', function (req, res) {
  res.sendfile('./public/index.html');
});

server.listen(app.get('port'));

io.sockets.on('connection', function (socket) {

  socket.on('move', function (data) {
    socket.broadcast.emit('move', data);
    console.log(data);
    var x=parseFloat(data.x);
    var y=parseFloat(data.y);
    var z=parseFloat(data.z);
    var w=parseFloat(data.w);
    var angle = w*y/Math.abs(y);
    if(angle<0) angle =angle + Math.PI * 2.0;
    console.log(angle*180/Math.PI);
    // console.log(x*x+y*y+z*z);
    // oscClient.send('/move', parseFloat(data.y), parseFloat(data.w),  parseFloat(data.z),  parseFloat(data.x));
    oscClient.send('/angle', angle*180/Math.PI);


    // http://en.wikipedia.org/wiki/Conversion_between_quaternions_and_Euler_angles
    // var x=data.x;
    // var y=data.y;
    // var z=data.z;
    // var w=data.w/2.0/Math.PI;
    // var phi=Math.atan(2.0*(w*x+y*z)/(1.0-2.0*(x*x+y*y)))*180/Math.PI;
    // var theta = Math.asin(2.0*(w*y-z*x))*180/Math.PI;
    // var psi=Math.atan(2.0*(w*z+x*y)/(1-2.0*(y*y+z*z)))*180/Math.PI;
    // console.log(Math.floor(phi), Math.floor(theta), Math.floor(psi));


  });

});

console.log('Gyro Server running on, port: ' + app.get('port'));
