var _cfg;

var Trello = {
    loadCfg: function (argv) {
        _cfg =
        {
            trello:
            {
                key: argv[2].substring(4),
                token: argv[3].substring(6)
            }
        };
    },
    loadCardsFromBoard: function (boardId, callback) {
        // https://trello.com/1/members/my/cards?key=1a3aa18e63369d2e4ae16e55d5fda107&token=021da4d1b359a4d58ee67bf7bab3226d9dd00244d59d4605d609d4ded2a070c7
        // repondre la response
        callback([{toto:1},{toto:2}]);
    },
    dump: function () {
        console.log(_cfg);
    }
};

module.exports = Trello;