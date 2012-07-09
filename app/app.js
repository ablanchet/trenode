var express = require('express');
var Trello = require("node-trello");

// Create express application
var app = express.createServer();

// Get configuration : call looks like : node app.js KEY=1234 TOKEN=123456
var cfg =
{
    trello :
    {
        key: process.argv[2].substring(4),
        token: process.argv[3].substring(6)
    }
};

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

// get cards grouped by label
app.get('/cards/label/:label', function (req, res) {
    // get all cards
    // grouped by the req.params.label
});
// all cards
app.get('/cards/:type?', function (req, res) {
    var type = req.params.type;
    var t = new Trello(cfg.trello.key, cfg.trello.token);
    t.get('/1/members/my/cards', function (err, data) {
        if (err) throw err;
        var cards = data;

        if (typeof type != 'undefined') {
            if (type === 'date') {
                // get only the cards that have a due date
                cards = [];
                for (var i = 0; i < data.length; i++) {
                    var card = data[i];
                    if (card.badges.due !== null) cards.push(card);
                }
                console.log(cards);
            }
        }

        res.render('cards', { cards: cards });
    });
});

// start listening
app.listen('9090');