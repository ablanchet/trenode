module.exports.formatDueDate = function (card) {
    if (card.badges.due != null) {
        var d = new Date(card.badges.due);
        card.badges.due = d.getDate() + '/' + d.getMonth() + '/' + d.getFullYear() +' - '+d.getHours()+':'+d.getMinutes();
    }
};