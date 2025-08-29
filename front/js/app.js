$(document).ready(function() {
    // -------------------------------------------------------------------------
    // --- INICIALIZACIÓN DE PLUGINS Y NAVEGACIÓN
    // -------------------------------------------------------------------------

    // Función para mostrar una sección y ocultar las demás (SPA).
    // Se toma la versión de spa.js por ser más robusta y re-inicializar los sliders.
    window.showSection = function(sectionId) {
        const views = document.querySelectorAll('.main-view');
        views.forEach(view => {
            view.classList.add('hidden');
        });
        const targetView = document.getElementById(sectionId);
        if (targetView) {
            targetView.classList.remove('hidden');

            if (sectionId === 'inicio-view' && window.innerWidth >= 768) {
                // Reinicializa los sliders solo si están en la vista de inicio y en desktop.
                $('#adaptive').lightSlider({
                    adaptiveHeight: true,
                    auto: true,
                    item: 1,
                    slideMargin: 0,
                    loop: true,
                    controls: false,
                    pager: true,
                    pause: 4000,
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

    // Muestra la vista de inicio por defecto al cargar la página.
    showSection('inicio-view');

    // --- MANEJADORES DE EVENTOS PARA LA INTERFAZ ---
    
    // Muestra/oculta la barra de búsqueda.
    $(document).on('click', '.search-icon', function() {
        $('.search-bar').removeClass('hidden').addClass('flex');
    });
    $(document).on('click', '.search-cancel-icon', function() {
        $('.search-bar').addClass('hidden').removeClass('flex');
    });

    // Muestra/oculta el menú móvil.
    $(document).on('click', '.menu-toggle', function() {
        $('.mobile-menu').toggleClass('hidden');
    });

    // --- MANEJO DE MODALES ---

    // Muestra el modal de login.
    $(document).on('click', '.user-icon, #show-login', function() {
        $('#register-modal').addClass('hidden');
        $('#login-modal').removeClass('hidden');
    });

    // Muestra el modal de registro.
    $(document).on('click', '#show-register', function() {
        $('#login-modal').addClass('hidden');
        $('#register-modal').removeClass('hidden');
    });
    
    // Muestra el modal de tokens.
    $(document).on('click', '#tokens-icon', function() {
        $('#tokens-modal').removeClass('hidden');
    });

    // Cierra todos los modales.
    $(document).on('click', '.modal-cancel-icon', function() {
        $(this).closest('.modal-container').addClass('hidden');
    });

    // -------------------------------------------------------------------------
    // --- LÓGICA FUNCIONAL CON API
    // -------------------------------------------------------------------------

    let authToken = localStorage.getItem('userToken') || null;

    /**
     * Envía una petición a la API para añadir un producto al carrito del usuario.
     */
    function addItemToCart(itemId) {
        if (!authToken) {
            alert("Por favor, inicia sesión para añadir productos al carrito.");
            $('#login-modal').removeClass('hidden'); // Abre el modal de login.
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
        showSection('cart-view');
        if (!authToken) {
            $('#cart-items-container').html('<p class="text-center text-indigo-500">Inicia sesión para ver tu carrito.</p>');
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
            $('#cart-items-container').html('<p class="text-center text-red-500">No se pudo cargar tu carrito.</p>');
        }
    }

    /**
     * Genera el HTML para cada producto en el carrito y calcula el total.
     */
    function renderCartItems(items) {
        const container = $('#cart-items-container');
        container.empty();
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

    // Abre el modal con detalles del producto.
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

    // Añade un producto al carrito desde la tarjeta.
    $('body').on('click', '.add-to-cart-btn', function(e) {
        e.stopPropagation();
        addItemToCart($(this).closest('.product-box').data('item-id'));
    });

    // Añade un producto al carrito desde el modal.
    $('#modal-add-to-cart-btn').on('click', function() {
        closeModal();
        addItemToCart($(this).data('item_id'));
    });

    // Lógica para el botón de canjear (placeholder).
    $('#redeem-button').on('click', function() {
        alert(`Funcionalidad de canje para el item ${$(this).data('item_id')} no implementada.`);
        closeModal();
    });

    // Muestra la vista del carrito.
    $('#cart-icon').on('click', function(e) {
        e.preventDefault();
        showCartView();
    });

    // -------------------------------------------------------------------------
    // --- LÓGICA DEL PERFIL DE VENDEDOR
    // -------------------------------------------------------------------------
    
    if ($('#seller-profile-view').length > 0) {
        const $productGrid = $('#product-grid');
        const $productListContainer = $('#product-list-container');
        const $productFormContainer = $('#product-form-container');
        const $formTitle = $('#form-title');
        const $productForm = $('#product-form');

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
                    const productCardHTML = `
                    <div class="bg-white border rounded-lg shadow-md overflow-hidden">
                        <img src="${product.image_url || 'https://via.placeholder.com/300x200'}" alt="${product.name}" class="w-full h-48 object-cover">
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

        function showSellerContent($sectionToShow) {
            $productListContainer.addClass('hidden');
            $productFormContainer.addClass('hidden');
            $sectionToShow.removeClass('hidden');
        }

        $('#btn-show-add-form').on('click', () => {
            $formTitle.text('Agregar Nuevo Producto');
            $productForm[0].reset();
            $('#product-id').val('');
            showSellerContent($productFormContainer);
        });
        
        $('#btn-show-products, #btn-cancel').on('click', () => {
            renderSellerProducts();
            showSellerContent($productListContainer);
        });

        $productForm.on('submit', async function(event) {
            event.preventDefault();
            const id = $('#product-id').val();
            const productData = {
                name: $('#product-name').val(),
                description: $('#product-description').val(),
                price: parseFloat($('#product-price').val()),
                image_url: $('#product-image').val(),
                type: 'product',
                category_id: 1
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

        if(authToken) renderSellerProducts();
    }
    
    // -------------------------------------------------------------------------
    // --- LÓGICA DE FORMULARIO DE REGISTRO
    // -------------------------------------------------------------------------
    var roleSelect = document.getElementById('register-role');
    var cargoSection = document.getElementById('cargo-section');
    var tiendaSection = document.getElementById('tienda-section');

    if (roleSelect) {
        roleSelect.addEventListener('change', function () {
            cargoSection.classList.add('hidden');
            tiendaSection.classList.add('hidden');
            if (roleSelect.value === 'administrador') {
                cargoSection.classList.remove('hidden');
            } else if (roleSelect.value === 'vendedor') {
                cargoSection.classList.remove('hidden');
                tiendaSection.classList.remove('hidden');
            }
        });
    }

});