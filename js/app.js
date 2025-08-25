$(document).ready(function() {
    $('#adaptive').lightSlider({
        adaptiveHeight:true,
        auto:true,
        item:1,
        slideMargin:0,
        loop:true
    });
    $('#autoWidth').lightSlider({
        autoWidth:true,
        loop:true,
        onSliderLoad: function(){
            $('#autoWidth').removeClass('cS-hidden');
        }
    });

    // Lógica de los formularios y la barra de búsqueda
    $(document).on('click', '.search-icon', function(){
        $('.search-bar').removeClass('hidden').addClass('flex');
    });

    $(document).on('click', '.search-cancel-icon', function(){
        $('.search-bar').addClass('hidden').removeClass('flex');
    });

    $(document).on('click', '.user-icon, .already-account-btn', function(){
        $('.form-container').removeClass('hidden').addClass('flex');
        $('.login-form').removeClass('hidden').addClass('flex');
        $('.sign-up-form').addClass('hidden').removeClass('flex');
    });

    $(document).on('click', '.sign-up-btn', function(){
        $('.form-container').removeClass('hidden').addClass('flex');
        $('.sign-up-form').removeClass('hidden').addClass('flex');
        $('.login-form').addClass('hidden').removeClass('flex');
    });

    $(document).on('click', '.form-cancel-icon', function(){
        $('.form-container').addClass('hidden').removeClass('flex');
    });
    
    // Lógica del menú responsivo
    $(document).on('click', '.menu-toggle', function() {
        $('.mobile-menu').toggleClass('hidden');
    });
});