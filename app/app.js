var express = require('express');

// Create express application
var app = express.createServer();

// Get configuration : call looks like : node app.js KEY=1234 SECRET=123456
var cfg =
{
    trello: 
    {
        key : process.argv[2].substring(4),
        secret : process.argv[3].substring(7)
    }
};

console.log(cfg);

// Configuration
app.configure(function () {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});


// basic routes
app.get('/', function (req, res) {
    res.render('index');
});
app.get('/test', function (req, res) {
    res.send('lolol');
});

// start listening
app.listen('9090');