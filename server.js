// var http= require('http');

// function handleRequests(req, res){
// 	res.end('Hello World!');
// }

// var server= http.createServer(handleRequests);

// server.listen(3000, function(){
// 	console.log("Listening on port: 3000");
// });

var express= require('express');
var app= express();
var port= 3000;

app.listen(port, function(){
	console.log("App Started...");
});

app.get('/', function(req, res){
	res.send("Maintenance Tracker")
})