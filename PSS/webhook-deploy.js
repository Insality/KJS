var http = require('http');
var createHandler = require('github-webhook-handler');
var handler = createHandler({ path: '/webhook', secret: 'AwesomeSecretHook' });

var sys = require('sys');
var exec = require('child_process').exec;
var deployCommand = "bash /home/PSS/deploy.sh >> /home/PSS/deploy.log";

function puts(error, stdout, stderr) { sys.puts(stdout) };

http.createServer(function (req, res) {
  handler(req, res, function (err) {
    res.statusCode = 404
    res.end('no such location')
  })
}).listen(7777)

handler.on('error', function (err) {
  console.error('Error:', err.message)
})

handler.on('push', function (event) {
  console.log('Received a push event for %s to %s',
    event.payload.repository.name,
    event.payload.ref);

  var parsed = event.payload.ref.split("/");
  var branchName = parsed[parsed.length-1];

  if (branchName == "deploy") {
    // call update script
    exec(deployCommand, puts);
  }
})