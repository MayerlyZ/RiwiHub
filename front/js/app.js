$(document).ready(function () {
    // This function ensures the code runs only after the entire DOM (Document Object Model) is fully loaded and ready.

    // 🚨 ===================================================================== 🚨
    // 🚨 ====== DEV VARIABLE to toggle product modal behavior ============== 🚨
    // 🚨 --- Set to 'true' to use local placeholder data for the modal. -- 🚨
    // 🚨 --- Set to 'false' to have the modal fetch data from the live API. -- 🚨
    // 🚨 ===================================================================== 🚨
    const USE_TEST_DATA_FOR_MODAL = false;

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
    // --- Global local cart ---
    // Manages the cart state locally. It's loaded from localStorage or initialized as an empty array.
    let localCart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Placeholder for test items, to be populated if needed for development.
    const testItems = [];

    // -------------------------------------------------------------------------
    // --------------------- PLUGIN / UI INITIALIZATION ----------------------
    // -------------------------------------------------------------------------

    /**
     * @description Initializes the lightSlider plugins for image carousels.
     * Uses a try-catch block to prevent errors if the lightSlider library isn't loaded.
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
            // Log a warning to the console if the plugin fails, but don't stop the script.
            console.warn('lightSlider init failed or not present', e);
        }
    }
    // Initialize sliders on page load.
    initSliders();



    // -------------------------------------------------------------------------
    // --------------------------- NAVIGATION (SPA) ----------------------------
    // -------------------------------------------------------------------------
    
    /**
     * @description Renders a list of products into a specified container, optionally filtering by category.
     * @param {string} containerId - The ID of the HTML element to render products into.
     * @param {string} categoryFilter - The category name to filter products by.
     */
    function renderProductsToView(containerId, categoryFilter) {
        // ... (This function's implementation would render items into the specified view)
    }

    /**
     * @description Manages the single-page application (SPA) navigation by showing/hiding content sections.
     * @param {string} sectionId - The ID of the section to display.
     * @param {HTMLElement} [element] - The navigation tab element that was clicked, used for styling.
     */
    window.showSection = function (sectionId, element) {
        // Hide all main content sections first.
        $('.main-view').addClass('hidden');
        const $target = $('#' + sectionId);
        if ($target.length) {
            // Show the target section if it exists.
            $target.removeClass('hidden');
            // Re-initialize sliders if navigating to the home view on a large screen to prevent layout issues.
            if (sectionId === 'inicio-view' && window.innerWidth >= 768) initSliders();

            // Logic to render products when a specific category view is shown.
            if (sectionId === 'tecnologia-view') renderProductsToView('tecnologia-products-container', 'tecnologia');
            else if (sectionId === 'snacks-view') renderProductsToView('snacks-products-container', 'snacks');
            else if (sectionId === 'servicios-view') renderProductsToView('servicios-products-container', 'servicios');
            else if (sectionId === 'varios-view') renderProductsToView('varios-products-container', 'varios');
            else if (sectionId === 'profile-view') renderUserProfile(); // <-- AÑADE ESTA LÍNEA
        }
        // Update the active state of navigation tabs for visual feedback.
        $('.nav-tab').removeClass('bg-[rgb(112,95,250)] text-white').addClass('text-gray-600');
        if (element) $(element).addClass('bg-[rgb(112,95,250)] text-white').removeClass('text-gray-600');
    };
    // Show the initial home view on page load.
    showSection('inicio-view', $('.nav-tab').first());
    
    // -------------------------------------------------------------------------
    // -------------------------- UI: EVENT HANDLERS ---------------------------
    // -------------------------------------------------------------------------

    // General UI event handlers for search bar, mobile menu, etc.
    $(document).on('click', '.search-icon', function () { $('.search-bar').removeClass('hidden').addClass('flex'); });
    $(document).on('click', '.search-cancel-icon', function () { $('.search-bar').addClass('hidden').removeClass('flex'); });

    // This is a KEY handler for user interaction, determining action based on authentication status.
    $(document).on('click', '.user-icon', function () {
        if (authToken && currentUser && currentUser.role === 'vendedor') {
            // If the user is a logged-in seller, show their profile view.
            // The profileSeller.js script will handle rendering the content inside that view.
            showSection('seller-profile-view', $('#seller-profile-link')[0]);
        } 
        else if (authToken) {
            // If user is logged in but not a seller, notify them. (Alert text: 'You are already logged in.')
            alert('Ya has iniciado sesión.');
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
    
    // Generic handler to close any modal by finding its parent container.
    $(document).on('click', '.modal-cancel-icon, .form-cancel-icon', function () { $(this).closest('.modal-container').addClass('hidden').removeClass('flex'); });

    // Event handlers for main UI elements like cart and token modal.
    $('#modal-close').on('click', function () { closeModal(); });
    $('#cart-icon').on('click', function (e) { e.preventDefault(); showCartViewAPI(); });
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
    // Event handler for clicking on any product box. Uses event delegation.
    $('body').on('click', '.product-box', function () {
        // Get the item ID from the data attribute, or generate a random one for testing.
        const itemId = $(this).data('item-id');
        const clickedBox = $(this);

        // If the product card is missing an ID, log an error and do nothing.
        if (!itemId) {
            console.error("Clicked product is missing a 'data-item-id'. Cannot open modal.");
            return;
        }

        // Check the control variable to decide whether to use local test data or the API.
        if (USE_TEST_DATA_FOR_MODAL) {
            console.log(`TEST MODE: Opening modal for product ID: ${itemId}`);
            // Use static, local data to populate the modal.
            const productData = {
                item_id: itemId, name: "Local Test Product",
                description: "This is a fictional product description loaded locally for testing.",
                price: "99.999", price_token: 150,
                image_url: clickedBox.find('img').attr('src') // Use the image from the clicked box.
            };
            // Populate modal fields with test data.
            $('#modal-img').attr('src', productData.image_url);
            $('#modal-name').text(productData.name + " (ID: " + productData.item_id + ")");
            $('#modal-description').text(productData.description);
            $('#modal-price').text(`$${productData.price}`);
            if (productData.price_token) {
                $('#modal-token-price').text(productData.price_token);
                $('#redeem-button').show();
            } else {
                $('#modal-token-price').text('Not redeemable');
                $('#redeem-button').hide();
            }
            // Set data attributes on buttons for later use.
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
                    if (productData.price_token) {
                        $('#redeem-button').show();
                        $('#modal-token-price').text(productData.price_token);
                        const userTokens = currentUser ? currentUser.wallet_balance : 0;
                        const requiredTokens = productData.price_token;
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
                    // Set data attributes on buttons for later use.
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
        e.stopPropagation(); // Prevents the product modal from opening simultaneously.
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

    // NOTE: There is duplicated code for the shopping cart below. I will comment on the first block.

    /**
     * @description Saves the local cart to localStorage and updates the view.
     */
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(localCart));
    }

    /**
     * @description Adds a product to the local cart array.
     * @param {object} product - The product object to add.
     */
    function addItemToLocalCart(product) {
        // Implementation for adding item to 'localCart' array would go here.
        saveCart();
        alert(`${product.name} agregado al carrito.`);
        showCartView();
    }

    /**
     * @description Removes an item from the local cart by its ID.
     * @param {number} id - The ID of the item to remove.
     */
    function removeItemFromCart(id) {
        localCart = localCart.filter(item => item.id !== id);
        saveCart();
        showCartView();
    }

    /**
     * @description Displays the contents of the local cart.
     */
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

            const itemHtml = `<!-- HTML for a single cart item -->`;
            container.append(itemHtml);
        });

        $('#cart-total').text(`$${new Intl.NumberFormat('es-CO').format(total)}`);
        $('#cart-item-count').text(totalItems);
    }


    // Event handler for removing a product from the local cart.
    $('body').on('click', '.remove-from-cart-btn', function () {
        const id = parseInt($(this).data('item-id'));
        if (!confirm('¿Quitar este producto del carrito?')) return;
        removeItemFromCart(id);
    });
        
    // (The duplicated cart functions below are ignored as they are identical to the ones above)


    // -------------------------------------------------------------------------
    // -------------------------- MODAL / ANIMATIONS ---------------------------
    // -------------------------------------------------------------------------

    /**
     * @description Closes the main product modal with a smooth animation.
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

    $(document).on('click', '#add-product-icon', function() {
        showSection('seller-profile-view');
    });

    // Event handlers for login/register modals
    $(document).on('click', '.already-account-btn', function() { $('#login-modal').removeClass('hidden').addClass('flex'); });
    $(document).on('click', '#show-register, .sign-up-btn', function () { $('#login-modal').addClass('hidden'); $('#register-modal').removeClass('hidden').addClass('flex'); });
    $(document).on('click', '#show-login', function () { $('#register-modal').addClass('hidden'); $('#login-modal').removeClass('hidden').addClass('flex'); });
    $(document).on('click', '.modal-cancel-icon, .form-cancel-icon', function () { $(this).closest('.modal-container').addClass('hidden').removeClass('flex'); });

    // Handlers for cart and token icons/modals
    $('#modal-close').on('click', function () { closeModal(); });
    $('#cart-icon').on('click', function (e) { e.preventDefault(); showCartViewAPI(); });
    $(document).on('click', '#tokens-icon', function () { 
        if (authToken && currentUser) {
            $('#tokens-modal').removeClass('hidden').addClass('flex');
            $('#current-tokens').text(`${currentUser.wallet_balance || 0} Tokens`);
        } else {
            alert('Debes iniciar sesión para ver tus tokens.');
            $('#login-modal').removeClass('hidden').addClass('flex');
        }
    });
    $(document).on('click', '#tokens-modal-cancel', function () { $('#tokens-modal').addClass('hidden').removeClass('flex'); });

    /**
     * @description Updates the UI elements based on the user's authentication status and role.
     * Shows/hides icons like goals, tokens, and the seller profile link.
     */
     function updateUIBasedOnAuth() {
        // First, hide all role-specific icons for a clean slate.
        $('#metas-icon, #tokens-icon, #add-product-icon, #logout-btn').addClass('hidden');
        $('#seller-profile-link').addClass('hidden'); // Also hide the mobile menu link

        // Check if a user is logged in.
        if (authToken && currentUser) {
            // Show icons common to ALL logged-in users.
            $('#metas-icon').removeClass('hidden');
            $('#logout-btn').removeClass('hidden');

            // Now, show icons based on the specific role.
            if (currentUser.role === 'seller' || currentUser.role === 'admin') {
                // For sellers/admins: show the '+' icon and the profile link.
                $('#add-product-icon').removeClass('hidden');
                $('#seller-profile-link').removeClass('hidden'); // For mobile menu
            } else {
                // For clients (or any other role), show the tokens icon.
                $('#tokens-icon').removeClass('hidden');
            }
            
            // Update token balance text regardless of role.
            $('#current-tokens').text(`${currentUser.wallet_balance || 0} Tokens`);
            $('#token-balance').text(currentUser.wallet_balance || 0);
        }
    }

    // Login form submission handler.
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
                authToken = res.token;
                currentUser = res.user;
                localStorage.setItem('userToken', authToken);
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                alert(`¡Inicio de sesión exitoso como ${currentUser.name}!`);
                $('#login-modal').addClass('hidden');
                
                // CRITICAL: Update the UI right after successful login.
                updateUIBasedOnAuth(); 
                
                showSection('inicio-view', $('.nav-tab').first());
            },
            error: function (err) {
                console.error('Error de inicio de sesión:', err);
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
    // ------------------------------ SHOPPING CART (API Version)------------------
    // -------------------------------------------------------------------------

    /**
     * @description Adds an item to the user's shopping cart via an API call.
     * @param {number} itemId - The ID of the item to add.
     */
        function addItemToCart(itemId) {
            if (!authToken) {
                alert('Por favor, inicia sesión para añadir productos al carrito.');
                $('.user-icon').click();
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
                // CORRECTO: Llamamos a la función que carga el carrito desde la API.
                showCartViewAPI();
            },
            error: function (err) {
                console.error('Error adding to cart:', err);
                // MEJORA: Mostrar un error más específico del backend si está disponible.
                const errorMessage = err.responseJSON && err.responseJSON.message 
                    ? err.responseJSON.message 
                    : 'Error al añadir al carrito, por favor inténtalo de nuevo.';
                alert(errorMessage);
            }
        });
    }

    /**
     * @description Fetches the user's cart from the API and triggers rendering.
     */
    async function showCartViewAPI() { // Renamed to avoid conflict
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
            renderCartItemsAPI(cartItems); // Render the fetched items.
        } catch (error) {
            console.error('Error loading cart', error);
            // Display an error message if the fetch fails. (Text: 'Could not load your cart.')
            $('#cart-items-container').html('<p class="text-center text-red-500">No se pudo cargar tu carrito.</p>');
        }
    }

    /**
     * @description Renders the items in the shopping cart view and calculates the total.
     * @param {Array} items - An array of cart item objects from the API.
     */
    function renderCartItemsAPI(cart) {
        const items = cart.items || [];
        const container = $('#cart-items-container');
        container.empty();

        if (items.length === 0) {
            container.html('<p class="text-center text-gray-500">Tu carrito está vacío.</p>');
            $('#cart-total').text('$0');
            $('#cart-item-count').text('0');
            return;
        }

        let totalItems = 0;

        items.forEach(item => {
            const product = item.Item;
            const quantity = item.quantity;

            if (!product) {
                console.warn("El artículo del carrito no tiene detalles del producto:", item);
                return; // Omitir este artículo
            }

            totalItems += quantity;

            const itemHtml = `
                <div class="cart-item flex items-center justify-between p-4 border-b border-gray-200" data-item-id="${product.item_id}">
                    <div class="flex items-center gap-4 flex-1">
                        <img src="${product.image_url || 'front/images/logopestaña.png'}" alt="${product.name}" class="w-16 h-16 object-contain rounded-lg bg-gray-100 p-1">
                        <div>
                            <h3 class="font-semibold text-gray-800">${product.name}</h3>
                            <p class="text-sm text-gray-500">Precio: ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(product.price)}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2 sm:gap-6">
                        <div class="flex items-center gap-3 border rounded-md p-1">
                            <button class="quantity-change-api text-gray-600 hover:text-black px-1" data-item-id="${product.item_id}" data-change="-1">-</button>
                            <span class="font-semibold w-4 text-center">${quantity}</span>
                            <button class="quantity-change-api text-gray-600 hover:text-black px-1" data-item-id="${product.item_id}" data-change="1">+</button>
                        </div>
                        <p class="font-semibold w-20 sm:w-28 text-right text-gray-800">${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(product.price * quantity)}</p>
                        <button class="remove-from-cart-btn-api text-red-500 hover:text-red-700" data-item-id="${product.item_id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            container.append(itemHtml);
        });

        const total = cart.total || 0;
        $('#cart-total').text(new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(total));
        $('#cart-item-count').text(totalItems);
    }

    // Event handler for the remove from cart button (API version).
    $('body').on('click', '.remove-from-cart-btn-api', function () {
        const itemId = $(this).data('item-id');
        if (!itemId || !confirm('¿Quitar este producto del carrito?')) return;

        $.ajax({
            url: `https://riwihub-back.onrender.com/api/carts/remove`,
            method: 'POST',
            contentType: 'application/json',
            headers: { 'Authorization': 'Bearer ' + authToken },
            data: JSON.stringify({ item_id: itemId }),
            success: function(res) {
                alert(res.message || 'Producto eliminado del carrito.');
                showCartViewAPI(); // Refresh cart
            },
            error: function(err) {
                console.error('Error removing from cart:', err);
                const errorMessage = err.responseJSON?.message || 'Error al eliminar el producto del carrito.';
                alert(errorMessage);
            }
        });
    });

    // Event handler for changing quantity (API version)
    $('body').on('click', '.quantity-change-api', function() {
        const itemId = $(this).data('item-id');
        const change = parseInt($(this).data('change'));
        const currentQuantity = parseInt($(this).siblings('span').text());
        const newQuantity = currentQuantity + change;

        if (newQuantity < 1) {
            // If quantity becomes 0, trigger the remove action
            $('.remove-from-cart-btn-api[data-item-id="' + itemId + '"]').click();
            return;
        }
        updateCartItemQuantity(itemId, newQuantity);
    });

    /**
     * @description Updates an item's quantity in the cart via API.
     * @param {number} itemId The ID of the item to update.
     * @param {number} quantity The new quantity.
     */
    function updateCartItemQuantity(itemId, quantity) {
        $.ajax({
            url: `https://riwihub-back.onrender.com/api/carts/update`,
            method: 'PUT',
            contentType: 'application/json',
            headers: { 'Authorization': 'Bearer ' + authToken },
            data: JSON.stringify({ item_id: itemId, quantity: quantity }),
            success: function() {
                showCartViewAPI(); // Refresh view on success
            },
            error: function(err) {
                console.error('Error updating cart quantity:', err);
                const errorMessage = err.responseJSON?.message || 'Error al actualizar la cantidad.';
                alert(errorMessage);
                showCartViewAPI(); // Refresh to show server state
            }
        });
    }

    // -------------------------------------------------------------------------
    // ----------------------------- GOALS FUNCTIONALITY -----------------------
    // -------------------------------------------------------------------------

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
    // -------------------- ADDITIONAL LOGIC / UTILS -----------------------
    // -------------------------------------------------------------------------

    // Handles the logout process.
      // Logout handler.
    $(document).on('click', '#logout-btn', function () {
        if (!confirm('¿Estás seguro de que quieres cerrar sesión?')) return;
        localStorage.removeItem('userToken');
        localStorage.removeItem('currentUser');
        authToken = null;
        currentUser = null;
        
        // CRITICAL: Update the UI after logout.
        updateUIBasedOnAuth();
        
        alert('Sesión cerrada exitosamente.');
        showSection('inicio-view');
    });

    // Initial UI update on page load.
    updateUIBasedOnAuth();

    const $body = $('body');
    const $hamburger = $('#hamburger');
    const $mobileMenu = $('#mobile-menu');
    const $backdrop = $('#menu-backdrop');

    function openMobileMenu() {
    $mobileMenu.removeClass('hidden');
    $backdrop.removeClass('hidden');
    $hamburger.attr('aria-expanded', 'true');
    $hamburger.find('i').removeClass('fa-bars').addClass('fa-times');
    $body.addClass('overflow-hidden');
    }

    function closeMobileMenu() {
    $mobileMenu.addClass('hidden');
    $backdrop.addClass('hidden');
    $hamburger.attr('aria-expanded', 'false');
    $hamburger.find('i').removeClass('fa-times').addClass('fa-bars');
    $body.removeClass('overflow-hidden');
    }

    function toggleMobileMenu() {
    if ($mobileMenu.hasClass('hidden')) openMobileMenu(); else closeMobileMenu();
    }

    $hamburger.on('click', toggleMobileMenu);
    $backdrop.on('click', closeMobileMenu);
    $('#mobile-menu').on('click', 'a', closeMobileMenu);
    $(document).on('keydown', function (e) { if (e.key === 'Escape') closeMobileMenu(); });
    $(window).on('resize', function () { if (window.innerWidth >= 768) closeMobileMenu(); });

    function debounce(fn, wait) {
    let t; return function () { clearTimeout(t); t = setTimeout(() => fn.apply(this, arguments), wait); };
    }
    function syncNavHeight() {
    const nav = document.querySelector('nav');
    if (!nav) return;
    const h = nav.offsetHeight || 80;
    document.documentElement.style.setProperty('--nav-h', h + 'px');
    }
    syncNavHeight();
    window.addEventListener('resize', debounce(syncNavHeight, 150));

    /* Cierra la búsqueda al cambiar de sección */
    window.showSection = (function (orig) {
    return function wrapped(sectionId, element) {
        const res = orig(sectionId, element);
        $('.search-bar').addClass('hidden').removeClass('flex');
        return res;
    };
    })(window.showSection);
});


/**
 * The following code is outside the jQuery `ready` function and uses vanilla JavaScript.
 * It ensures certain UI elements are handled correctly as soon as the DOM is parsed.
 */
document.addEventListener("DOMContentLoaded", function () {
    // This listener attaches a click event to a 'profileIcon' for a specific render function.
    // This might be for a different feature or could be legacy code.
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
    // This listener manages the visibility of the logout button based on the presence of a user token.
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
            // Also clear 'userGoals' as they are user-specific.
            localStorage.removeItem("userGoals");  
    
            // Updates visibility and reloads the page for a clean state.
            updateLogoutVisibility();
            window.location.reload();  
        });
    }

    // Run on initial load to set the correct visibility of the logout button.
    updateLogoutVisibility();
});
