var http = require('http');
var fs = require('fs');
var ws = require('ws');

var server = http.createServer(function(req, res) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	try{
		res.end(fs.readFileSync("."+req.url));
	} catch(e) {
		res.end(fs.readFileSync('index.html'));
	}
});

var wss = new ws.Server({server:server});

var connections = [];
wss.on('connection', function(ws) {
	connections.push(ws);
	ws.on('message', function(jsonStr) {
		var obj = JSON.parse(jsonStr);
		connections.forEach(function(con, i) {
			if (ws != con) {
				con.send(jsonStr);
			}
		});
	});
	ws.on('close', function() {
		connections = connections.filter(function(conn, i) {
			return (conn === ws) ? false : true;
		});
	});
});
server.listen(3000);
