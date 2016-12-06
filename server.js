var express= require('express');
var app= express();
var port= 3000;

app.listen(port, function(){
	console.log("App Started...");
});

app.get('/', function(req, res){
	res.send("Maintenance Tracker")
})