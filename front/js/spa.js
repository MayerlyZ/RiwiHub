// spa.js

document.addEventListener('DOMContentLoaded', () => {
    // Función para mostrar una sección y ocultar las demás
    function showSection(sectionId) {
        const views = document.querySelectorAll('.main-view');
        
        views.forEach(view => {
            view.classList.add('hidden');
        });
        
        const targetView = document.getElementById(sectionId);
        if (targetView) {
            targetView.classList.remove('hidden');

            // Inicializa los sliders solo cuando la vista de inicio es visible
            if (sectionId === 'inicio-view') {
                if (window.innerWidth >= 768) { // Asegura que solo se inicialice en desktop
                    $('#adaptive').lightSlider({
                        adaptiveHeight: true,
                        auto: true,
                        item: 1,
                        slideMargin: 0,
                        loop: true,
                        controls: false,
                        pager: true,
                        pause:4000,
                    });
                    $('#autoWidth').lightSlider({
                        autoWidth: true,
                        loop: true,
                        slideMargin: 15,
                        onSliderLoad: function() {
                            $('#autoWidth').removeClass('cs-hidden');
                        },
                        controls: true,
                        pager: false
                    });
                }
            }
        }
    }

    // Usando event listeners para los enlaces de navegación
    const navLinks = document.querySelectorAll('nav a[onclick^="showSection"]');
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const sectionId = event.target.getAttribute('onclick').match(/'([^']+)'/)[1];
            showSection(sectionId);
        });
    });

    // Muestra la vista de inicio por defecto al cargar la página
    showSection('inicio-view');
});