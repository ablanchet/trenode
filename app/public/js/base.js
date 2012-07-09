$(function () {
    console.log('jquery is here ? :' + $);

    $('input[name=searchBtn]').click(function () {
        if ($('input[name=labelTb]').val() != 'undefined') {
            window.location = "/cards/label/" + $('input[name=labelTb]').val();
        }
    });
});

function getDate(date){
        var d = new Date(date);
        return d.getDate() + ' - ' + d.getMonth() + ' - ' + d.getYear(); 
};
