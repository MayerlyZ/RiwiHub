$(document).ready(function () {

    // -------------------------------------------------------------------------
    // ---------------------------- CONFIG / STATE -----------------------------
    // -------------------------------------------------------------------------

    // Load state from localStorage
    let authToken = localStorage.getItem('userToken') || null;
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    // New variable for goals, loaded from localStorage
    let userGoals = JSON.parse(localStorage.getItem('userGoals')) || [];

    // -------------------------------------------------------------------------
    // --------------------- PLUGIN / UI INITIALIZATION ----------------------
    // -------------------------------------------------------------------------

    // Initializes lightSlider plugin for any existing sliders
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
            // Warn if the plugin is not loaded, but don't break the app
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

            // Re-initialize sliders on home view to prevent glitches on resize
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

    // Show the default section on page load
    showSection('inicio-view', $('.nav-tab').first());

    // -------------------------------------------------------------------------
    // -------------------------- UI: EVENT HANDLERS ---------------------------
    // -------------------------------------------------------------------------

    // Show/hide search bar
    $(document).on('click', '.search-icon', function () {
        $('.search-bar').removeClass('hidden').addClass('flex');
    });
    $(document).on('click', '.search-cancel-icon', function () {
        $('.search-bar').addClass('hidden').removeClass('flex');
    });

    // Toggle mobile menu
    $(document).on('click', '.menu-toggle', function () {
        $('.mobile-menu').toggleClass('hidden');
    });

    // Open login modal
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

    // Close any modal
    $(document).on('click', '.modal-cancel-icon, .form-cancel-icon', function () {
        $(this).closest('.modal-container').addClass('hidden').removeClass('flex');
    });

    // Close animated product modal
    $('#modal-close').on('click', function () {
        closeModal();
    });

    // Show the cart view
    $('#cart-icon').on('click', function (e) {
        e.preventDefault();
        showCartView();
    });

    // Delegate clicks on product cards to open the detail modal
    $('body').on('click', '.product-box', function () {
        const itemId = $(this).data('item-id');
        if (!itemId) return;
        const clickedBox = $(this);
        // Request to get product details from the backend
        $.ajax({
            url: `https://riwihub-back.onrender.com/api/items/${itemId}`,
            method: 'GET',
            success: function (productData) {
                // Populate modal with dynamic data
                const itemImageSrc = clickedBox.find('img').attr('src') || productData.image_url || '';
                $('#modal-img').attr('src', itemImageSrc);
                $('#modal-name').text(productData.name || 'No name');
                $('#modal-description').text(productData.description || 'No description available.');
                $('#modal-price').text(`$${new Intl.NumberFormat('en-US').format(productData.price || 0)}`);

                // Check for and handle token price logic
                if (productData.token_price) {
                    $('#token-section').show();
                    $('#redeem-button').show();
                    $('#modal-token-price').text(productData.token_price);

                    // New logic to check if the user has enough tokens
                    const userTokens = currentUser ? currentUser.wallet_balance : 0;
                    const requiredTokens = productData.token_price;

                    if (userTokens >= requiredTokens) {
                        $('#redeem-button').removeClass('bg-gray-400 cursor-not-allowed').addClass('bg-teal-500 hover:bg-teal-600').prop('disabled', false);
                        $('#token-message').text('You have enough tokens to redeem this product!');
                    } else {
                        $('#redeem-button').addClass('bg-gray-400 cursor-not-allowed').removeClass('bg-teal-500 hover:bg-teal-600').prop('disabled', true);
                        const neededTokens = requiredTokens - userTokens;
                        $('#token-message').text(`You need ${neededTokens} more tokens to redeem it.`);
                    }
                } else {
                    $('#token-section').hide();
                    $('#redeem-button').hide();
                }

                $('#redeem-button').data('item_id', productData.item_id);
                $('#modal-add-to-cart-btn').data('item_id', productData.item_id);
                
                // Show modal with a slight animation
                $('#product-modal').removeClass('hidden').addClass('flex');
                setTimeout(() => {
                    $('#modal-content-wrapper').removeClass('scale-95 opacity-0').addClass('scale-100 opacity-100');
                }, 10);
            },
            error: function () {
                alert('Could not load product information.');
            }
        });
    });

    // Stop propagation for nested buttons (e.g., "Add to Cart" inside a product box)
    $('body').on('click', '.add-to-cart-btn', function (e) {
        e.stopPropagation();
        const itemId = $(this).closest('.product-box').data('item-id');
        addItemToCart(itemId);
    });

    // "Add to Cart" button inside the product modal
    $('#modal-add-to-cart-btn').on('click', function () {
        closeModal();
        addItemToCart($(this).data('item_id'));
    });

    // Placeholder for "Redeem" button functionality
    $('#redeem-button').on('click', function () {
        alert(`Redeem functionality for item ${$(this).data('item_id')} is not yet implemented.`);
        closeModal();
    });

    // -------------------------------------------------------------------------
    // -------------------------- MODAL / ANIMATIONS ---------------------------
    // -------------------------------------------------------------------------

    // Function to close the animated product modal
    function closeModal() {
        $('#modal-content-wrapper').removeClass('scale-100 opacity-100').addClass('scale-95 opacity-0');
        setTimeout(() => {
            $('#product-modal').addClass('hidden').removeClass('flex');
        }, 300);
    }

    // -------------------------------------------------------------------------
    // ----------------------------- AUTHENTICATION ----------------------------
    // -------------------------------------------------------------------------

    // Update UI based on authentication status (shows/hides the metas icon)
    function updateUIBasedOnAuth() {
        if (authToken && currentUser) {
            $('#metas-icon').removeClass('hidden');
        } else {
            $('#metas-icon').addClass('hidden');
        }
    }

    // Login form handler
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
                alert('Login successful!');
                $('#login-modal').addClass('hidden');
                updateUIBasedOnAuth();
            },
            error: function (err) {
                console.error('Login error:', err);
                alert('Login failed: ' + (err.responseJSON.error || 'Unknown error.'));
            }
        });
    });

    // Registration form handler
    $('#register-modal form').on('submit', function (e) {
        e.preventDefault();
        const name = $('#register-name').val();
        const email = $('#register-email').val();
        const password = $('#register-password').val();
        const role = $('#register-role').val();
        const cargo = $('#register-cargo').val();
        const storeName = $('#register-store-name').val();
        
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
            url: 'https://riwihub-back.onrender.com/api/users/register',
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

    // Show/hide additional fields in registration form based on the selected role
    $('#register-role').on('change', function () {
        const role = $(this).val();
        $('#cargo-section').toggleClass('hidden', role !== 'administrador' && role !== 'vendedor');
        $('#tienda-section').toggleClass('hidden', role !== 'vendedor');
    });

    // -------------------------------------------------------------------------
    // ------------------------------ SHOPPING CART ---------------------------------
    // -------------------------------------------------------------------------

    // Add a product to the cart via a backend API call
    function addItemToCart(itemId) {
        if (!authToken) {
            alert('Please log in to add products to the cart.');
            $('.user-icon').click();
            return;
        }
        $.ajax({
            url: `https://riwihub-back.onrender.com/api/carts/add`,
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

    // Fetch and display the user's shopping cart
    async function showCartView() {
        showSection('cart-view');
        if (!authToken) {
            $('#cart-items-container').html('<p class="text-center text-indigo-500">Log in to see your cart.</p>');
            return;
        }
        try {
            const cartItems = await $.ajax({
                url: 'https://riwihub-back.onrender.com/api/carts/',
                method: 'GET',
                headers: { 'Authorization': 'Bearer ' + authToken }
            });
            renderCartItems(cartItems);
        } catch (error) {
            console.error('Error loading cart', error);
            $('#cart-items-container').html('<p class="text-center text-red-500">Could not load your cart.</p>');
        }
    }

    // Render the fetched cart items to the UI
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

    // Remove an item from the cart
    $('body').on('click', '.remove-from-cart-btn', function () {
        const id = $(this).data('item-id');
        if (!authToken) {
            alert('You must be logged in.');
            return;
        }
        if (!confirm('Remove this product from the cart?')) return;
        $.ajax({
            url: `https://riwihub-back.onrender.com/api/carts/remove/${id}`,
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

    // All seller-specific logic is wrapped to run only if the view exists
    if ($('#seller-profile-view').length > 0) {
        const $productGrid = $('#product-grid');
        const $productListContainer = $('#product-list-container');
        const $productFormContainer = $('#product-form-container');
        const $formTitle = $('#form-title');
        const $productForm = $('#product-form');

        // Fetch and render the seller's products
        async function renderSellerProducts() {
            $productGrid.empty();
            if (!authToken) {
                $productGrid.html('<p class="text-center text-red-500 col-span-full">You must log in to view your products.</p>');
                return;
            }
            try {
                const products = await $.ajax({
                    url: 'https://riwihub-back.onrender.com/api/items',
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

        // Helper function to switch between seller profile sub-sections
        function showSellerContent($sectionToShow) {
            $productListContainer.addClass('hidden');
            $productFormContainer.addClass('hidden');
            $sectionToShow.removeClass('hidden');
        }

        // Button to show the add product form
        $('#btn-show-add-form').on('click', function () {
            $formTitle.text('Add New Product');
            $productForm[0].reset();
            $('#product-id').val('');
            showSellerContent($productFormContainer);
        });

        // Button to show the product list
        $('#btn-show-products, #btn-cancel').on('click', function () {
            renderSellerProducts();
            showSellerContent($productListContainer);
        });

        // Handle form submission for creating or updating a product
        $productForm.on('submit', async function (event) {
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
            const url = isUpdating ? `https://riwihub-back.onrender.com/api/items/${id}` : `https://riwihub-back.onrender.com/api/items`;
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

        // Load product data into the form for editing
        $productGrid.on('click', '.btn-edit', async function () {
            const productId = $(this).data('id');
            try {
                const productToEdit = await $.ajax({
                    url: `https://riwihub-back.onrender.com/api/items/${productId}`,
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

        // Delete a product
        $productGrid.on('click', '.btn-delete', async function () {
            const productId = $(this).data('id');
            if (!confirm('Are you sure you want to delete this product?')) return;
            try {
                await $.ajax({
                    url: `https://riwihub-back.onrender.com/api/items/${productId}`,
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
    }

    // -------------------------------------------------------------------------
    // ----------------------------- GOALS FUNCTIONALITY -----------------------
    // -------------------------------------------------------------------------

    // Renders the list of goals in the modal
    function renderGoals() {
        const $goalsList = $('#metas-list');
        $goalsList.empty();
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

    // Saves the goals to localStorage
    function saveGoals() {
        localStorage.setItem('userGoals', JSON.stringify(userGoals));
    }

    // Event handler to open the goals modal
    $(document).on('click', '#metas-icon', function () {
        $('#metas-modal').removeClass('hidden').addClass('flex');
        renderGoals();
    });

    // Event handler to close the goals modal
    $(document).on('click', '#metas-modal-cancel', function () {
        $('#metas-modal').addClass('hidden').removeClass('flex');
    });

    // Handle form submission to add a new goal
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
            $('#new-meta-text').val('');
        }
    });

    // Handle checkbox change to mark a goal as completed
    $(document).on('change', '.meta-checkbox', function () {
        const index = $(this).data('index');
        userGoals[index].completed = this.checked;
        saveGoals();
        renderGoals();
    });

    // Handle button click to delete a goal
    $(document).on('click', '.delete-meta-btn', function () {
        const index = $(this).data('index');
        userGoals.splice(index, 1);
        saveGoals();
        renderGoals();
    });

    // -------------------------------------------------------------------------
    // -------------------- ADDITIONAL LOGIC / UTILS -----------------------
    // -------------------------------------------------------------------------

    // Logout handler
    $(document).on('click', '#logout-btn', function () {
        if (!confirm('Are you sure you want to log out?')) return;
        localStorage.removeItem('userToken');
        localStorage.removeItem('currentUser');
        authToken = null;
        currentUser = null;
        updateUIBasedOnAuth();
        alert('Logged out successfully.');
        showSection('inicio-view');
    });

    // Final UI update on initial page load
    updateUIBasedOnAuth();
});