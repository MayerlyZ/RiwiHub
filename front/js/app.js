$(document).ready(function () {
    // This function ensures the code runs only after the entire DOM is fully loaded.

    // -------------------------------------------------------------------------
    // ---------------------------- CONFIG / STATE -----------------------------
    // -------------------------------------------------------------------------

    // Load state from localStorage
    // Retrieves the authentication token from browser's local storage. Defaults to null if not found.
    let authToken = localStorage.getItem('userToken') || null;
    // Retrieves the current user object from local storage and parses the JSON. Defaults to null.
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    // New variable for goals, loaded from localStorage
    // Loads the user's goals from local storage. Initializes as an empty array if none exist.
    let userGoals = JSON.parse(localStorage.getItem('userGoals')) || [];
    
    // Test data for product rendering (this is likely a placeholder for a real API call)
    const testItems = [
        // ... (example product data)
    ];

    // -------------------------------------------------------------------------
    // --------------------- PLUGIN / UI INITIALIZATION ----------------------
    // -------------------------------------------------------------------------

    // Initializes lightSlider plugin for any existing sliders
    // A function to set up the lightSlider plugin on specific elements, ensuring they are functional.
    function initSliders() {
        try {
            // Checks for and initializes the '#adaptive' slider.
            if ($('#adaptive').length) {
                $('#adaptive').lightSlider({
                    adaptiveHeight: true,
                    auto: true,
                    item: 1,
                    slideMargin: 0,
                    loop: true
                });
            }
            // Checks for and initializes the '#autoWidth' slider.
            if ($('#autoWidth').length) {
                $('#autoWidth').lightSlider({
                    autoWidth: true,
                    loop: true,
                    onSliderLoad: function () { $('#autoWidth').removeClass('cS-hidden'); }
                });
            }
        } catch (e) {
            // Warn if the plugin is not loaded, but don't break the app
            // Logs a warning to the console if the lightSlider plugin is not available.
            console.warn('lightSlider init failed or not present', e);
        }
    }
    // Run on startup
    // Calls the slider initialization function when the script starts.
    initSliders();

    // -------------------------------------------------------------------------
    // --------------------------- NAVIGATION (SPA) ----------------------------
    // -------------------------------------------------------------------------
    
    // Renders products dynamically into a container based on a category filter
    // Function to populate product views by filtering an array of products based on category.
    function renderProductsToView(containerId, categoryFilter) {
        const $container = $(`#${containerId}`);
        $container.empty(); // Clears any existing products.

        // Filters products based on the provided category or renders all if no filter is given.
        const productsToRender = categoryFilter
            ? testItems.filter(item => item.category === categoryFilter)
            : testItems;

        // Displays a message if no products are found for the category.
        if (productsToRender.length === 0) {
            $container.html('<p class="text-center text-gray-500 col-span-full">No hay productos en esta categoría.</p>');
            return;
        }

        // Iterates through the filtered products and appends their HTML to the container.
        productsToRender.forEach(product => {
            const productHtml = `
                <div class="product-box flex flex-col items-center border border-gray-100 rounded-lg mx-5 my-5 flex-grow-[0.5] transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:border-teal-500 group" data-item-id="${product.item_id}">
                    <div class="product-img w-52 h-52 m-5 relative cursor-pointer">
                        <img src="${product.image_url}" class="w-full h-full object-contain object-center rounded-4xl">
                        <div class="view-product-btn-container absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center hidden group-hover:flex transition-opacity duration-300">
                            <a href="#" class="view-product-btn text-white text-sm bg-teal-500 px-4 py-2 rounded-full font-bold hover:bg-teal-600 transition-colors">
                                Ver Producto
                            </a>
                        </div>
                    </div>
                    <div class="product-details flex flex-col items-center w-full p-5 border-t border-gray-100">
                        <a href="#" class="text-gray-700">${product.name}</a>
                        <span class="text-xl text-gray-800 font-normal">$${new Intl.NumberFormat('es-CO').format(product.price)}</span>
                    </div>
                </div>
            `;
            $container.append(productHtml);
        });
    }

    // showSection: hides all .main-view views and shows the requested one.
    // Handles navigation between different sections of the single-page application (SPA).
    window.showSection = function (sectionId, element) {
        // Hides all elements with the 'main-view' class.
        $('.main-view').addClass('hidden');
        const $target = $('#' + sectionId);
        // Shows the target section if it exists.
        if ($target.length) {
            $target.removeClass('hidden');

             // Re-initialize sliders on home view to prevent glitches on resize
            // Re-initializes sliders on the home page view on larger screens to prevent display issues.
            if (sectionId === 'inicio-view' && window.innerWidth >= 768) {
                initSliders();
            }

            // Renders products based on the navigated section.
            if (sectionId === 'tecnologia-view') {
                renderProductsToView('tecnologia-products-container', 'tecnologia');
            } else if (sectionId === 'snacks-view') {
                renderProductsToView('snacks-products-container', 'snacks');
            } else if (sectionId === 'servicios-view') {
                renderProductsToView('servicios-products-container', 'servicios');
            } else if (sectionId === 'varios-view') {
                renderProductsToView('varios-products-container', 'varios');
            }
        }
        // Updates the visual state of navigation tabs.
        $('.nav-tab').removeClass('bg-[rgb(112,95,250)] text-white').addClass('text-gray-600');
        if (element) {
            $(element).addClass('bg-[rgb(112,95,250)] text-white').removeClass('text-gray-600');
        }
    };
    // Show the default section on page load
    // Sets the initial view to the home page and highlights the first navigation tab.
    showSection('inicio-view', $('.nav-tab').first());
    
    // -------------------------------------------------------------------------
    // -------------------------- UI: EVENT HANDLERS ---------------------------
    // -------------------------------------------------------------------------

    // Show/hide search bar
    // Toggles the visibility of the search bar when the search icon is clicked.
    $(document).on('click', '.search-icon', function () {
        $('.search-bar').removeClass('hidden').addClass('flex');
    });
    // Hides the search bar when the cancel icon is clicked.
    $(document).on('click', '.search-cancel-icon', function () {
        $('.search-bar').addClass('hidden').removeClass('flex');
    });
     // Toggle mobile menu
    // Toggles the visibility of the mobile menu.
    $(document).on('click', '.menu-toggle', function () {
        $('.mobile-menu').toggleClass('hidden');
    });

    // Open login modal or seller profile
    // Handles the click on the user icon.
    $(document).on('click', '.user-icon', function () {
        // If logged in as a seller, it navigates to the seller profile.
        if (authToken && currentUser && currentUser.role === 'vendedor') {
            showSection('seller-profile-view', $('#seller-profile-link')[0]);
        } 
        // If logged in as a non-seller, it shows an alert.
        else if (authToken) {
            alert('You are already logged in.');
        } 
        // If not logged in, it opens the login modal.
        else {
            $('#login-modal').removeClass('hidden').addClass('flex');
        }
    });

    // Opens the login modal when the "already have an account" button is clicked.
    $(document).on('click', '.already-account-btn', function() {
        $('#login-modal').removeClass('hidden').addClass('flex');
    });

    // Switch to register modal
    // Switches from the login modal to the registration modal.
    $(document).on('click', '#show-register, .sign-up-btn', function () {
        $('#login-modal').addClass('hidden');
        $('#register-modal').removeClass('hidden').addClass('flex');
    });
    // Switch back to login from register
    // Switches from the registration modal to the login modal.
    $(document).on('click', '#show-login', function () {
        $('#register-modal').addClass('hidden');
        $('#login-modal').removeClass('hidden').addClass('flex');
    });
    // Generic modal close handler
    // Closes any modal by targeting its parent container.
    $(document).on('click', '.modal-cancel-icon, .form-cancel-icon', function () {
        $(this).closest('.modal-container').addClass('hidden').removeClass('flex');
    });
    // Closes the animated product modal.
    $('#modal-close').on('click', function () {
        closeModal();
    });
    // Opens the cart view.
    $('#cart-icon').on('click', function (e) {
        e.preventDefault();
        showCartView();
    });

    // Event handler to open the tokens modal
    // Binds a click event to the tokens icon.
    $(document).on('click', '#tokens-icon', function () {
        // Opens the tokens modal if the user is logged in.
        if (authToken && currentUser) {
            $('#tokens-modal').removeClass('hidden').addClass('flex');
            $('#current-tokens').text(`${currentUser.wallet_balance || 0} Tokens`);
        } else {
            // Prompts the user to log in if they are not authenticated.
            alert('You must be logged in to see your tokens.');
            $('#login-modal').removeClass('hidden').addClass('flex');
        }
    });

    // Event handler to close the tokens modal
    // Closes the tokens modal.
    $(document).on('click', '#tokens-modal-cancel', function () {
        $('#tokens-modal').addClass('hidden').removeClass('flex');
    });


    // Delegation for opening product modal from any product box
    // Uses event delegation on the 'body' to handle clicks on dynamically created product boxes.
    $('body').on('click', '.product-box', function () {
        const itemId = parseInt($(this).data('item-id'));
        if (!itemId) return;
        const clickedBox = $(this);
        // Fetches product data from the backend.
        $.ajax({
            url: `https://riwihub-back.onrender.com/api/items/${itemId}`,
            method: 'GET',
            success: function (productData) {
                // Populates the product modal with the fetched data.
                const itemImageSrc = clickedBox.find('img').attr('src') || productData.image_url || '';
                $('#modal-img').attr('src', itemImageSrc);
                $('#modal-name').text(productData.name || 'No name');
                $('#modal-description').text(productData.description || 'No description available.');
                $('#modal-price').text(`$${new Intl.NumberFormat('es-CO').format(productData.price || 0)}`);

                // Handles the display of token price and redemption logic.
                if (productData.token_price) {
                    $('#token-section').show();
                    $('#redeem-button').show();
                    $('#modal-token-price').text(productData.token_price);

                    const userTokens = currentUser ? currentUser.wallet_balance : 0;
                    const requiredTokens = productData.token_price;

                    // Enables or disables the redeem button based on the user's token balance.
                    if (userTokens >= requiredTokens) {
                        $('#redeem-button').removeClass('bg-gray-400 cursor-not-allowed').addClass('bg-teal-500 hover:bg-teal-600').prop('disabled', false);
                        $('#token-message').text('You have enough tokens to redeem this product!');
                    } else {
                        $('#redeem-button').addClass('bg-gray-400 cursor-not-allowed').removeClass('bg-teal-500 hover:bg-teal-600').prop('disabled', true);
                        const neededTokens = requiredTokens - userTokens;
                        $('#token-message').text(`You need ${neededTokens} more tokens to redeem it.`);
                    }
                } else {
                    // Hides token-related elements if no token price is provided.
                    $('#token-section').hide();
                    $('#redeem-button').hide();
                }

                // Stores the item ID on the buttons for future use.
                $('#redeem-button').data('item_id', productData.item_id);
                $('#modal-add-to-cart-btn').data('item_id', productData.item_id);

                // Shows the product modal with a CSS-based animation.
                $('#product-modal').removeClass('hidden').addClass('flex');
                setTimeout(() => {
                    $('#modal-content-wrapper').removeClass('scale-95 opacity-0').addClass('scale-100 opacity-100');
                }, 10);
            },
            error: function () {
                // Alerts the user if there's an issue loading the product.
                alert('Product not found or an error occurred while loading.');
            }
        });
    });

    // Prevents the product box click from firing when the "add to cart" button is clicked.
    $('body').on('click', '.add-to-cart-btn', function (e) {
        e.stopPropagation();
        const itemId = parseInt($(this).closest('.product-box').data('item-id'));
        addItemToCart(itemId);
    });
    
    // Adds an item to the cart from inside the product modal and closes the modal.
    $('#modal-add-to-cart-btn').on('click', function () {
        closeModal();
        addItemToCart($(this).data('item_id'));
    });
    // Placeholder for the redeem button's functionality.
    $('#redeem-button').on('click', function () {
        alert(`Redeem functionality for item ${$(this).data('item_id')} is simulated.`);
        closeModal();
    });

    // -------------------------------------------------------------------------
    // -------------------------- MODAL / ANIMATIONS ---------------------------
    // -------------------------------------------------------------------------

    // Function to close the animated product modal.
    function closeModal() {
        // Triggers the CSS transition to hide the modal content.
        $('#modal-content-wrapper').removeClass('scale-100 opacity-100').addClass('scale-95 opacity-0');
        // Hides the modal container after the animation completes.
        setTimeout(() => {
            $('#product-modal').addClass('hidden').removeClass('flex');
        }, 300);
    }

    // -------------------------------------------------------------------------
    // ----------------------------- AUTHENTICATION ----------------------------
    // -------------------------------------------------------------------------

    // Updates UI elements based on the current authentication state and user role.
    function updateUIBasedOnAuth() {
        // Toggles visibility of the 'goals' and 'tokens' icons.
        if (authToken && currentUser) {
            $('#metas-icon').removeClass('hidden');
        } else {
            $('#metas-icon').addClass('hidden');
            $('#tokens-icon').addClass('hidden');
        }

        // Toggles visibility of the 'seller profile' link based on the user's role.
        if (currentUser && currentUser.role === 'vendedor') {
            $('#seller-profile-link').removeClass('hidden');
        } else {
            $('#seller-profile-link').addClass('hidden');
        }

        // Updates the displayed token balance.
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
        const email = $('#email').val();
        const password = $('#password').val();
        
        // Sends a login request to the API.
        $.ajax({
            url: 'https://riwihub-back.onrender.com/api/users/login',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ email, password }),
            success: function (res) {
                // On success, saves user data, updates the UI, and redirects to the home page.
                authToken = res.token;
                currentUser = res.user;
                localStorage.setItem('userToken', authToken);
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                
                alert(`Login successful as ${currentUser.name}!`);
                $('#login-modal').addClass('hidden');
                updateUIBasedOnAuth();
                showSection('inicio-view', $('.nav-tab').first());
            },
            error: function (err) {
                // Alerts the user of a login failure.
                console.error('Login error:', err);
                alert('Login failed: ' + (err.responseJSON.error || 'Unknown error.'));
            }
        });
    });

    // Handles the registration form submission.
    $('#register-modal form').on('submit', function (e) {
        e.preventDefault();
        // Gathers registration data.
        const name = $('#register-name').val();
        const email = $('#register-email').val();
        const password = $('#register-password').val();
        const role = $('#register-role').val();
        const cargo = $('#register-cargo').val();
        const storeName = $('#register-tienda').val();
        
        if (!name || !email || !password) {
            alert('Name, email, and password are required.');
            return;
        }

        // Constructs the request payload based on the user's selected role.
        const payload = { name, email, password, role };
        if (role === 'administrador' || role === 'vendedor') {
            payload.cargo = cargo;
        }
        if (role === 'vendedor') {
            payload.store_name = storeName;
        }

        // Sends the registration request to the API.
        $.ajax({
            url: 'https://riwihub-back.onrender.com/api/users/register',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(payload),
            success: function (res) {
                // On success, alerts the user and switches to the login modal.
                alert('Registration successful! You can now log in.');
                $('#register-modal').addClass('hidden');
                $('#login-modal').removeClass('hidden').addClass('flex');
            },
            error: function (err) {
                // Alerts the user of a registration failure.
                console.error('Registration error:', err);
                alert('Registration failed: ' + (err.responseJSON.message || 'Unknown error.'));
            }
        });
    });

    // Dynamically shows/hides form fields in the registration form based on the selected role.
    $('#register-role').on('change', function () {
        const role = $(this).val();
        $('#cargo-section').toggleClass('hidden', role !== 'administrador' && role !== 'vendedor');
        $('#tienda-section').toggleClass('hidden', role !== 'vendedor');
    });

    // -------------------------------------------------------------------------
    // ------------------------------ SHOPPING CART ---------------------------------
    // -------------------------------------------------------------------------

    // Adds a product to the cart via an API call.
    function addItemToCart(itemId) {
        // Checks for authentication.
        if (!authToken) {
            alert('Please log in to add products to the cart.');
            $('.user-icon').click();
            return;
        }
        // Sends a request to add the item to the cart.
        $.ajax({
            url: `https://riwihub-back.onrender.com/api/carts/add`,
            method: 'POST',
            contentType: 'application/json',
            headers: { 'Authorization': 'Bearer ' + authToken },
            data: JSON.stringify({ itemId: itemId, quantity: 1 }),
            success: function (res) {
                // On success, alerts the user and refreshes the cart view.
                alert(res.message || 'Product added to cart.');
                showCartView();
            },
            error: function (err) {
                // Alerts the user of an error.
                console.error('Error adding to cart:', err);
                alert('Error adding to cart, please try again.');
            }
        });
    }

    // Fetches and displays the user's shopping cart.
    async function showCartView() {
        // Navigates to the cart section.
        showSection('cart-view');
        if (!authToken) {
            $('#cart-items-container').html('<p class="text-center text-indigo-500">Log in to see your cart.</p>');
            return;
        }
        try {
            // Fetches the cart items from the API.
            const cartItems = await $.ajax({
                url: 'https://riwihub-back.onrender.com/api/carts/',
                method: 'GET',
                headers: { 'Authorization': 'Bearer ' + authToken }
            });
            // Renders the items in the cart view.
            renderCartItems(cartItems);
        } catch (error) {
            console.error('Error loading cart', error);
            $('#cart-items-container').html('<p class="text-center text-red-500">Could not load your cart.</p>');
        }
    }

    // Renders the fetched cart items onto the UI.
    function renderCartItems(items) {
        const container = $('#cart-items-container');
        container.empty();
        // Displays a message if the cart is empty.
        if (!items || items.length === 0) {
            container.html('<p class="text-center text-gray-500">Your cart is empty.</p>');
            $('#cart-total').text('$0');
            $('#cart-item-count').text('0');
            return;
        }
        let total = 0;
        let totalItems = 0;
        // Loops through items to calculate totals and create HTML.
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
        // Updates the total price and item count.
        $('#cart-total').text(`$${new Intl.NumberFormat('es-CO').format(total)}`);
        $('#cart-item-count').text(totalItems);
    }

    // Removes an item from the cart via an API call.
    $('body').on('click', '.remove-from-cart-btn', function () {
        const id = parseInt($(this).data('item-id'));
        if (!authToken) {
            alert('You must be logged in.');
            return;
        }
        if (!confirm('Remove this product from the cart?')) return;
        // Sends a DELETE request to the API.
        $.ajax({
            url: `https://riwihub-back.onrender.com/api/carts/remove/${id}`,
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + authToken },
            success: function (res) {
                // Alerts the user and reloads the cart.
                alert(res.message || 'Product removed.');
                showCartView();
            },
            error: function () {
                // Alerts the user of an error.
                alert('Could not remove the product.');
            }
        });
    });

    // -------------------------------------------------------------------------
    // ------------------------- SELLER PROFILE (AJAX) ---------------------------
    // -------------------------------------------------------------------------

    // This section contains logic specific to the seller's profile, wrapped to run only if the view exists.
    if ($('#seller-profile-view').length > 0) {
        const $productGrid = $('#product-grid');
        const $productListContainer = $('#product-list-container');
        const $productFormContainer = $('#product-form-container');
        const $formTitle = $('#form-title');
        const $productForm = $('#product-form');

        // Fetches and renders the products managed by the logged-in seller.
        async function renderSellerProducts() {
            $productGrid.empty();
            // Checks for seller authentication before fetching products.
            if (!authToken || currentUser.role !== 'vendedor') {
                $productGrid.html('<p class="text-center text-red-500 col-span-full">You must log in as a seller to view your products.</p>');
                return;
            }
            try {
                // Sends a request to the API for the seller's items.
                const products = await $.ajax({
                    url: 'https://riwihub-back.onrender.com/api/items',
                    method: 'GET',
                    headers: { 'Authorization': 'Bearer ' + authToken }
                });
                // Displays a message if no products are found.
                if (!products || products.length === 0) {
                    $productGrid.html('<p class="text-center text-gray-500 col-span-full">You don’t have any products. Add one.</p>');
                    return;
                }
                // Renders each product card.
                products.forEach(product => {
                    const productCardHTML = `
                        <div class="bg-white border rounded-lg shadow-md overflow-hidden" data-item-id="${product.item_id}">
                            <img src="${product.image_url || 'https://via.placeholder.com/300x200'}" alt="${product.name}" class="w-full h-48 object-cover">
                            <div class="p-4">
                                <h3 class="text-lg font-bold">${product.name}</h3>
                                <p class="text-gray-600 text-sm mt-2">${product.description || ''}</p>
                                <p class="text-xl font-semibold text-teal-600 mt-4">$${new Intl.NumberFormat('es-CO').format(product.price || 0)}</p>
                            </div>
                            <div class="bg-gray-50 p-3 flex justify-end gap-2">
                                <button class="btn-edit text-sm font-medium text-white bg-yellow-500 py-1 px-3 rounded hover:bg-yellow-600" data-id="${product.item_id}">✏️ Edit</button>
                                <button class="btn-delete text-sm font-medium text-white bg-red-500 py-1 px-3 rounded hover:bg-red-600" data-id="${product.item_id}">🗑️ Delete</button>
                            </div>
                        </div>`;
                    $productGrid.append(productCardHTML);
                });
            } catch (error) {
                // Alerts the user of an error.
                console.error('Error loading seller products', error);
                $productGrid.html('<p class="text-center text-red-500 col-span-full">Error loading products.</p>');
            }
        }

        // Helper function to switch between the product list and the product form.
        function showSellerContent($sectionToShow) {
            $productListContainer.addClass('hidden');
            $productFormContainer.addClass('hidden');
            $sectionToShow.removeClass('hidden');
        }

        // Opens the form for adding a new product.
        $('#btn-show-add-form').on('click', function () {
            $formTitle.text('Add New Product');
            $productForm[0].reset(); // Clears the form.
            $('#product-id').val(''); // Resets the product ID.
            showSellerContent($productFormContainer);
        });
        // Navigates back to the product list and refreshes it.
        $('#btn-show-products, #btn-cancel').on('click', function () {
            renderSellerProducts();
            showSellerContent($productListContainer);
        });

        // Handles form submission for creating or updating a product.
        $productForm.on('submit', async function (event) {
            event.preventDefault();
            const id = $('#product-id').val();
            // Creates a FormData object to handle file uploads.
            const formData = new FormData();
                    formData.append('name', $('#product-name').val());
                    formData.append('description', $('#product-description').val());
                    formData.append('price', parseFloat($('#product-price').val()));
                    formData.append('type', 'product');
                    formData.append('category', 'tecnologia');
                    formData.append('category_id', 1);

        // archivo seleccionado
        const fileInput = $('#product-image')[0].files[0];
        if (fileInput) {
            formData.append('image', fileInput); 
        }

            // Determines if it's a new product or an update.
            const isUpdating = !!id;
            const url = isUpdating ? `https://riwihub-back.onrender.com/api/items/${id}` : `https://riwihub-back.onrender.com/api/items`;
            const method = isUpdating ? 'PUT' : 'POST';
            try {
                // Sends the form data with appropriate headers.
                await $.ajax({
                    url,
                    method,
                    data: formData,
                    processData: false, // Prevents jQuery from processing the data.
                    contentType: false, // Prevents jQuery from setting the content type, allowing FormData to do it.
                    headers: { 'Authorization': 'Bearer ' + authToken }
                });
                
                // Alerts the user and refreshes the list.
                alert(`Product ${isUpdating ? 'updated' : 'created'} successfully.`);
                renderSellerProducts();
                showSellerContent($productListContainer);
            } catch (error) {
                console.error('Error saving product', error);
                alert('Error saving product.');
            }
        });

        // Loads a product's data into the form for editing.
        $productGrid.on('click', '.btn-edit', async function () {
            const productId = parseInt($(this).data('id'));
            try {
                // Fetches the product data from the API.
                const productToEdit = await $.ajax({
                    url: `https://riwihub-back.onrender.com/api/items/${productId}`,
                    method: 'GET',
                    headers: { 'Authorization': 'Bearer ' + authToken }
                });
                // Populates the form fields.
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

        // Deletes a product.
        $productGrid.on('click', '.btn-delete', async function () {
            const productId = parseInt($(this).data('id'));
            if (!confirm('Are you sure you want to delete this product?')) return;
            try {
                // Sends a DELETE request to the API.
                await $.ajax({
                    url: `https://riwihub-back.onrender.com/api/items/${productId}`,
                    method: 'DELETE',
                    headers: { 'Authorization': 'Bearer ' + authToken }
                });
                // Alerts the user and reloads the list.
                alert('Product deleted.');
                renderSellerProducts();
            } catch (error) {
                console.error('Error deleting product', error);
                alert('Error deleting product.');
            }
        });

        // Initial render of seller products if the user is a logged-in seller.
        if (authToken && currentUser && currentUser.role === 'vendedor') {
            renderSellerProducts();
        }
    }

    // -------------------------------------------------------------------------
    // ----------------------------- GOALS FUNCTIONALITY -----------------------
    // -------------------------------------------------------------------------

    // Renders the list of goals in the modal.
    function renderGoals() {
        const $goalsList = $('#metas-list');
        $goalsList.empty();
        // Displays a message if the goals list is empty.
        if (userGoals.length === 0) {
            $('#no-metas-message').removeClass('hidden');
        } else {
            $('#no-metas-message').addClass('hidden');
        }
        // Creates and appends HTML for each goal.
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

    // Saves the goals array to local storage.
    function saveGoals() {
        localStorage.setItem('userGoals', JSON.stringify(userGoals));
    }
    // Opens the goals modal.
    $(document).on('click', '#metas-icon', function () {
        $('#metas-modal').removeClass('hidden').addClass('flex');
        renderGoals();
    });
    // Closes the goals modal.
    $(document).on('click', '#metas-modal-cancel', function () {
        $('#metas-modal').addClass('hidden').removeClass('flex');
    });
    // Handles adding a new goal from the form.
    $('#add-meta-form').on('submit', function (e) {
        e.preventDefault();
        const newMetaText = $('#new-meta-text').val().trim();
        if (newMetaText) {
            const newGoal = { text: newMetaText, completed: false, created_at: new Date().toISOString() };
            userGoals.push(newGoal);
            saveGoals();
            renderGoals();
            $('#new-meta-text').val('');
        }
    });
    // Handles marking a goal as completed/incomplete.
    $(document).on('change', '.meta-checkbox', function () {
        const index = $(this).data('index');
        userGoals[index].completed = this.checked;
        saveGoals();
        renderGoals();
    });
    // Handles deleting a goal.
    $(document).on('click', '.delete-meta-btn', function () {
        const index = $(this).data('index');
        userGoals.splice(index, 1);
        saveGoals();
        renderGoals();
    });

    // -------------------------------------------------------------------------
    // -------------------- ADDITIONAL LOGIC / UTILS -----------------------
    // -------------------------------------------------------------------------

    // Handles the logout functionality.
    $(document).on('click', '#logout-btn', function () {
        if (!confirm('Are you sure you want to log out?')) return;
        // Clears user data from local storage and resets state variables.
        localStorage.removeItem('userToken');
        localStorage.removeItem('currentUser');
        authToken = null;
        currentUser = null;
        // Updates the UI, alerts the user, and navigates to the home page.
        updateUIBasedOnAuth();
        alert('Logged out successfully.');
        showSection('inicio-view');
    });

    // Initial UI update on page load to reflect the current user's authentication state.
    updateUIBasedOnAuth();
});