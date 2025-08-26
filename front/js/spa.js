document.addEventListener('DOMContentLoaded', () => {
    // Función principal para mostrar una sección y ocultar las demás
    function showSection(sectionId) {
        // Selecciona todas las vistas principales con la clase 'main-view'
        const views = document.querySelectorAll('.main-view');
        
        // Oculta todas las vistas
        views.forEach(view => {
            view.classList.add('hidden');
        });
        
        // Muestra solo la vista deseada
        const targetView = document.getElementById(sectionId);
        if (targetView) {
            targetView.classList.remove('hidden');
        }
    }

    // Asegúrate de que los enlaces de navegación llamen a la función correcta
    // Usando event listeners para una mejor práctica
    const navLinks = document.querySelectorAll('nav a[onclick^="showSection"]');
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Previene la recarga de la página
            const sectionId = event.target.getAttribute('onclick').match(/'([^']+)'/)[1];
            showSection(sectionId);
        });
    });

    // Muestra la vista de inicio por defecto al cargar la página
    showSection('inicio-view');

    // Inicializa el slider de la página de inicio
    // Asegúrate de que jQuery y lightslider.js estén cargados en tu HTML
    $(document).ready(function() {
        $('#adaptive').lightSlider({
            adaptiveHeight: true,
            auto: true,
            item: 1,
            slideMargin: 0,
            loop: true
        });

        $('#autoWidth').lightSlider({
            autoWidth: true,
            loop: true,
            onSliderLoad: function() {
                $('#autoWidth').removeClass('cs-hidden');
            }
        });  
    });
});