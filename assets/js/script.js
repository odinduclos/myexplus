$(document).ready(function () {

    $(document).on('click', '.star', function (e) {
        var click = e.target.dataset.value;
        var stage = e.target.dataset.stage;
        for (var i = 5; i > 0; i--){
            $('.star').filter('[data-value='+i+'][data-stage='+stage+']').attr('data-activated', '0');
            $('.star').filter('[data-value='+i+'][data-stage='+stage+']').css('background-image', 'url("assets/img/star_empty_30x25.svg")')
        }
        for (var i = click; i > 0; i--){
            $('.star').filter('[data-value='+i+'][data-stage='+stage+']').attr('data-activated', '1');
            $('.star').filter('[data-value='+i+'][data-stage='+stage+']').css('background-image', 'url("assets/img/star_full_30x25.svg")')
        }
    });

});