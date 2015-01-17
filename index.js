var express = require('express');
    app = express();

// Load static file
app.use(express.static("webapp"));
app.use('/script', express.static("/webapp/script"));
// 404 NOT FOUND
app.use(function(req, res, next){
  res.send(404, 'Sorry cant find that!');
});
// ANOTHER ERROR HANDLING
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.send(500, 'Something broke!');
});

// Basic Routing
app.get('/', function (req, res) {
  res.send('Hello World!')
  // res.sendfile(__dirname, "/" + filename);
})

// Listen
var server = app.listen(3000, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('Example app listening at http://%s:%s', host, port)
})
