var express = require('express');
var app = express();
var userId = 2148004;
var redirectRoot = 'http://joshstrange.com';

app.set('view engine', 'ejs');
app.set('views', __dirname);

app.get('/', function (req, res) {
	res.redirect(redirectRoot);
});

app.get('/:image', function (req, res) {
	var imageUrl = 'https://dl.dropboxusercontent.com/u/' + userId + '/Screenshots/' + req.params.image + (req.params.image.indexOf('.png') === -1 ? '.png' : '');
	if(req.headers.accept.indexOf('image/webp') === 0) {
		//If we are being asked for an image first and foremost send them to DB
		res.redirect(imageUrl);
	} else {
		res.render('index.ejs', {
			imageUrl: imageUrl
		});
	}
});

var server = app.listen(19910, function () {

	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port)
});
