$(document).ready(function() {
    // --- INICIALIZACIÓN DE PLUGINS Y UI GENERAL ---

    // Inicializa el carrusel principal de la página de inicio.
    $('#adaptive').lightSlider({
        adaptiveHeight: true,
        auto: true,
        item: 1,
        slideMargin: 0,
        loop: true
    });

    // Inicializa el carrusel de categorías.
    $('#autoWidth').lightSlider({
        autoWidth: true,
        loop: true,
        onSliderLoad: function() {
            $('#autoWidth').removeClass('cS-hidden');
        }
    });

    // --- MANEJADORES DE EVENTOS PARA LA INTERFAZ ---

    // Muestra la barra de búsqueda al hacer clic en el ícono de lupa.
    $(document).on('click', '.search-icon', function() {
        $('.search-bar').removeClass('hidden').addClass('flex');
    });

    // Oculta la barra de búsqueda al hacer clic en el ícono de 'X'.
    $(document).on('click', '.search-cancel-icon', function() {
        $('.search-bar').addClass('hidden').removeClass('flex');
    });

    // Muestra el formulario de login al hacer clic en el ícono de usuario o en "ya tengo cuenta".
    $(document).on('click', '.user-icon, .already-account-btn', function() {
        $('.form-container').removeClass('hidden').addClass('flex');
        $('.login-form').removeClass('hidden').addClass('flex');
        $('.sign-up-form').addClass('hidden').removeClass('flex');
    });

    // Cambia al formulario de registro al hacer clic en "Crear Cuenta".
    $(document).on('click', '.sign-up-btn', function() {
        $('.form-container').removeClass('hidden').addClass('flex');
        $('.sign-up-form').removeClass('hidden').addClass('flex');
        $('.login-form').addClass('hidden').removeClass('flex');
    });

    // Cierra el contenedor de formularios.
    $(document).on('click', '.form-cancel-icon', function() {
        $('.form-container').addClass('hidden').removeClass('flex');
    });

    // Muestra/oculta el menú en dispositivos móviles.
    $(document).on('click', '.menu-toggle', function() {
        $('.mobile-menu').toggleClass('hidden');
    });

    // --- NAVEGACIÓN DE LA APLICACIÓN (SPA) ---

    // Función global para cambiar entre las diferentes vistas de la página.
    window.showSection = function(sectionId) {
        $('.main-view').addClass('hidden'); // Oculta todas las vistas.
        $('#' + sectionId).removeClass('hidden'); // Muestra solo la vista solicitada.
    }

    // =============================================================
    // ================ LÓGICA FUNCIONAL CON API ===================
    // =============================================================

    // Carga el token de autenticación del usuario desde el almacenamiento local.
    let authToken = localStorage.getItem('userToken') || null;

    // --- FUNCIONES DEL CARRITO DE COMPRAS ---

    /**
     * Envía una petición a la API para añadir un producto al carrito del usuario.
     * @param {number} itemId - El ID del producto a añadir.
     */
    function addItemToCart(itemId) {
        if (!authToken) {
            alert("Por favor, inicia sesión para añadir productos al carrito.");
            $('.user-icon').click(); // Abre el modal de login.
            return;
        }
        $.ajax({
            url: `http://localhost:5000/api/carts/add`,
            method: 'POST',
            contentType: 'application/json',
            headers: { 'Authorization': 'Bearer ' + authToken },
            data: JSON.stringify({ itemId: itemId, quantity: 1 }),
            success: (res) => {
                alert(res.message);
                showCartView(); // Actualiza y muestra la vista del carrito.
            },
            error: (err) => {
                console.error("Error al añadir al carrito:", err);
                alert('Error al añadir al carrito, vuelve a intentarlo.');
            }
        });
    }

    /**
     * Pide a la API los productos del carrito y los muestra en la vista.
     */
    async function showCartView() {
        showSection('cart-view'); // Muestra la sección del carrito.
        if (!authToken) {
            $('#cart-items-container').html('<p class="text-center text-red-500">Inicia sesión para ver tu carrito.</p>');
            return;
        }
        try {
            const cartItems = await $.ajax({
                url: 'http://localhost:5000/api/carts/',
                method: 'GET',
                headers: { 'Authorization': 'Bearer ' + authToken }
            });
            renderCartItems(cartItems); // Dibuja los productos en el HTML.
        } catch (error) {
            $('#cart-items-container').html('<p class="text-center text-red-500">No se pudo cargar tu carrito.</p>');
        }
    }

    /**
     * Genera el HTML para cada producto en el carrito y calcula el total.
     * @param {Array} items - La lista de productos en el carrito.
     */
    function renderCartItems(items) {
        const container = $('#cart-items-container');
        container.empty(); // Limpia el contenido anterior.
        if (!items || items.length === 0) {
            container.html('<p class="text-center text-gray-500">Tu carrito está vacío.</p>');
            $('#cart-total').text('$0');
            $('#cart-item-count').text('0');
            return;
        }
        let total = 0;
        let totalItems = 0;
        items.forEach(cartItem => {
            const item = cartItem.item;
            const subtotal = parseFloat(item.price) * cartItem.quantity;
            total += subtotal;
            totalItems += cartItem.quantity;
            const itemHtml = `
                <div class="flex items-center justify-between border-b pb-4 mb-4">
                    <div class="flex items-center">
                        <div class="ml-4">
                            <p class="font-bold text-lg">${item.name}</p>
                            <p class="text-gray-600">$${new Intl.NumberFormat('es-CO').format(item.price)}</p>
                        </div>
                    </div>
                    <div><p>Cantidad: ${cartItem.quantity}</p></div>
                    <button class="remove-from-cart-btn text-red-500 hover:text-red-700" data-item-id="${item.item_id}"><i class="fas fa-trash"></i></button>
                </div>`;
            container.append(itemHtml);
        });
        $('#cart-total').text(`$${new Intl.NumberFormat('es-CO').format(total)}`);
        $('#cart-item-count').text(totalItems);
    }

    // --- MANEJADORES DE EVENTOS (MODAL Y CARRITO) ---

    // Abre el modal con detalles del producto al hacer clic en una tarjeta.
    $('body').on('click', '.product-box', function() {
        const itemId = $(this).data('item-id');
        if (!itemId) return;
        const clickedBox = $(this);
        $.ajax({
            url: `http://localhost:5000/api/items/${itemId}`,
            method: 'GET',
            success: function(productData) {
                const itemImageSrc = clickedBox.find('img').attr('src');
                $('#modal-img').attr('src', itemImageSrc);
                $('#modal-name').text(productData.name);
                $('#modal-description').text(productData.description || 'No hay descripción disponible.');
                $('#modal-price').text(`$${new Intl.NumberFormat('es-CO').format(productData.price)}`);
                if (productData.token_price) {
                    $('#token-section, #redeem-button').show();
                    $('#modal-token-price').text(productData.token_price);
                } else {
                    $('#token-section, #redeem-button').hide();
                }
                $('#redeem-button').data('item_id', productData.item_id);
                $('#modal-add-to-cart-btn').data('item_id', productData.item_id);
                $('#product-modal').removeClass('hidden').addClass('flex');
                setTimeout(() => {
                    $('#modal-content-wrapper').removeClass('scale-95 opacity-0').addClass('scale-100 opacity-100');
                }, 10);
            },
            error: () => alert("No se pudo cargar la información del producto.")
        });
    });

    // Cierra el modal con una animación de salida.
    function closeModal() {
        $('#modal-content-wrapper').removeClass('scale-100 opacity-100').addClass('scale-95 opacity-0');
        setTimeout(() => {
            $('#product-modal').addClass('hidden').removeClass('flex');
        }, 300);
    }
    $('#modal-close').on('click', closeModal);

    // Añade un producto al carrito desde el botón en la tarjeta.
    $('body').on('click', '.add-to-cart-btn', function(e) {
        e.stopPropagation(); // Evita que se abra el modal.
        addItemToCart($(this).closest('.product-box').data('item-id'));
    });

    // Añade un producto al carrito desde el botón DENTRO del modal.
    $('#modal-add-to-cart-btn').on('click', function() {
        closeModal();
        addItemToCart($(this).data('item_id'));
    });

    // Lógica para el botón de canjear (actualmente es un placeholder).
    $('#redeem-button').on('click', function() {
        alert(`Funcionalidad de canje para el item ${$(this).data('item_id')} no implementada.`);
        closeModal();
    });

    // Muestra la vista del carrito al hacer clic en el ícono de la navegación.
    $('#cart-icon').on('click', function(e) {
        e.preventDefault(); // Evita que la página se recargue.
        showCartView();
    });

    // =============================================================
    // ================ LÓGICA DEL PERFIL DE VENDEDOR ===============
    // =============================================================
    
    // Solo ejecuta esta lógica si existe la vista del perfil de vendedor en el HTML.
    if ($('#seller-profile-view').length > 0) {
        const $productGrid = $('#product-grid');
        const $productListContainer = $('#product-list-container');
        const $productFormContainer = $('#product-form-container');
        const $formTitle = $('#form-title');
        const $productForm = $('#product-form');

        // Pide a la API la lista de productos y los muestra.
        async function renderSellerProducts() {
            $productGrid.empty();
            if (!authToken) {
                $productGrid.html('<p class="text-center text-red-500 col-span-full">Debes iniciar sesión para ver tus productos.</p>');
                return;
            }
            try {
                const products = await $.ajax({
                    url: 'http://localhost:5000/api/items',
                    method: 'GET',
                    headers: { 'Authorization': 'Bearer ' + authToken }
                });
                if (products.length === 0) {
                    $productGrid.html('<p class="text-center text-gray-500 col-span-full">No tienes productos. ¡Agrega uno!</p>');
                    return;
                }
                products.forEach(product => {
                    // Genera la tarjeta HTML para cada producto.
                    const productCardHTML = `
                    <div class="bg-white border rounded-lg shadow-md overflow-hidden">
                        <img src="${product.image_url}" alt="${product.name}" class="w-full h-48 object-cover">
                        <div class="p-4">
                            <h3 class="text-lg font-bold">${product.name}</h3>
                            <p class="text-gray-600 text-sm mt-2">${product.description}</p>
                            <p class="text-xl font-semibold text-teal-600 mt-4">$${new Intl.NumberFormat('es-CO').format(product.price)}</p>
                        </div>
                        <div class="bg-gray-50 p-3 flex justify-end gap-2">
                            <button class="btn-edit text-sm font-medium text-white bg-yellow-500 py-1 px-3 rounded hover:bg-yellow-600" data-id="${product.item_id}">✏️ Editar</button>
                            <button class="btn-delete text-sm font-medium text-white bg-red-500 py-1 px-3 rounded hover:bg-red-600" data-id="${product.item_id}">🗑️ Eliminar</button>
                        </div>
                    </div>`;
                    $productGrid.append(productCardHTML);
                });
            } catch (error) {
                $productGrid.html('<p class="text-center text-red-500 col-span-full">Error al cargar los productos.</p>');
            }
        }

        // Muestra una sección específica del perfil (lista o formulario).
        function showSellerContent($sectionToShow) {
            $productListContainer.addClass('hidden');
            $productFormContainer.addClass('hidden');
            $sectionToShow.removeClass('hidden');
        }

        // Muestra el formulario para agregar un nuevo producto.
        $('#btn-show-add-form').on('click', () => {
            $formTitle.text('Agregar Nuevo Producto');
            $productForm[0].reset();
            $('#product-id').val('');
            showSellerContent($productFormContainer);
        });
        
        // Muestra la lista de productos.
        $('#btn-show-products, #btn-cancel').on('click', () => {
            renderSellerProducts();
            showSellerContent($productListContainer);
        });

        // Envía los datos del formulario a la API para crear o actualizar un producto.
        $productForm.on('submit', async function(event) {
            event.preventDefault();
            const id = $('#product-id').val();
            const productData = {
                name: $('#product-name').val(),
                description: $('#product-description').val(),
                price: parseFloat($('#product-price').val()),
                image_url: $('#product-image').val(),
                type: 'product',
                category_id: 1 // Asigna una categoría por defecto.
            };
            const isUpdating = !!id;
            const url = isUpdating ? `http://localhost:5000/api/items/${id}` : `http://localhost:5000/api/items`;
            const method = isUpdating ? 'PUT' : 'POST';
            try {
                await $.ajax({
                    url, method,
                    contentType: 'application/json',
                    headers: { 'Authorization': 'Bearer ' + authToken },
                    data: JSON.stringify(productData)
                });
                alert(`Producto ${isUpdating ? 'actualizado' : 'creado'} con éxito.`);
                renderSellerProducts();
                showSellerContent($productListContainer);
            } catch (error) {
                alert('Error al guardar el producto.');
            }
        });

        // Carga los datos de un producto en el formulario para editarlo.
        $productGrid.on('click', '.btn-edit', async function() {
            const productId = $(this).data('id');
            try {
                const productToEdit = await $.ajax({
                    url: `http://localhost:5000/api/items/${productId}`,
                    method: 'GET',
                    headers: { 'Authorization': 'Bearer ' + authToken }
                });
                $formTitle.text('Actualizar Producto');
                $('#product-id').val(productToEdit.item_id);
                $('#product-name').val(productToEdit.name);
                $('#product-description').val(productToEdit.description);
                $('#product-price').val(productToEdit.price);
                $('#product-image').val(productToEdit.image_url);
                showSellerContent($productFormContainer);
            } catch (error) {
                alert('No se pudo cargar el producto para editar.');
            }
        });

        // Envía una petición a la API para eliminar un producto.
        $productGrid.on('click', '.btn-delete', async function() {
            const productId = $(this).data('id');
            if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
                try {
                    await $.ajax({
                        url: `http://localhost:5000/api/items/${productId}`,
                        method: 'DELETE',
                        headers: { 'Authorization': 'Bearer ' + authToken }
                    });
                    alert('Producto eliminado.');
                    renderSellerProducts();
                } catch (error) {
                    alert('Error al eliminar el producto.');
                }
            }
        });

        // Carga inicial de los productos del vendedor si hay un token.
        if(authToken) renderSellerProducts();
    }
});