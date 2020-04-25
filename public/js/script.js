$(document).ready(function() {
    $(".form-show-hide").click(function(){
        $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
    });
});