// Espera a que el DOM esté listo antes de ejecutar cualquier lógica
$(document).ready(function() {
    // Inicializa el slider principal con altura adaptable y autoplay
    $('#adaptive').lightSlider({
        adaptiveHeight:true,
        auto:true,
        item:1,
        slideMargin:0,
        loop:true
    });
    // Inicializa el slider secundario con ancho automático
    $('#autoWidth').lightSlider({
        autoWidth:true,
        loop:true,
        onSliderLoad: function(){
            $('#autoWidth').removeClass('cS-hidden');
        }
    });

    // Muestra la barra de búsqueda al hacer clic en el ícono de búsqueda
    $(document).on('click', '.search-icon', function(){
        $('.search-bar').removeClass('hidden').addClass('flex');
    });

    // Oculta la barra de búsqueda al hacer clic en el ícono de cancelar
    $(document).on('click', '.search-cancel-icon', function(){
        $('.search-bar').addClass('hidden').removeClass('flex');
    });

    // Muestra el formulario de login al hacer clic en el ícono de usuario o botón de cuenta existente
    $(document).on('click', '.user-icon, .already-account-btn', function(){
        $('.form-container').removeClass('hidden').addClass('flex');
        $('.login-form').removeClass('hidden').addClass('flex');
        $('.sign-up-form').addClass('hidden').removeClass('flex');
    });

    // Muestra el formulario de registro al hacer clic en el botón de registro
    $(document).on('click', '.sign-up-btn', function(){
        $('.form-container').removeClass('hidden').addClass('flex');
        $('.sign-up-form').removeClass('hidden').addClass('flex');
        $('.login-form').addClass('hidden').removeClass('flex');
    });

    // Oculta los formularios al hacer clic en el ícono de cancelar
    $(document).on('click', '.form-cancel-icon', function(){
        $('.form-container').addClass('hidden').removeClass('flex');
    });
    
    // Lógica para mostrar/ocultar el menú móvil
    $(document).on('click', '.menu-toggle', function() {
        $('.mobile-menu').toggleClass('hidden');
    });
});

// =============================================================
// ================ LÓGICA DEL MODAL DE PRODUCTO ===============
// =============================================================

// Al hacer clic en una caja de producto, se obtiene el id y se consulta la API
$('.product-box').on('click', function() {
    const itemId = $(this).data('item-id');
    if (!itemId) return;

    // Conexión con la API para obtener los datos del producto
    // En el backend, esta ruta debe consultar la base de datos y devolver los datos del producto con el item_id recibido
    $.ajax({
        url: `http://localhost:5000/api/items/${itemId}`, // <-- Aquí el backend debe hacer la consulta a la base de datos
        method: 'GET',
        success: function(productData) {
            // Muestra los datos del producto en el modal
            $('#modal-name').text(productData.name);
            $('#modal-description').text(productData.description || 'No hay descripción disponible.');
            $('#modal-price').text(`$${productData.price}`);
            
            // Si el producto es canjeable por tokens, muestra el botón de canje
            if (productData.token_price) {
                $('#modal-token-price').text(productData.token_price);
                $('#redeem-button').show();
            } else {
                $('#modal-token-price').text('No canjeable');
                $('#redeem-button').hide();
            }

            // Asigna el item_id al botón de canje para futuras acciones
            $('#redeem-button').data('item-id', productData.item_id);
            
            // Muestra el modal con animación
            $('#product-modal').removeClass('hidden').addClass('flex');
            setTimeout(() => {
                $('#modal-content-wrapper').removeClass('scale-95 opacity-0').addClass('scale-100 opacity-100');
            }, 10);

        }.bind(this),
        error: function(err) {
            // Manejo de error si la API no responde correctamente
            console.error("Error al obtener el producto:", err);
            alert("No se pudo cargar la información del producto.");
        }
    });
});

// Función para cerrar el modal con animación
function closeModal() {
    $('#modal-content-wrapper').removeClass('scale-100 opacity-100').addClass('scale-95 opacity-0');
    setTimeout(() => {
        $('#product-modal').addClass('hidden').removeClass('flex');
    }, 300);
}

// Cierra el modal al hacer clic en el botón de cerrar
$('#modal-close').on('click', closeModal);

// Al hacer clic en el botón de canje, muestra un mensaje y cierra el modal
// Aquí podrías agregar una conexión a la API para procesar el canje en la base de datos
$('#redeem-button').on('click', function() {
    const itemId = $(this).data('item-id');
    alert(`Iniciando proceso de canje para el producto ${itemId}.`);
    // Ejemplo: aquí podrías hacer un POST a la API para registrar el canje en la base de datos
    // $.post('http://localhost:5000/api/redeem', { item_id: itemId }, function(response) { ... });
    closeModal();
});