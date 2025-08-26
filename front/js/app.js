// app.js

$(document).ready(function() {
    // --- Lógica de los Formularios y la Barra de Búsqueda ---
    
    // Abrir y cerrar la barra de búsqueda
    $('.search-icon').on('click', function() {
        $('.search-bar').removeClass('hidden').addClass('flex');
    });

    $('.search-cancel-icon').on('click', function() {
        $('.search-bar').addClass('hidden').removeClass('flex');
    });

    // Abrir y gestionar los formularios de inicio de sesión y registro
    $('.user-icon, .already-account-btn').on('click', function() {
        $('.form-container').removeClass('hidden').addClass('flex');
        $('.login-form').removeClass('hidden').addClass('flex');
        $('.sign-up-form').addClass('hidden').removeClass('flex');
    });

    $('.sign-up-btn').on('click', function() {
        $('.form-container').removeClass('hidden').addClass('flex');
        $('.sign-up-form').removeClass('hidden').addClass('flex');
        $('.login-form').addClass('hidden').removeClass('flex');
    });

    $('.form-cancel-icon').on('click', function() {
        $('.form-container').addClass('hidden').removeClass('flex');
    });
    
    // --- Lógica del menú responsivo ---
    
    $('.menu-toggle').on('click', function() {
        $('.mobile-menu').toggleClass('hidden');
    });
});