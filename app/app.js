var express = require('express');
var oauth = require('oauth').OAuth;
var Trello = require("node-trello");

// Create express application
var app = express.createServer(); 
// Configuration
app.configure(function () {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.cookieParser());
    app.use(express.session({ secret: "keyboard cat" }));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

// Get configuration : call looks like : node app.js KEY=1234 TOKEN=123456
var cfg = {
    trello : {
        appkey: process.argv[2].substring(4),
        secret: process.argv[3].substring(7)
    }
};

var checkOAuth = function (req, res, next) {
    if (!req.session.oauth) {
        res.redirect('/oauth');
    }
    else next();
};

// OAuth configuration
var oa = new oauth(
    'https://trello.com/1/OAuthGetRequestToken',
    'https://trello.com/1/OAuthGetAccessToken',
    cfg.trello.appkey,
    cfg.trello.secret,
    '1.0',
    'http://localhost:9090/oauth/trello/callback',
    'HMAC-SHA1'
);
// oauth routes
app.get('/oauth', function (req, res) {
    oa.getOAuthRequestToken(function (error, oauth_token, oauth_token_secret, results) {
        if (error) {
            console.log(error);
            res.send("yeah no. didn't work.")
        }
        else {
            req.session.oauth = {
                token : oauth_token,
                token_secret : oauth_token_secret
            };
            res.redirect('https://trello.com/1/OAuthAuthorizeToken?oauth_token=' + oauth_token)
        }
    });
});
app.get('/oauth/trello/callback', function (req, res) {
    if (req.session.oauth) {
        req.session.oauth.verifier = req.query.oauth_verifier;
        var oauth = req.session.oauth;

        oa.getOAuthAccessToken(oauth.token, oauth.token_secret, oauth.verifier, function (error, oauth_access_token, oauth_access_token_secret, results) {
		    if (error) {
		        console.log(error);
		        res.send("yeah something broke.");
		    } else {
		        req.session.oauth.access_token = oauth_access_token;
		        req.session.oauth, access_token_secret = oauth_access_token_secret;
		        res.redirect('/');
		    }
		});
    } else
        next(new Error("you're not supposed to be here."))
});

// get cards grouped by label
app.get('/cards/label/:label', checkOAuth, function (req, res) {
    var label = req.params.label;
    var t = new Trello(cfg.trello.appkey, req.session.oauth.access_token);
    t.get('/1/members/my/cards', function (err, data) {
        var cards = [];
        for (var i = 0; i < data.length; i++) {
            var card = data[i];
            if (card.labels.length > 0) {
                for (var o = 0; o < card.labels.length; o++) {
                    if (card.labels[o].name == label) 
                        cards.push(card);
                }
            }
        }

        res.render('cardsbylabel', { label: label, cards: cards });
    });
});
// all cards
app.get('/cards/:type?', checkOAuth, function (req, res) {
    var type = req.params.type;
    var t = new Trello(cfg.trello.appkey, req.session.oauth.access_token);
    t.get('/1/members/my/cards', function (err, data) {
        if (err) throw err;
        var cards = data;
        var title = 'All your assigned cards';

        if (typeof type != 'undefined') {
            if (type === 'date') {
                // get only the cards that have a due date
                title = 'All your assigned cards with a due date';
                cards = [];
                for (var i = 0; i < data.length; i++) {
                    var card = data[i];
                    if (card.badges.due !== null) cards.push(card);
                }
            }
            else {
                res.status(404);
                res.render('404');
            }
        }

        res.render('cards', { title: title, cards: cards });
    });
});

// index route
app.get('/', checkOAuth, function (req, res) {
    res.render('index');
});

// start listening
app.listen('9090');