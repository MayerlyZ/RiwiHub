// app.js
$(document).ready(function() {
    // --- Configuración de Sliders (carruseles) ---
    $('#adaptive').lightSlider({
        adaptiveHeight: true,
        auto: true,
        item: 1,
        slideMargin: 0,
        loop: true,
        pause: 6000, // <-- Cambia la velocidad del carrusel a 6 segundos
        stop: 4000  
    });
    $('#autoWidth').lightSlider({
        autoWidth: true,
        loop: true,
        onSliderLoad: function() {
            $('#autoWidth').removeClass('cS-hidden');
        }
    });

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

    function showSection(sectionId) {
        $('.main-view').addClass('hidden'); // oculta todas las secciones principales
        $('#' + sectionId).removeClass('hidden'); // muestra solo la deseada
    }

    // =============================================================
    // ================ LÓGICA DEL CARRITO Y MODAL (FUNCIONAL) =================
    // =============================================================
    
    // Almacena el token de autenticación. Debes asignarle valor después del login.
    // Ejemplo: let authToken = localStorage.getItem('userToken');
    let authToken = localStorage.getItem('userToken') || null; 

    // --- FUNCIONES DEL CARRITO ---

    /**
     * @description Añade un item al carrito mediante una llamada a la API.
     * @param {number} itemId - El ID del item a añadir.
     */
    function addItemToCart(itemId) {
        // **IMPORTANTE**: Reemplaza esta línea con la forma en que obtienes el token real.

        if (!authToken) {
            alert("Por favor, inicia sesión para añadir productos al carrito.");
            $('.user-icon').click(); // Muestra el formulario de login si no hay token.
            return;
        }

        $.ajax({
            url: `http://localhost:5000/api/carts/add`,
            method: 'POST',
            contentType: 'application/json',
            headers: { 'Authorization': 'Bearer ' + authToken },
            data: JSON.stringify({ itemId: itemId, quantity: 1 }),
            success: function(response) {
                alert(response.message);
                showCartView(); // Muestra y actualiza la vista del carrito.
            },
            error: function(err) {
                console.error("Error al añadir al carrito:", err);
                alert('Hubo un error al añadir el producto al carrito. Revisa la consola para más detalles.');
            }
        });
    }

    /**
     * @description Obtiene los items del carrito desde la API y los muestra.
     */
    async function showCartView() {
        showSection('cart-view'); // Función de tu archivo spa.js para cambiar de vista

        // **IMPORTANTE**: Reemplaza esta línea con la forma en que obtienes el token real.

        if (!authToken) {
            $('#cart-items-container').html('<p class="text-center text-red-500">Por favor, inicia sesión para ver tu carrito.</p>');
            return;
        }

        try {
            const cartItems = await $.ajax({
                url: 'http://localhost:5000/api/carts/',
                method: 'GET',
                headers: { 'Authorization': 'Bearer ' + authToken }
            });
            renderCartItems(cartItems);
        } catch (error) {
            console.error("Error al cargar el carrito:", error);
            $('#cart-items-container').html('<p class="text-center text-red-500">No se pudo cargar tu carrito.</p>');
        }
    }

    /**
     * @description Dibuja los items del carrito en el HTML.
     * @param {Array} items - Un array de objetos de items del carrito.
     */
    function renderCartItems(items) {
        const container = $('#cart-items-container');
        container.empty();
        if (!items || items.length === 0) {
            container.html('<p class="text-center text-gray-500">Tu carrito está vacío.</p>');
            $('#cart-total').text('$0.00');
            $('#cart-item-count').text('0');
            return;
        }
        let total = 0;
        let totalItems = 0;
        items.forEach(cartItem => {
            const item = cartItem.item;
            const price = parseFloat(item.price);
            const subtotal = price * cartItem.quantity;
            total += subtotal;
            totalItems += cartItem.quantity;
            // Se ha eliminado la etiqueta <img> ya que no hay image_url en la BD
            const itemHtml = `
                <div class="flex items-center justify-between border-b pb-4 mb-4">
                    <div class="flex items-center">
                        <div class="ml-4">
                            <p class="font-bold text-lg">${item.name}</p>
                            <p class="text-gray-600">$${item.price}</p>
                        </div>
                    </div>
                    <div><p>Cantidad: ${cartItem.quantity}</p></div>
                    <button class="remove-from-cart-btn text-red-500 hover:text-red-700" data-item-id="${item.item_id}"><i class="fas fa-trash"></i></button>
                </div>`;
            container.append(itemHtml);
        });
        $('#cart-total').text(`$${total.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
        $('#cart-item-count').text(totalItems);
    }

    // --- MANEJADORES DE EVENTOS ---
    
    // Usamos delegación de eventos para que funcione con cualquier .product-box
   // Evento: click en un producto
$('body').on('click', '.product-box', function () {
    const itemId = $(this).data('item-id');
    if (!itemId) return;

    // Guardamos el producto clickeado para usarlo después en success
    const clickedBox = $(this);

    $.ajax({
        url: `http://localhost:5000/api/items/${itemId}`,
        method: 'GET',
        success: function (productData) {
            // Imagen desde el producto clickeado
            const itemImageSrc = clickedBox.find('img').attr('src');

            // Llenamos el modal
            $('#modal-img').attr('src', itemImageSrc);
            $('#modal-name').text(productData.name);
            $('#modal-description').text(productData.description || 'No hay descripción disponible.');
            $('#modal-price').text(`$${productData.price}`);

            // Manejo de tokens
            if (productData.token_price) {
                $('#token-section, #redeem-button').show();
                $('#modal-token-price').text(productData.token_price);
            } else {
                $('#token-section, #redeem-button').hide();
            }

            // Guardamos item_id en los botones
            $('#redeem-button').data('item_id', productData.item_id);
            $('#modal-add-to-cart-btn').data('item_id', productData.item_id);

            // Mostrar modal con animación
            $('#product-modal').removeClass('hidden').addClass('flex');
            setTimeout(() => {
                $('#modal-content-wrapper')
                    .removeClass('scale-95 opacity-0')
                    .addClass('scale-100 opacity-100');
            }, 10);
        },
        error: function () {
            alert("No se pudo cargar la información del producto.");
        }
    });
});

    function closeModal() {
        $('#modal-content-wrapper').removeClass('scale-100 opacity-100').addClass('scale-95 opacity-0');
        setTimeout(() => {
            $('#product-modal').addClass('hidden').removeClass('flex');
        }, 300);
    }
    $('#modal-close').on('click', closeModal);

    $('body').on('click', '.add-to-cart-btn', function(event) {
        event.stopPropagation();
        const itemId = $(this).closest('.product-box').data('item-id');
        addItemToCart(itemId);
    });

    $('#modal-add-to-cart-btn').on('click', function() {
        const itemId = $(this).data('item_id');
        closeModal();
        addItemToCart(itemId);
    });
    
    $('#redeem-button').on('click', function() {
        const itemId = $(this).data('item_id');
        alert(`Iniciando canje con tokens para el producto ${itemId}.`);
        closeModal();
    });

    $('#cart-icon').on('click', function(e) {
        e.preventDefault();
        showCartView();
    });
});




