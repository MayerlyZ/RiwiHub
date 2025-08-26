// app.js

// Oculta todas las secciones
function hideAllSections() {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    // Oculta otros contenedores principales si es necesario
    const mainContainers = document.querySelectorAll('.main-container');
    mainContainers.forEach(container => {
        container.style.display = 'none';
    });
}

// Muestra la sección deseada
function showCategory(categoryId) {
    hideAllSections(); // Oculta todo antes de mostrar el contenido
    const categoryElement = document.getElementById(categoryId);
    if (categoryElement) {
        categoryElement.style.display = 'block';
    }
}

// Al cargar la página, muestra la vista de inicio
window.onload = function() {
    hideAllSections();
    // Por ejemplo, aquí podrías mostrar la sección principal por defecto
    document.getElementById('inicio-content').style.display = 'block';
};