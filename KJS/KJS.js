var express = require('express'),
	path = require('path'),
	app = express(),
	fs = require('fs');

// Server Logic
app.use(express.static(__dirname + '/static'));
app.use(express.static(__dirname + '/projects'));

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// Routes
// TODO: Route every app with base template
app.get('/', function (req, res) {
	res.render('index', { project_list: project_list } );
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
					});
				}
			})
		})
	});
}

// TODO: Sort by create date?


app.listen(80, function () {
	console.log('KJS Server started');
});
