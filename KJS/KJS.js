var express = require('express'),
	path = require('path'),
	fs = require('fs'),
	app = express(),
	config = require('./config');
	
// Server Logic
if (!config["production"]) {
	app.use(express.static(__dirname + '/static'));
	app.use(express.static(__dirname + '/projects'));
}

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// Routes
// TODO: Route every app with base template
app.get('/', function (req, res) {
	res.render('projects', { project_list: project_list } );
});

// KJS Logic: 
var project_list = [];
collectData();

function collectData() {
	var project_path = path.join(__dirname, "/projects");
	fs.readdir(project_path, function(err, items) {
		if (err) throw err;

		// iterate over dirs:
		items.forEach(function(item) {
			var config_path = path.join(project_path, "/" + item + "/config.js");

			fs.exists(config_path, function(isExist){
				if (isExist) {
					fs.readFile(config_path, 'utf8', function (err, data) {
						if (err) throw err;
						var config = JSON.parse(data);

						config["img_path"] = "/" + item + "/icon.png";
						config["link"] = item;
						project_list.push(config);

						project_list.sort(function(a, b) {
							return (new Date(a["create_date"]) - new Date(b["create_date"])) < 0;
						})
						console.log("Added app: " + item);

						app.get('/'+item, function (req, res) {
							res.render('../projects/' + item + '/' + item);
						})
					});
				}
				/* else {
					var index_path = path.join(project_path, "/" + item + "/index.html");
					fs.exists(index_path, function(isExist){
						if (isExist) {
							app.get('/'+item, function (req, res) {
								res.render('../projects/' + item + '/index.html');
							});
							console.log("Added hided app: " + item);
						}
					})
				}*/
			})
		})
	});
}

app.listen(8081, '127.0.0.1', function () {
	console.log('KJS Server started');
});
