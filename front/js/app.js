$(document).ready(function () {
    // This function ensures the code runs only after the entire DOM (Document Object Model) is fully loaded and ready.

    // ===================================================================== //
    // ============ CONTROL VARIABLE FOR THE PRODUCT MODAL ================= //
    // --- Set to 'true' to view the modal with local test data. --------- //
    // --- Set to 'false' for the modal to use the live API. ------------- //
    // ===================================================================== //
    const USE_TEST_DATA_FOR_MODAL = true;

    // -------------------------------------------------------------------------
    // ---------------------------- CONFIG / STATE -----------------------------
    // -------------------------------------------------------------------------

    // Load state from localStorage on application start.
    // Retrieves the authentication token from the browser's local storage. Defaults to null if not found.
    let authToken = localStorage.getItem('userToken') || null;
    // Retrieves the current user's data, parsing it from a JSON string. Defaults to null.
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    // Retrieves the user's saved goals. Defaults to an empty array.
    let userGoals = JSON.parse(localStorage.getItem('userGoals')) || [];
    // --- Carrito local global ---
    let localCart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Placeholder for test items, to be populated if needed.
    const testItems = [];

    // -------------------------------------------------------------------------
    // --------------------- PLUGIN / UI INITIALIZATION ----------------------
    // -------------------------------------------------------------------------

    /**
     * Initializes the lightSlider plugins for image carousels.
     * Uses a try-catch block to prevent errors if the plugin isn't loaded.
     */
    function initSliders() {
        try {
            // Initializes the main banner slider.
            if ($('#adaptive').length) {
                $('#adaptive').lightSlider({
                    adaptiveHeight: true, auto: true, item: 1, slideMargin: 0, loop: true
                });
            }
            // Initializes the auto-width slider for product categories.
            if ($('#autoWidth').length) {
                $('#autoWidth').lightSlider({
                    autoWidth: true, loop: true, onSliderLoad: function () { $('#autoWidth').removeClass('cS-hidden'); }
                });
            }
        } catch (e) {
            console.warn('lightSlider init failed or not present', e);
        }
    }
    // Initialize sliders on page load.
    initSliders();



    // -------------------------------------------------------------------------
    // --------------------------- NAVIGATION (SPA) ----------------------------
    // -------------------------------------------------------------------------
    
    /**
     * Renders a list of products into a specified container, optionally filtering by category.
     * @param {string} containerId - The ID of the HTML element to render products into.
     * @param {string} categoryFilter - The category name to filter products by.
     */
    function renderProductsToView(containerId, categoryFilter) {
        // ... (This function's implementation is not shown, but it would render items to the view)
    }

    /**
     * Manages the single-page application (SPA) navigation by showing/hiding content sections.
     * @param {string} sectionId - The ID of the section to display.
     * @param {HTMLElement} element - The navigation tab element that was clicked.
     */
    window.showSection = function (sectionId, element) {
        // Hide all main content sections.
        $('.main-view').addClass('hidden');
        const $target = $('#' + sectionId);
        if ($target.length) {
            // Show the target section.
            $target.removeClass('hidden');
            // Re-initialize sliders if navigating to the home view on a large screen.
            if (sectionId === 'inicio-view' && window.innerWidth >= 768) initSliders();
            
            // Logic to render products when a category view is shown.
            if (sectionId === 'tecnologia-view') renderProductsToView('tecnologia-products-container', 'tecnologia');
            else if (sectionId === 'snacks-view') renderProductsToView('snacks-products-container', 'snacks');
            else if (sectionId === 'servicios-view') renderProductsToView('servicios-products-container', 'servicios');
            else if (sectionId === 'varios-view') renderProductsToView('varios-products-container', 'varios');
        }
        // Update the active state of navigation tabs.
        $('.nav-tab').removeClass('bg-[rgb(112,95,250)] text-white').addClass('text-gray-600');
        if (element) $(element).addClass('bg-[rgb(112,95,250)] text-white').removeClass('text-gray-600');
    };
    // Show the initial home view on page load.
    showSection('inicio-view', $('.nav-tab').first());
    
    // -------------------------------------------------------------------------
    // -------------------------- UI: EVENT HANDLERS ---------------------------
    // -------------------------------------------------------------------------

    // General UI event handlers for search, mobile menu, etc.
    $(document).on('click', '.search-icon', function () { $('.search-bar').removeClass('hidden').addClass('flex'); });
    $(document).on('click', '.search-cancel-icon', function () { $('.search-bar').addClass('hidden').removeClass('flex'); });
    $(document).on('click', '.menu-toggle', function () { $('.mobile-menu').toggleClass('hidden'); });

    // This is a KEY handler for user interaction, determining action based on authentication status.
    $(document).on('click', '.user-icon', function () {
        if (authToken && currentUser && currentUser.role === 'vendedor') {
            // If the user is a logged-in seller, show their profile view.
            // The profileSeller.js script will handle rendering the content.
            showSection('seller-profile-view', $('#seller-profile-link')[0]);
        } 
        else if (authToken) {
            // If user is logged in but not a seller, notify them.
            alert('You are already logged in.');
        } 
        else {
            // If no user is logged in, show the login modal.
            $('#login-modal').removeClass('hidden').addClass('flex');
        }
    });

    // Event handlers for navigating between login and register modals.
    $(document).on('click', '.already-account-btn', function() { $('#login-modal').removeClass('hidden').addClass('flex'); });
    $(document).on('click', '#show-register, .sign-up-btn', function () { $('#login-modal').addClass('hidden'); $('#register-modal').removeClass('hidden').addClass('flex'); });
    $(document).on('click', '#show-login', function () { $('#register-modal').addClass('hidden'); $('#login-modal').removeClass('hidden').addClass('flex'); });
    $(document).on('click', '.modal-cancel-icon, .form-cancel-icon', function () { $(this).closest('.modal-container').addClass('hidden').removeClass('flex'); });

    // Event handlers for main UI elements like cart and token modal.
    $('#modal-close').on('click', function () { closeModal(); });
    $('#cart-icon').on('click', function (e) { e.preventDefault(); showCartView(); });
    $(document).on('click', '#tokens-icon', function () { 
        if (authToken && currentUser) {
            // If logged in, show the tokens modal and display the current balance.
            $('#tokens-modal').removeClass('hidden').addClass('flex');
            $('#current-tokens').text(`${currentUser.wallet_balance || 0} Tokens`);
        } else {
            // If not logged in, prompt to log in. (Alert text: 'You must log in to see your tokens.')
            alert('Debes iniciar sesión para ver tus tokens.');
            $('#login-modal').removeClass('hidden').addClass('flex');
        }
     });
    $(document).on('click', '#tokens-modal-cancel', function () { $('#tokens-modal').addClass('hidden').removeClass('flex'); });

    // =======================================================================
    // ================ COMBINED PRODUCT MODAL LOGIC =========================
    // =======================================================================
    // Event handler for clicking on any product box.
    $('body').on('click', '.product-box', function () {
        // Get the item ID from the data attribute, or generate a random one for testing.
        const itemId = $(this).data('item-id') || Math.floor(Math.random() * 100) + 1;
        const clickedBox = $(this);

        // Check the control variable to decide whether to use local test data or the API.
        if (USE_TEST_DATA_FOR_MODAL) {
            console.log(`TEST MODE: Opening modal for product ID: ${itemId}`);
            // Use static, local data to populate the modal.
            const productData = {
                item_id: itemId, name: "Local Test Product",
                description: "This is a fictional product description loaded locally for testing.",
                price: "99.999", token_price: 150,
                image_url: clickedBox.find('img').attr('src') // Use the image from the clicked box.
            };
            // Populate modal fields with test data.
            $('#modal-img').attr('src', productData.image_url);
            $('#modal-name').text(productData.name + " (ID: " + productData.item_id + ")");
            $('#modal-description').text(productData.description);
            $('#modal-price').text(`$${productData.price}`);
            if (productData.token_price) {
                $('#modal-token-price').text(productData.token_price);
                $('#redeem-button').show();
            } else {
                $('#modal-token-price').text('Not redeemable');
                $('#redeem-button').hide();
            }
            // Set data attributes for buttons.
            $('#redeem-button').data('item_id', productData.item_id);
            $('#modal-add-to-cart-btn').data('item_id', productData.item_id);
            // Show the modal with a smooth animation.
            $('#product-modal').removeClass('hidden').addClass('flex');
            setTimeout(() => { $('#modal-content-wrapper').removeClass('scale-95 opacity-0').addClass('scale-100 opacity-100'); }, 10);
        } else {
            // Use the live API to fetch product data.
            console.log(`API MODE: Fetching product ID: ${itemId}`);
            if (!parseInt(itemId)) return; // Exit if itemId is not a valid number.
            $.ajax({
                url: `https://riwihub-back.onrender.com/api/items/${itemId}`,
                method: 'GET',
                success: function (productData) {
                    // Use the image from the clicked box as a fallback.
                    const itemImageSrc = clickedBox.find('img').attr('src') || productData.image_url || '';
                    // Populate modal with data from the API response.
                    $('#modal-img').attr('src', itemImageSrc);
                    $('#modal-name').text(productData.name || 'No name');
                    $('#modal-description').text(productData.description || 'No description available.');
                    $('#modal-price').text(`$${new Intl.NumberFormat('es-CO').format(productData.price || 0)}`);
                    
                    // Logic for the redeem with tokens button.
                    if (productData.token_price) {
                        $('#redeem-button').show();
                        $('#modal-token-price').text(productData.token_price);
                        const userTokens = currentUser ? currentUser.wallet_balance : 0;
                        const requiredTokens = productData.token_price;
                        // Check if the user has enough tokens.
                        if (userTokens >= requiredTokens) {
                            // Enable the redeem button.
                            $('#redeem-button').removeClass('bg-gray-400 cursor-not-allowed').addClass('bg-teal-500 hover:bg-teal-600').prop('disabled', false);
                            // Message text: 'You have enough tokens to redeem this product!'
                            $('#token-message').text('¡Tienes suficientes tokens para canjear este producto!');
                        } else {
                            // Disable the redeem button if tokens are insufficient.
                            $('#redeem-button').addClass('bg-gray-400 cursor-not-allowed').removeClass('bg-teal-500 hover:bg-teal-600').prop('disabled', true);
                            const neededTokens = requiredTokens - userTokens;
                            // Message text: `You are ${neededTokens} tokens short to redeem it.`
                            $('#token-message').text(`Te faltan ${neededTokens} tokens para poder canjearlo.`);
                        }
                    } else {
                        $('#redeem-button').hide();
                    }
                    // Set data attributes for buttons.
                    $('#redeem-button').data('item_id', productData.item_id);
                    $('#modal-add-to-cart-btn').data('item_id', productData.item_id);
                    // Show the modal with animation.
                    $('#product-modal').removeClass('hidden').addClass('flex');
                    setTimeout(() => { $('#modal-content-wrapper').removeClass('scale-95 opacity-0').addClass('scale-100 opacity-100'); }, 10);
                },
                error: function () {
                    // Alert text: 'Product not found or an error occurred while loading it.'
                    alert('Producto no encontrado o ocurrió un error al cargarlo.');
                }
            });
        }
    });

    // Event handler for "Add to Cart" button on product cards.
    $('body').on('click', '.add-to-cart-btn', function (e) {
        e.stopPropagation(); // Prevents the product modal from opening.
        const itemId = parseInt($(this).closest('.product-box').data('item-id'));
        addItemToCart(itemId);
    });
    
    // Event handler for "Add to Cart" button inside the modal.
    $('#modal-add-to-cart-btn').on('click', function () {
        const itemId = $(this).data('item_id');
        closeModal();
        addItemToCart(itemId);
    });

    // Event handler for the "Redeem" button in the modal.
    $('#redeem-button').on('click', function () {
        // Alert text: 'Starting redeem process for product... (Simulated functionality)'
        alert(`Iniciando proceso de canje para el producto ${$(this).data('item_id')}. (Funcionalidad simulada)`);
        closeModal();
    });

    function saveCart() {
            saveCart();
            alert(`${product.name} agregado al carrito.`);
            showCartView();
        }


        function removeItemFromCart(id) {
            localCart = localCart.filter(item => item.id !== id);
            saveCart();
            showCartView();
        }


        function showCartView() {
            showSection('cart-view');
            const container = $('#cart-items-container');
            container.empty();


        if (localCart.length === 0) {
            container.html('<p class="text-center text-gray-500">Tu carrito está vacío.</p>');
            $('#cart-total').text('$0');
            $('#cart-item-count').text('0');
            return;
        }


        let total = 0;
        let totalItems = 0;


        localCart.forEach(item => {
        const price = parseFloat(item.price || 0);
        const subtotal = price * item.quantity;
        total += subtotal;
        totalItems += item.quantity;


        const itemHtml = `
            <div class="flex items-center justify-between border-b pb-4 mb-4">
                <div class="flex items-center">
                    <img src="${item.image_url || 'https://via.placeholder.com/80'}" class="w-20 h-20 object-cover rounded" alt="${item.name}">
                    <div class="ml-4">
                        <p class="font-bold text-lg">${item.name}</p>
                        <p class="text-gray-600">$${new Intl.NumberFormat('es-CO').format(price)}</p>
                    </div>
                </div>
                <div><p>Cantidad: ${item.quantity}</p></div>
                    <button class="remove-from-cart-btn text-red-500 hover:text-red-700" data-item-id="${item.id}"><i class="fas fa-trash"></i></button>
            </div>`;
            container.append(itemHtml);
        });


        $('#cart-total').text(`$${new Intl.NumberFormat('es-CO').format(total)}`);
        $('#cart-item-count').text(totalItems);
        }


        // Evento eliminar producto
        $('body').on('click', '.remove-from-cart-btn', function () {
        const id = parseInt($(this).data('item-id'));
        if (!confirm('¿Quitar este producto del carrito?')) return;
        removeItemFromCart(id);
        });
        
        function saveCart() {
        saveCart();
        alert(`${product.name} agregado al carrito.`);
        showCartView();
        }


        function removeItemFromCart(id) {
        localCart = localCart.filter(item => item.id !== id);
        saveCart();
        showCartView();
        }


        function showCartView() {
        showSection('cart-view');
        const container = $('#cart-items-container');
        container.empty();


        if (localCart.length === 0) {
        container.html('<p class="text-center text-gray-500">Tu carrito está vacío.</p>');
        $('#cart-total').text('$0');
        $('#cart-item-count').text('0');
        return;
        }


        let total = 0;
        let totalItems = 0;


        localCart.forEach(item => {
        const price = parseFloat(item.price || 0);
        const subtotal = price * item.quantity;
        total += subtotal;
        totalItems += item.quantity;


        const itemHtml = `
        <div class="flex items-center justify-between border-b pb-4 mb-4">
        <div class="flex items-center">
        <img src="${item.image_url || 'https://via.placeholder.com/80'}" class="w-20 h-20 object-cover rounded" alt="${item.name}">
        <div class="ml-4">
        <p class="font-bold text-lg">${item.name}</p>
        <p class="text-gray-600">$${new Intl.NumberFormat('es-CO').format(price)}</p>
        </div>
        </div>
        <div><p>Cantidad: ${item.quantity}</p></div>
        <button class="remove-from-cart-btn text-red-500 hover:text-red-700" data-item-id="${item.id}"><i class="fas fa-trash"></i></button>
        </div>`;
        container.append(itemHtml);
        });


        $('#cart-total').text(`$${new Intl.NumberFormat('es-CO').format(total)}`);
        $('#cart-item-count').text(totalItems);
        }


        // Evento eliminar producto
        $('body').on('click', '.remove-from-cart-btn', function () {
        const id = parseInt($(this).data('item-id'));
        if (!confirm('¿Quitar este producto del carrito?')) return;
        removeItemFromCart(id);
        });

    // -------------------------------------------------------------------------
    // -------------------------- MODAL / ANIMATIONS ---------------------------
    // -------------------------------------------------------------------------

    /**
     * Closes the main product modal with a smooth animation.
     */
    function closeModal() {
        // First, trigger the closing animation.
        $('#modal-content-wrapper').removeClass('scale-100 opacity-100').addClass('scale-95 opacity-0');
        // After the animation completes, hide the modal container.
        setTimeout(() => {
            $('#product-modal').addClass('hidden').removeClass('flex');
        }, 300); // 300ms matches the transition duration.
    }

    // -------------------------------------------------------------------------
    // ----------------------------- AUTHENTICATION ----------------------------
    // -------------------------------------------------------------------------

    /**
     * Updates the UI elements based on the user's authentication status.
     * Shows/hides icons like goals, tokens, and the seller profile link.
     */
    function updateUIBasedOnAuth() {
        // Toggle visibility of icons for logged-in users.
        if (authToken && currentUser) {
            $('#metas-icon').removeClass('hidden');
            $('#tokens-icon').removeClass('hidden');
        } else {
            $('#metas-icon').addClass('hidden');
            $('#tokens-icon').addClass('hidden');
        }
        // Toggle visibility of the seller profile link.
        if (currentUser && currentUser.role === 'vendedor') {
            $('#seller-profile-link').removeClass('hidden');
        } else {
            $('#seller-profile-link').addClass('hidden');
        }
        // Update token counts in the UI.
        if (currentUser) {
            $('#tokens-icon .text-sm').text(currentUser.wallet_balance || 0);
            $('#current-tokens').text(`${currentUser.wallet_balance || 0} Tokens`);
        } else {
            $('#tokens-icon .text-sm').text('0');
            $('#current-tokens').text('0 Tokens');
        }
    }

    // Handles the login form submission.
    $('#login-modal form').on('submit', function (e) {
        e.preventDefault();
        const email = $('#login-email').val();
        const password = $('#login-password').val();
        $.ajax({
            url: 'https://riwihub-back.onrender.com/api/users/login',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ email, password }),
            success: function (res) {
                // On success, store token and user data.
                authToken = res.token;
                currentUser = res.user;
                localStorage.setItem('userToken', authToken);
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                // Alert text: `Login successful as ${currentUser.name}!`
                alert(`¡Inicio de sesión exitoso como ${currentUser.name}!`);
                $('#login-modal').addClass('hidden');
                updateUIBasedOnAuth(); // Refresh UI elements.
                showSection('inicio-view', $('.nav-tab').first()); // Navigate to home.
            },
            error: function (err) {
                console.error('Login error:', err);
                // Alert text: 'Login failed: ' + (error message or 'Unknown error.')
                alert('Falló el inicio de sesión: ' + (err.responseJSON.error || 'Error desconocido.'));
            }
        });
    });

    // Handles the registration form submission.
    $('#register-modal form').on('submit', function (e) {
        e.preventDefault();
        const name = $('#register-name').val();
        const email = $('#register-email').val();
        const password = $('#register-password').val();
        const role = $('#register-role').val();
        const cargo = $('#register-cargo').val(); // Position/Job title
        const storeName = $('#register-tienda').val(); // Store name
        
        if (!name || !email || !password) {
            // Alert text: 'Name, email, and password are required.'
            alert('Nombre, email y contraseña son requeridos.');
            return;
        }
        // Build the payload with required fields.
        const payload = { name, email, password, role };
        // Add optional fields based on selected role.
        if (role === 'administrador' || role === 'vendedor') {
            payload.cargo = cargo;
        }
        if (role === 'vendedor') {
            payload.store_name = storeName;
        }
        $.ajax({
            url: 'https://riwihub-back.onrender.com/api/users/register',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(payload),
            success: function (res) {
                // Alert text: 'Registration successful! You can now log in.'
                alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
                // Hide register modal and show login modal.
                $('#register-modal').addClass('hidden');
                $('#login-modal').removeClass('hidden').addClass('flex');
            },
            error: function (err) {
                console.error('Registration error:', err);
                // Alert text: 'Registration failed: ' + (error message or 'Unknown error.')
                alert('Falló el registro: ' + (err.responseJSON.message || 'Error desconocido.'));
            }
        });
    });

    // Shows/hides additional form fields based on the selected role in the registration form.
    $('#register-role').on('change', function () {
        const role = $(this).val();
        // Toggle visibility based on whether the role is admin or seller.
        $('#cargo-section').toggleClass('hidden', role !== 'administrador' && role !== 'vendedor');
        $('#tienda-section').toggleClass('hidden', role !== 'vendedor');
    });

    // -------------------------------------------------------------------------
    // ------------------------------ SHOPPING CART ----------------------------
    // -------------------------------------------------------------------------

    /**
     * Adds an item to the user's shopping cart via an API call.
     * @param {number} itemId - The ID of the item to add.
     */
    function addItemToCart(itemId) {
        // Check for authentication token before proceeding.
        if (!authToken) {
            // Alert text: 'Please log in to add products to the cart.'
            alert('Por favor, inicia sesión para añadir productos al carrito.');
            $('.user-icon').click(); // Programmatically open the login modal.
            return;
        }
        $.ajax({
            url: `https://riwihub-back.onrender.com/api/carts/add`,
            method: 'POST',
            contentType: 'application/json',
            headers: { 'Authorization': 'Bearer ' + authToken },
            data: JSON.stringify({ item_id: itemId, quantity: 1 }),
            success: function (res) {
                // Alert text: 'Product added to cart.'
                alert(res.message || 'Producto añadido al carrito.');
                showCartView(); // Refresh the cart view.
            },
            error: function (err) {
                console.error('Error adding to cart:', err);
                // Alert text: 'Error adding to cart, please try again.'
                alert('Error al añadir al carrito, por favor inténtalo de nuevo.');
            }
        });
    }

    /**
     * Fetches the user's cart from the API and triggers rendering.
     */
    async function showCartView() {
        showSection('cart-view'); // Navigate to the cart section.
        if (!authToken) {
            // Display message if user is not logged in. (Text: 'Log in to see your cart.')
            $('#cart-items-container').html('<p class="text-center text-indigo-500">Inicia sesión para ver tu carrito.</p>');
            return;
        }
        try {
            // Fetch cart items from the API.
            const cartItems = await $.ajax({
                url: 'https://riwihub-back.onrender.com/api/carts/',
                method: 'GET',
                headers: { 'Authorization': 'Bearer ' + authToken }
            });
            renderCartItems(cartItems); // Render the fetched items.
        } catch (error) {
            console.error('Error loading cart', error);
            // Display an error message if the fetch fails. (Text: 'Could not load your cart.')
            $('#cart-items-container').html('<p class="text-center text-red-500">No se pudo cargar tu carrito.</p>');
        }
    }

    /**
     * Renders the items in the shopping cart view and calculates the total.
     * @param {Array} items - An array of cart item objects from the API.
     */
    function renderCartItems(items) {
        const container = $('#cart-items-container');
        container.empty(); // Clear previous content.
        if (!items || items.length === 0) {
            // Display a message if the cart is empty.
            container.html('<p class="text-center text-gray-500">Tu carrito está vacío.</p>');
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
                            <p class="text-gray-600">$${new Intl.NumberFormat('es-CO').format(price)}</p>
                        </div>
                    </div>
                    <div><p>Quantity: ${cartItem.quantity}</p></div>
                    <button class="remove-from-cart-btn text-red-500 hover:text-red-700" data-item-id="${item.item_id}"><i class="fas fa-trash"></i></button>
                </div>`;
            container.append(itemHtml);
        });
        // Update the total price and item count display.
        $('#cart-total').text(`$${new Intl.NumberFormat('es-CO').format(total)}`);
        $('#cart-item-count').text(totalItems);
    }

    // Event handler for the remove from cart button.
    $('body').on('click', '.remove-from-cart-btn', function () {
        const id = parseInt($(this).data('item-id'));
        if (!authToken) {
            alert('You must be logged in.');
            return;
        }
        // Confirmation dialog text: 'Remove this product from the cart?'
        if (!confirm('¿Quitar este producto del carrito?')) return;
        $.ajax({
            url: `https://riwihub-back.onrender.com/api/carts/remove/${id}`,
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + authToken },
            success: function (res) {
                // Alert text: 'Product removed.'
                alert(res.message || 'Producto eliminado.');
                showCartView(); // Refresh the cart.
            },
            error: function () {
                // Alert text: 'Could not remove the product.'
                alert('No se pudo eliminar el producto.');
            }
        });
    });

    // -------------------------------------------------------------------------
    // ----------------------------- GOALS FUNCTIONALITY -----------------------
    // -------------------------------------------------------------------------

    /**
     * Renders the list of user goals into the goals modal.
     * Reads from the `userGoals` state variable.
     */
    function renderGoals() {
        const $goalsList = $('#metas-list');
        $goalsList.empty();
        // Show a message if there are no goals.
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
                </div>`;
            $goalsList.append(goalHtml);
        });
    }

    /**
     * Saves the current `userGoals` array to localStorage.
     */
    function saveGoals() {
        localStorage.setItem('userGoals', JSON.stringify(userGoals));
    }
    
    // Event handlers for the goals modal.
    $(document).on('click', '#metas-icon', function () {
        $('#metas-modal').removeClass('hidden').addClass('flex');
        renderGoals();
    });
    $(document).on('click', '#metas-modal-cancel', function () {
        $('#metas-modal').addClass('hidden').removeClass('flex');
    });

    // Handle form submission to add a new goal.
    $('#add-meta-form').on('submit', function (e) {
        e.preventDefault();
        const newMetaText = $('#new-meta-text').val().trim();
        if (newMetaText) {
            const newGoal = { text: newMetaText, completed: false, created_at: new Date().toISOString() };
            userGoals.push(newGoal);
            saveGoals();
            renderGoals();
            $('#new-meta-text').val(''); // Clear the input field.
        }
    });

    // Handle checking/unchecking a goal's checkbox.
    $(document).on('change', '.meta-checkbox', function () {
        const index = $(this).data('index');
        userGoals[index].completed = this.checked;
        saveGoals();
        renderGoals();
    });

    // Handle deleting a goal.
    $(document).on('click', '.delete-meta-btn', function () {
        const index = $(this).data('index');
        userGoals.splice(index, 1); // Remove the goal from the array.
        saveGoals();
        renderGoals();
    });

    // -------------------------------------------------------------------------
    // -------------------- ADDITIONAL LOGIC / UTILS ---------------------------
    // -------------------------------------------------------------------------

    // Handles the logout process.
    $(document).on('click', '#logout-btn', function () {
        // Confirmation dialog text: 'Are you sure you want to log out?'
        if (!confirm('¿Estás seguro de que quieres cerrar sesión?')) return;
        // Clear user data from localStorage and state variables.
        localStorage.removeItem('userToken');
        localStorage.removeItem('currentUser');
        authToken = null;
        currentUser = null;
        updateUIBasedOnAuth();
        // Alert text: 'Logged out successfully.'
        alert('Sesión cerrada exitosamente.');
        showSection('inicio-view');
    });

    // Initial UI update on page load to reflect authentication status.
    updateUIBasedOnAuth();
});

/**
 * The following code is outside the jQuery `ready` function and uses vanilla JavaScript.
 * It ensures certain UI elements are handled correctly as soon as the DOM is loaded.
 */
document.addEventListener("DOMContentLoaded", function () {
    // This listener attaches a click event to the profile icon for a specific render function.
    var profileBtn = document.getElementById("profileIcon");
    if (profileBtn) {
        profileBtn.addEventListener("click", function (e) {
            e.preventDefault();
            // Calls a globally available function to render the profile view.
            if (window.renderProfileView) {
                window.renderProfileView();
            }
        });
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const TOKEN_KEY = "userToken";
    const logoutBtn = document.getElementById("logout-btn");

    /**
     * Toggles the visibility of the logout button based on the presence of a user token.
     */
    function updateLogoutVisibility() {
        const token = localStorage.getItem(TOKEN_KEY);
        if (!logoutBtn) return;
        // Hides the button if no token is found, shows it otherwise.
        logoutBtn.classList.toggle("hidden", !token);
    }

    // Listens to the 'storage' event to update in real-time if the token changes in another tab.
    window.addEventListener('storage', updateLogoutVisibility);

    // Adds click event listener for the logout button.
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function (e) {
            e.preventDefault();
            // Remove user-specific data from localStorage.
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem("currentUser");
            // You could also clear 'userGoals' if they are user-specific.
            localStorage.removeItem("userGoals");  
    
            // Updates visibility and reloads the page for a clean state.
            updateLogoutVisibility();
            window.location.reload();  
        });
    }

    // Run on initial load to set the correct visibility of the logout button.
    updateLogoutVisibility();
});