$(document).ready(function () {

    // -------------------------------------------------------------------------
    // ---------------------------- CONFIG / STATE -----------------------------
    // -------------------------------------------------------------------------

    // Load state from localStorage
    let authToken = localStorage.getItem('userToken') || null;
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    // Nueva variable para las metas
    let userGoals = JSON.parse(localStorage.getItem('userGoals')) || [];

    // -------------------------------------------------------------------------
    // --------------------- PLUGIN / UI INITIALIZATION ----------------------
    // -------------------------------------------------------------------------

    // Initialize sliders (if they exist)
    function initSliders() {
        try {
            if ($('#adaptive').length) {
                $('#adaptive').lightSlider({
                    adaptiveHeight: true,
                    auto: true,
                    item: 1,
                    slideMargin: 0,
                    loop: true
                });
            }
            if ($('#autoWidth').length) {
                $('#autoWidth').lightSlider({
                    autoWidth: true,
                    loop: true,
                    onSliderLoad: function () { $('#autoWidth').removeClass('cS-hidden'); }
                });
            }
        } catch (e) {
            // If lightSlider is not loaded, prevent the app from breaking
            console.warn('lightSlider init failed or not present', e);
        }
    }

    // Run on startup
    initSliders();

    // -------------------------------------------------------------------------
    // --------------------------- NAVIGATION (SPA) ----------------------------
    // -------------------------------------------------------------------------

    // showSection: hides all .main-view views and shows the requested one.
    window.showSection = function (sectionId, element) {
        $('.main-view').addClass('hidden');
        const $target = $('#' + sectionId);
        if ($target.length) {
            $target.removeClass('hidden');

            // If it's the home view, re-initialize sliders to prevent glitches
            if (sectionId === 'inicio-view' && window.innerWidth >= 768) {
                initSliders();
            }
        }

        // Update the visual state of the active nav-tab
        $('.nav-tab').removeClass('bg-[rgb(112,95,250)] text-white').addClass('text-gray-600');
        if (element) {
            $(element).addClass('bg-[rgb(112,95,250)] text-white').removeClass('text-gray-600');
        }
    };

    // Show the default section
    showSection('inicio-view', $('.nav-tab').first());

    // -------------------------------------------------------------------------
    // -------------------------- UI: EVENT HANDLERS ---------------------------
    // -------------------------------------------------------------------------

    // Search bar
    $(document).on('click', '.search-icon', function () {
        $('.search-bar').removeClass('hidden').addClass('flex');
    });
    $(document).on('click', '.search-cancel-icon', function () {
        $('.search-bar').addClass('hidden').removeClass('flex');
    });

    // Mobile menu toggle
    $(document).on('click', '.menu-toggle', function () {
        $('.mobile-menu').toggleClass('hidden');
    });

    // Open login modal (from icon or other buttons)
    $(document).on('click', '.user-icon, .already-account-btn', function () {
        $('#login-modal').removeClass('hidden').addClass('flex');
    });

    // Switch to register modal
    $(document).on('click', '#show-register, .sign-up-btn', function () {
        $('#login-modal').addClass('hidden');
        $('#register-modal').removeClass('hidden').addClass('flex');
    });

    // Switch back to login from register
    $(document).on('click', '#show-login', function () {
        $('#register-modal').addClass('hidden');
        $('#login-modal').removeClass('hidden').addClass('flex');
    });

    // Close modals (from 'X' button or others)
    $(document).on('click', '.modal-cancel-icon, .form-cancel-icon', function () {
        $(this).closest('.modal-container').addClass('hidden').removeClass('flex');
    });

    // Close product modal (animated)
    $('#modal-close').on('click', function () {
        closeModal();
    });

    // Show the cart
    $('#cart-icon').on('click', function (e) {
        e.preventDefault();
        showCartView();
    });

    // Delegation: clicking on a product card opens the detail modal
    $('body').on('click', '.product-box', function () {
        const itemId = $(this).data('item-id');
        if (!itemId) return;
        const clickedBox = $(this);
        // Request to get product details
        $.ajax({
            url: `http://localhost:13000/api/items/${itemId}`,
            method: 'GET',
            success: function (productData) {
                // Populate modal with data
                const itemImageSrc = clickedBox.find('img').attr('src') || productData.image_url || '';
                $('#modal-img').attr('src', itemImageSrc);
                $('#modal-name').text(productData.name || 'No name');
                $('#modal-description').text(productData.description || 'No description available.');
                $('#modal-price').text(`$${new Intl.NumberFormat('en-US').format(productData.price || 0)}`);
                if (productData.token_price) {
                    $('#token-section, #redeem-button').show();
                    $('#modal-token-price').text(productData.token_price);
                } else {
                    $('#token-section, #redeem-button').hide();
                }
                $('#redeem-button').data('item_id', productData.item_id);
                $('#modal-add-to-cart-btn').data('item_id', productData.item_id);
                // Open modal with flex class
                $('#product-modal').removeClass('hidden').addClass('flex');
                // Small animation
                setTimeout(() => {
                    $('#modal-content-wrapper').removeClass('scale-95 opacity-0').addClass('scale-100 opacity-100');
                }, 10);
            },
            error: function () {
                alert('Could not load product information.');
            }
        });
    });

    // Prevent clicks on inner buttons from triggering the product modal
    $('body').on('click', '.add-to-cart-btn', function (e) {
        e.stopPropagation();
        const itemId = $(this).closest('.product-box').data('item-id');
        addItemToCart(itemId);
    });

    // Modal button: add to cart
    $('#modal-add-to-cart-btn').on('click', function () {
        closeModal();
        addItemToCart($(this).data('item_id'));
    });

    // Redeem placeholder
    $('#redeem-button').on('click', function () {
        alert(`Redeem functionality for item ${$(this).data('item_id')} is not yet implemented.`);
        closeModal();
    });

    // -------------------------------------------------------------------------
    // -------------------------- MODAL / ANIMATIONS ---------------------------
    // -------------------------------------------------------------------------

    function closeModal() {
        $('#modal-content-wrapper').removeClass('scale-100 opacity-100').addClass('scale-95 opacity-0');
        setTimeout(() => {
            $('#product-modal').addClass('hidden').removeClass('flex');
        }, 300);
    }

    // -------------------------------------------------------------------------
    // ----------------------------- AUTHENTICATION ----------------------------
    // -------------------------------------------------------------------------

    // Update UI related to auth (shows/hides metas icon)
    function updateUIBasedOnAuth() {
        if (authToken && currentUser) {
            // Muestra el icono de metas si el usuario está autenticado
            $('#metas-icon').removeClass('hidden');
        } else {
            // Oculta el icono de metas si no está autenticado
            $('#metas-icon').addClass('hidden');
        }
    }

    function updateUIBasedOnAuth() {
        if (authToken && currentUser) {
            $('#tokens-icon').removeClass('hidden');
            $('#tokens-icon .text-sm').text(currentUser.wallet_balance || 0);
            $('#current-tokens').text(`${currentUser.wallet_balance || 0} Tokens`);
        } else {
            $('#tokens-icon').addClass('hidden');
        // Optionally, clear other user-related UI fields
        }
    }

    // Login form handler (simulated)
    $('#login-modal form').on('submit', function (e) {
        e.preventDefault();
        const email = $('#login-email').val();
        const password = $('#login-password').val();

        $.ajax({
            url: 'http://localhost:13000/api/users/login',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ email, password }),
            success: function (res) {
                authToken = res.token;
                currentUser = res.user;
                localStorage.setItem('userToken', authToken);
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                alert('Login successful!');
                $('#login-modal').addClass('hidden');
                updateUIBasedOnAuth();
            },
            error: function (err) {
                console.error('Login error:', err);
                alert('Login failed: ' + (err.responseJSON.message || 'Unknown error.'));
            }
        });
    });

    // Registration form handler (UI only; implement actual request when endpoint is ready)
    $('#register-modal form').on('submit', function (e) {
        e.preventDefault();
        const name = $('#register-name').val();
        const email = $('#register-email').val();
        const password = $('#register-password').val();
        const role = $('#register-role').val();
        const cargo = $('#register-cargo').val();
        const storeName = $('#register-store-name').val();
        
        // Basic frontend validation
        if (!name || !email || !password) {
            alert('Name, email, and password are required.');
            return;
        }

        const payload = { name, email, password, role };
        if (role === 'administrador' || role === 'vendedor') {
            payload.cargo = cargo;
        }
        if (role === 'vendedor') {
            payload.store_name = storeName;
        }

        $.ajax({
            url: 'http://localhost:13000/api/users/register',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(payload),
            success: function (res) {
                alert('Registration successful! You can now log in.');
                $('#register-modal').addClass('hidden');
                $('#login-modal').removeClass('hidden').addClass('flex');
            },
            error: function (err) {
                console.error('Registration error:', err);
                alert('Registration failed: ' + (err.responseJSON.message || 'Unknown error.'));
            }
        });
    });

    // Show/hide additional fields in registration form based on role
    $('#register-role').on('change', function () {
        const role = $(this).val();
        $('#cargo-section').toggleClass('hidden', role !== 'administrador' && role !== 'vendedor');
        $('#tienda-section').toggleClass('hidden', role !== 'vendedor');
    });

    // -------------------------------------------------------------------------
    // ------------------------------ SHOPPING CART ---------------------------------
    // -------------------------------------------------------------------------

    // Add product to cart (uses backend endpoint)
    function addItemToCart(itemId) {
        if (!authToken) {
            alert('Please log in to add products to the cart.');
            $('.user-icon').click();
            return;
        }
        $.ajax({
            url: `http://localhost:13000/api/carts/add`,
            method: 'POST',
            contentType: 'application/json',
            headers: { 'Authorization': 'Bearer ' + authToken },
            data: JSON.stringify({ itemId: itemId, quantity: 1 }),
            success: function (res) {
                alert(res.message || 'Product added to cart.');
                showCartView();
            },
            error: function (err) {
                console.error('Error adding to cart:', err);
                alert('Error adding to cart, please try again.');
            }
        });
    }

    // View cart: fetches items and renders them
    async function showCartView() {
        showSection('cart-view');
        if (!authToken) {
            $('#cart-items-container').html('<p class="text-center text-indigo-500">Log in to see your cart.</p>');
            return;
        }
        try {
            const cartItems = await $.ajax({
                url: 'http://localhost:13000/api/carts/',
                method: 'GET',
                headers: { 'Authorization': 'Bearer ' + authToken }
            });
            renderCartItems(cartItems);
        } catch (error) {
            console.error('Error loading cart', error);
            $('#cart-items-container').html('<p class="text-center text-red-500">Could not load your cart.</p>');
        }
    }

    // Render the cart items
    function renderCartItems(items) {
        const container = $('#cart-items-container');
        container.empty();
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
            const price = parseFloat(item.price || 0);
            const subtotal = price * cartItem.quantity;
            total += subtotal;
            totalItems += cartItem.quantity;
            const itemHtml = `
                <div class="flex items-center justify-between border-b pb-4 mb-4">
                    <div class="flex items-center">
                        <img src="${item.image_url || 'https://via.placeholder.com/80'}" class="w-20 h-20 object-cover rounded" alt="${item.name}">
                        <div class="ml-4">
                            <p class="font-bold text-lg">${item.name}</p>
                            <p class="text-gray-600">$${new Intl.NumberFormat('en-US').format(price)}</p>
                        </div>
                    </div>
                    <div><p>Quantity: ${cartItem.quantity}</p></div>
                    <button class="remove-from-cart-btn text-red-500 hover:text-red-700" data-item-id="${item.item_id}"><i class="fas fa-trash"></i></button>
                </div>`;
            container.append(itemHtml);
        });
        $('#cart-total').text(`$${new Intl.NumberFormat('en-US').format(total)}`);
        $('#cart-item-count').text(totalItems);
    }

    // Remove item from cart (delegated)
    $('body').on('click', '.remove-from-cart-btn', function () {
        const id = $(this).data('item-id');
        if (!authToken) {
            alert('You must be logged in.');
            return;
        }
        if (!confirm('Remove this product from the cart?')) return;
        $.ajax({
            url: `http://localhost:13000/api/carts/remove/${id}`,
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + authToken },
            success: function (res) {
                alert(res.message || 'Product removed.');
                showCartView();
            },
            error: function () {
                alert('Could not remove the product.');
            }
        });
    });

    // -------------------------------------------------------------------------
    // ------------------------- SELLER PROFILE ---------------------------
    // -------------------------------------------------------------------------

    // Only run this logic if the seller profile view exists
    if ($('#seller-profile-view').length > 0) {

        const $productGrid = $('#product-grid');
        const $productListContainer = $('#product-list-container');
        const $productFormContainer = $('#product-form-container');
        const $formTitle = $('#form-title');
        const $productForm = $('#product-form');

        // Load seller's products
        async function renderSellerProducts() {
            $productGrid.empty();
            if (!authToken) {
                $productGrid.html('<p class="text-center text-red-500 col-span-full">You must log in to view your products.</p>');
                return;
            }
            try {
                const products = await $.ajax({
                    url: 'http://localhost:13000/api/items',
                    method: 'GET',
                    headers: { 'Authorization': 'Bearer ' + authToken }
                });
                if (!products || products.length === 0) {
                    $productGrid.html('<p class="text-center text-gray-500 col-span-full">You don’t have any products. Add one.</p>');
                    return;
                }
                products.forEach(product => {
                    const productCardHTML = `
                        <div class="bg-white border rounded-lg shadow-md overflow-hidden">
                            <img src="${product.image_url || 'https://via.placeholder.com/300x200'}" alt="${product.name}" class="w-full h-48 object-cover">
                            <div class="p-4">
                                <h3 class="text-lg font-bold">${product.name}</h3>
                                <p class="text-gray-600 text-sm mt-2">${product.description || ''}</p>
                                <p class="text-xl font-semibold text-teal-600 mt-4">$${new Intl.NumberFormat('en-US').format(product.price || 0)}</p>
                            </div>
                            <div class="bg-gray-50 p-3 flex justify-end gap-2">
                                <button class="btn-edit text-sm font-medium text-white bg-yellow-500 py-1 px-3 rounded hover:bg-yellow-600" data-id="${product.item_id}">✏️ Edit</button>
                                <button class="btn-delete text-sm font-medium text-white bg-red-500 py-1 px-3 rounded hover:bg-red-600" data-id="${product.item_id}">🗑️ Delete</button>
                            </div>
                        </div>`;
                    $productGrid.append(productCardHTML);
                });
            } catch (error) {
                console.error('Error loading seller products', error);
                $productGrid.html('<p class="text-center text-red-500 col-span-full">Error loading products.</p>');
            }
        }

        // Show a specific section within the seller profile
        function showSellerContent($sectionToShow) {
            $productListContainer.addClass('hidden');
            $productFormContainer.addClass('hidden');
            $sectionToShow.removeClass('hidden');
        }

        // Button: show add product form
        $('#btn-show-add-form').on('click', function () {
            $formTitle.text('Add New Product');
            $productForm[0].reset();
            $('#product-id').val('');
            showSellerContent($productFormContainer);
        });

        // Button: show product list
        $('#btn-show-products, #btn-cancel').on('click', function () {
            renderSellerProducts();
            showSellerContent($productListContainer);
        });

        // Submit form: create or update product
        $productForm.on('submit', async function (event) {
            event.preventDefault();
            const id = $('#product-id').val();
            const productData = {
                name: $('#product-name').val(),
                description: $('#product-description').val(),
                price: parseFloat($('#product-price').val()),
                image_url: $('#product-image').val(),
                type: 'product',
                category_id: 1 // TODO: make dynamic if needed
            };
            const isUpdating = !!id;
            const url = isUpdating ? `http://localhost:13000/api/items/${id}` : `http://localhost:13000/api/items`;
            const method = isUpdating ? 'PUT' : 'POST';
            try {
                await $.ajax({
                    url,
                    method,
                    contentType: 'application/json',
                    headers: { 'Authorization': 'Bearer ' + authToken },
                    data: JSON.stringify(productData)
                });
                alert(`Product ${isUpdating ? 'updated' : 'created'} successfully.`);
                renderSellerProducts();
                showSellerContent($productListContainer);
            } catch (error) {
                console.error('Error saving product', error);
                alert('Error saving product.');
            }
        });

        // Load product data into form for editing
        $productGrid.on('click', '.btn-edit', async function () {
            const productId = $(this).data('id');
            try {
                const productToEdit = await $.ajax({
                    url: `http://localhost:13000/api/items/${productId}`,
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
                console.error('Could not load product for editing', error);
                alert('Could not load product for editing.');
            }
        });

        // Delete product
        $productGrid.on('click', '.btn-delete', async function () {
            const productId = $(this).data('id');
            if (!confirm('Are you sure you want to delete this product?')) return;
            try {
                await $.ajax({
                    url: `http://localhost:13000/api/items/${productId}`,
                    method: 'DELETE',
                    headers: { 'Authorization': 'Bearer ' + authToken }
                });
                alert('Product deleted.');
                renderSellerProducts();
            } catch (error) {
                console.error('Error deleting product', error);
                alert('Error deleting product.');
            }
        });

        // Initial load of seller products if authenticated
        if (authToken) renderSellerProducts();
    } // end seller-profile-view check

    // -------------------------------------------------------------------------
    // ----------------------------- METAS / GOALS -----------------------------
    // -------------------------------------------------------------------------

    // Función para renderizar la lista de metas en el modal
    function renderGoals() {
        const $goalsList = $('#metas-list');
        $goalsList.empty();
        
        // Muestra u oculta el mensaje de "no hay metas"
        if (userGoals.length === 0) {
            $('#no-metas-message').removeClass('hidden');
        } else {
            $('#no-metas-message').addClass('hidden');
        }

        userGoals.forEach((goal, index) => {
            const goalHtml = `
                <div class="meta-item flex justify-between items-center p-4 border rounded-lg transition-colors ${goal.completed ? 'bg-green-100 border-green-400' : 'hover:bg-gray-50'}">
                    <div class="flex items-center gap-3">
                        <input type="checkbox" class="meta-checkbox form-checkbox h-5 w-5 text-teal-500" data-index="${index}" ${goal.completed ? 'checked' : ''}>
                        <span class="text-lg font-semibold text-gray-700 ${goal.completed ? 'line-through text-gray-500' : ''}">
                            ${goal.text}
                        </span>
                    </div>
                    <button class="delete-meta-btn text-red-500 hover:text-red-700" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            $goalsList.append(goalHtml);
        });
    }

    // Guarda las metas en el localStorage
    function saveGoals() {
        localStorage.setItem('userGoals', JSON.stringify(userGoals));
    }

    // Manejador para abrir el modal de metas
    $(document).on('click', '#metas-icon', function () {
        $('#metas-modal').removeClass('hidden').addClass('flex');
        renderGoals(); // Renderiza las metas cada vez que se abre el modal
    });

    // Manejador para cerrar el modal de metas
    $(document).on('click', '#metas-modal-cancel', function () {
        $('#metas-modal').addClass('hidden').removeClass('flex');
    });

    // Manejador del formulario para añadir una nueva meta
    $('#add-meta-form').on('submit', function (e) {
        e.preventDefault();
        const newMetaText = $('#new-meta-text').val().trim();
        if (newMetaText) {
            const newGoal = {
                text: newMetaText,
                completed: false,
                created_at: new Date().toISOString()
            };
            userGoals.push(newGoal);
            saveGoals();
            renderGoals();
            $('#new-meta-text').val(''); // Limpia el input
        }
    });

    // Manejador para marcar una meta como completada (delegación de eventos)
    $(document).on('change', '.meta-checkbox', function () {
        const index = $(this).data('index');
        userGoals[index].completed = this.checked;
        saveGoals();
        renderGoals(); // Vuelve a renderizar para actualizar el estilo
    });

    // Manejador para eliminar una meta (delegación de eventos)
    $(document).on('click', '.delete-meta-btn', function () {
        const index = $(this).data('index');
        userGoals.splice(index, 1);
        saveGoals();
        renderGoals();
    });

    // -------------------------------------------------------------------------
    // -------------------- ADDITIONAL LOGIC / UTILS -----------------------
    // -------------------------------------------------------------------------

    // Logout handler (if you have a dedicated logout button)
    $(document).on('click', '#logout-btn', function () {
        if (!confirm('Log out?')) return;
        localStorage.removeItem('userToken');
        localStorage.removeItem('currentUser');
        authToken = null;
        currentUser = null;
        updateUIBasedOnAuth();
        alert('Logged out.');
        showSection('inicio-view');
    });

    // Final UI update on page load
    updateUIBasedOnAuth();
});