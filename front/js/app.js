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


    // --- UI EVENT HANDLERS ---

    // Show the search bar when clicking the magnifying glass icon.
    $(document).on('click', '.search-icon', function() {
        $('.search-bar').removeClass('hidden').addClass('flex');
    });

    // Hide the search bar when clicking the 'X' icon.
    // Muestra la vista de inicio por defecto al cargar la página.
    showSection('inicio-view');
    });
    $(document).on('click', '.search-cancel-icon', function() {
        $('.search-bar').addClass('hidden').removeClass('flex');
    });


    // Show the login form when clicking the user icon or "already have an account".
    $(document).on('click', '.user-icon, .already-account-btn', function() {
        $('.form-container').removeClass('hidden').addClass('flex');
        $('.login-form').removeClass('hidden').addClass('flex');
        $('.sign-up-form').addClass('hidden').removeClass('flex');
    });

    // Switch to the sign-up form when clicking "Create Account".
    $(document).on('click', '.sign-up-btn', function() {
        $('.form-container').removeClass('hidden').addClass('flex');
        $('.sign-up-form').removeClass('hidden').addClass('flex');
        $('.login-form').addClass('hidden').removeClass('flex');
    });

    // Close the form container.
    $(document).on('click', '.form-cancel-icon', function() {
        $('.form-container').addClass('hidden').removeClass('flex');
    });

    // Toggle mobile menu visibility.
    $(document).on('click', '.menu-toggle', function() {
        $('.mobile-menu').toggleClass('hidden');
    });


    // --- APPLICATION NAVIGATION (SPA) ---

    // Global function to switch between different page views.
    window.showSection = function(sectionId) {
        $('.main-view').addClass('hidden'); // Hide all views.
        $('#' + sectionId).removeClass('hidden'); // Show only the requested view.
    }


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


    // =============================================================
    // ===================== API FUNCTIONAL LOGIC ==================
    // =============================================================

    // Load user authentication token from local storage.
    let authToken = localStorage.getItem('userToken') || null;

    // --- SHOPPING CART FUNCTIONS ---

    /**
     * Sends a request to the API to add a product to the user's cart.
     * @param {number} itemId - The ID of the product to add.
     */
    function addItemToCart(itemId) {
        if (!authToken) {
            alert("Please log in to add products to the cart.");
            $('.user-icon').click(); // Opens the login modal.
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
                showCartView(); // Refresh and display the cart view.
            },
            error: (err) => {
                console.error("Error adding to cart:", err);
                alert('Error adding to cart, please try again.');
            }
        });
    }

    /**
     * Requests the products in the cart from the API and displays them in the view.
     */
    async function showCartView() {
        showSection('cart-view'); // Display the cart section.

        if (!authToken) {
            $('#cart-items-container').html('<p class="text-center text-indigo-500">Log in to see your cart.</p>');
            return;
        }
        try {
            const cartItems = await $.ajax({
                url: 'http://localhost:5000/api/carts/',
                method: 'GET',
                headers: { 'Authorization': 'Bearer ' + authToken }
            });
            renderCartItems(cartItems); // Render products in HTML.

        } catch (error) {
            $('#cart-items-container').html('<p class="text-center text-red-500">Could not load your cart.</p>');
        }
    }

    /**

     * Generates the HTML for each product in the cart and calculates the total.
     * @param {Array} items - The list of products in the cart.
     */
    function renderCartItems(items) {
        const container = $('#cart-items-container');
        container.empty(); // Clear previous content.
        if (!items || items.length === 0) {
            container.html('<p class="text-center text-gray-500">Your cart is empty.</p>');
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
                    <div><p>Quantity: ${cartItem.quantity}</p></div>
                    <button class="remove-from-cart-btn text-red-500 hover:text-red-700" data-item-id="${item.item_id}"><i class="fas fa-trash"></i></button>
                </div>`;
            container.append(itemHtml);
        });
        $('#cart-total').text(`$${new Intl.NumberFormat('es-CO').format(total)}`);
        $('#cart-item-count').text(totalItems);
    }

    // --- EVENT HANDLERS (MODAL & CART) ---


    // Open product detail modal when clicking on a product card.
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
                $('#modal-description').text(productData.description || 'No description available.');
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
            error: () => alert("Failed to load product information.")
        });
    });

    // Close modal with exit animation.
    function closeModal() {
        $('#modal-content-wrapper').removeClass('scale-100 opacity-100').addClass('scale-95 opacity-0');
        setTimeout(() => {
            $('#product-modal').addClass('hidden').removeClass('flex');
        }, 300);
    }
    $('#modal-close').on('click', closeModal);


    // Add a product to the cart from the card button.
    $('body').on('click', '.add-to-cart-btn', function(e) {
        e.stopPropagation(); // Prevent modal from opening.
        addItemToCart($(this).closest('.product-box').data('item-id'));
    });

    // Add a product to the cart from the modal button.
    $('#modal-add-to-cart-btn').on('click', function() {
        closeModal();
        addItemToCart($(this).data('item_id'));
    });
    // Redeem button logic (currently a placeholder).
    $('#redeem-button').on('click', function() {
        alert(`Redeem functionality for item ${$(this).data('item_id')} not implemented yet.`);
        closeModal();
    });

    // Show cart view when clicking the nav cart icon.
    $('#cart-icon').on('click', function(e) {
        e.preventDefault(); // Prevent page reload.
        showCartView();
    });

    // =============================================================
    // ================== SELLER PROFILE LOGIC =====================
    // =============================================================
    
    // Only execute this logic if seller profile view exists in the HTML.
    if ($('#seller-profile-view').length > 0) {
        const $productGrid = $('#product-grid');
        const $productListContainer = $('#product-list-container');
        const $productFormContainer = $('#product-form-container');
        const $formTitle = $('#form-title');
        const $productForm = $('#product-form');


        // Fetch product list from API and display them.
        async function renderSellerProducts() {
            $productGrid.empty();
            if (!authToken) {
                $productGrid.html('<p class="text-center text-red-500 col-span-full">You must log in to view your products.</p>');
                return;
            }
            try {
                const products = await $.ajax({
                    url: 'http://localhost:5000/api/items',
                    method: 'GET',
                    headers: { 'Authorization': 'Bearer ' + authToken }
                });
                if (products.length === 0) {
                    $productGrid.html('<p class="text-center text-gray-500 col-span-full">You don’t have any products. Add one!</p>');
                    return;
                }
                products.forEach(product => {

                    // Generate HTML card for each product.
                    const productCardHTML = `
                    <div class="bg-white border rounded-lg shadow-md overflow-hidden">
                        <img src="${product.image_url || 'https://via.placeholder.com/300x200'}" alt="${product.name}" class="w-full h-48 object-cover">
                        <div class="p-4">
                            <h3 class="text-lg font-bold">${product.name}</h3>
                            <p class="text-gray-600 text-sm mt-2">${product.description}</p>
                            <p class="text-xl font-semibold text-teal-600 mt-4">$${new Intl.NumberFormat('es-CO').format(product.price)}</p>
                        </div>
                        <div class="bg-gray-50 p-3 flex justify-end gap-2">
                            <button class="btn-edit text-sm font-medium text-white bg-yellow-500 py-1 px-3 rounded hover:bg-yellow-600" data-id="${product.item_id}">✏️ Edit</button>
                            <button class="btn-delete text-sm font-medium text-white bg-red-500 py-1 px-3 rounded hover:bg-red-600" data-id="${product.item_id}">🗑️ Delete</button>
                        </div>
                    </div>`;
                    $productGrid.append(productCardHTML);
                });
            } catch (error) {
                $productGrid.html('<p class="text-center text-red-500 col-span-full">Error loading products.</p>');
            }
        }


        // Show a specific profile section (list or form).
        function showSellerContent($sectionToShow) {
            $productListContainer.addClass('hidden');
            $productFormContainer.addClass('hidden');
            $sectionToShow.removeClass('hidden');
        }

        // Show form to add a new product.
        $('#btn-show-add-form').on('click', () => {
            $formTitle.text('Add New Product');
            $productForm[0].reset();
            $('#product-id').val('');
            showSellerContent($productFormContainer);
        });
        

        // Show product list.

        $('#btn-show-products, #btn-cancel').on('click', () => {
            renderSellerProducts();
            showSellerContent($productListContainer);
        });


        // Submit form data to API to create or update a product.
        $productForm.on('submit', async function(event) {
            event.preventDefault();
            const id = $('#product-id').val();
            const productData = {
                name: $('#product-name').val(),
                description: $('#product-description').val(),
                price: parseFloat($('#product-price').val()),
                image_url: $('#product-image').val(),
                type: 'product',
                category_id: 1 // Assign a default category.

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
                alert(`Product ${isUpdating ? 'updated' : 'created'} successfully.`);
                renderSellerProducts();
                showSellerContent($productListContainer);
            } catch (error) {
                alert('Error saving product.');
            }
        });


        // Load a product's data into the form for editing.
        $productGrid.on('click', '.btn-edit', async function() {
            const productId = $(this).data('id');
            try {
                const productToEdit = await $.ajax({
                    url: `http://localhost:5000/api/items/${productId}`,
                    method: 'GET',
                    headers: { 'Authorization': 'Bearer ' + authToken }
                });
                $formTitle.text('Update Product');
                $('#product-id').val(productToEdit.item_id);
                $('#product-name').val(productToEdit.name);
                $('#product-description').val(productToEdit.description);
                $('#product-price').val(productToEdit.price);
                $('#product-image').val(productToEdit.image_url);
                showSellerContent($productFormContainer);
            } catch (error) {
                alert('Could not load product for editing.');
            }
        });


        // Send API request to delete a product.
        $productGrid.on('click', '.btn-delete', async function() {
            const productId = $(this).data('id');
            if (confirm('Are you sure you want to delete this product?')) {
                try {
                    await $.ajax({
                        url: `http://localhost:5000/api/items/${productId}`,
                        method: 'DELETE',
                        headers: { 'Authorization': 'Bearer ' + authToken }
                    });
                    alert('Product deleted.');
                    renderSellerProducts();
                } catch (error) {
                    alert('Error deleting product.');
                }
            }
        });


        // Initial load of seller products if token exists.
        if(authToken) renderSellerProducts();
    }
});

// --- SIGN-UP FORM LOGIC ---
// Show/hide additional fields based on the selected role.
document.addEventListener('DOMContentLoaded', function () {
    var roleSelect = document.getElementById('register-role');
    var cargoSection = document.getElementById('cargo-section');
    var tiendaSection = document.getElementById('tienda-section');
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
});

// --- REGISTRATION AND LOGIN MODALS ---
// Show registration form.
document.addEventListener('DOMContentLoaded', function () {
    var showRegister = document.getElementById('show-register');
    var showLogin = document.getElementById('show-login');
    var registerModal = document.getElementById('register-modal');
    var registerCancel = document.getElementById('register-cancel');
    var loginForm = document.querySelector('.form-container');

    if (showRegister) {
        showRegister.onclick = function () {
            loginForm.style.display = 'none';
            registerModal.style.display = 'flex';
        };
    }
    if (showLogin) {
        showLogin.onclick = function () {
            registerModal.style.display = 'none';
            loginForm.style.display = 'flex';
        };
    }
    if (registerCancel) {
        registerCancel.onclick = function () {
            registerModal.style.display = 'none';
            loginForm.style.display = 'flex';
        };
    }
    // Close login with the X button.
    var loginCancel = document.querySelector('.form-cancel-icon');
    if (loginCancel) {
        loginCancel.onclick = function () {
            loginForm.style.display = 'none';
        };
    }
});

// Show login only when clicking the user icon.
document.addEventListener('DOMContentLoaded', function () {
    var userIcon = document.querySelector('.user-icon');
    var loginModal = document.getElementById('login-modal');
    var loginCancel = loginModal.querySelector('.form-cancel-icon');

    if (userIcon) {
        userIcon.onclick = function () {
            loginModal.style.display = 'flex';
        };
    }
    if (loginCancel) {
        loginCancel.onclick = function () {
            loginModal.style.display = 'none';
        };
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
    function showSection(sectionId) {
                    // Oculta todas las vistas principales
                    document.querySelectorAll('.main-view').forEach(function(view) {
                        view.classList.add('hidden');
                    });
                    // Muestra la vista seleccionada
                    var section = document.getElementById(sectionId);
                    if (section) {
                        section.classList.remove('hidden');
                        window.scrollTo(0, 0);
                    }
                    // Opcional: Oculta el menú móvil después de seleccionar
                    var mobileMenu = document.querySelector('.mobile-menu');
                    if (mobileMenu) {
                        mobileMenu.classList.add('hidden');
                    }
                }

