const first = require("util");

exports.index = function(req, res) {
	first();
	res.send('Hello, world!'); 
}