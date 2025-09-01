$(document).ready(function () {
    // This script runs only after the DOM is fully loaded.

    // -------------------------------------------------------------------------
    // ------------------------- SELLER PROFILE LOGIC --------------------------
    // -------------------------------------------------------------------------

    // Check if the seller profile container exists on the page. If not, do nothing.
    // This prevents this script from running unnecessarily on other views.
    if ($('#seller-profile-view').length > 0) {
        
        // --- STATE & CONFIGURATION ---
        // Retrieve authentication data from localStorage. This data is expected to be
        // set by the main app.js script during login.
        const authToken = localStorage.getItem('userToken') || null;
        const currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

        // --- JQUERY SELECTORS ---
        // Cache the jQuery objects for performance and easier access.
        const $productGrid = $('#product-grid');
        const $productListContainer = $('#product-list-container');
        const $productFormContainer = $('#product-form-container');
        const $formTitle = $('#form-title');
        const $productForm = $('#product-form');

        /**
         * @description Fetches the seller's products from the API and renders them in the grid.
         */
        async function renderSellerProducts() {
            $productGrid.empty(); // Clear previous content

            // Security check: ensure the user is a logged-in seller.
            if (!authToken || !currentUser || currentUser.role !== 'vendedor') {
                $productGrid.html('<p class="text-center text-red-500 col-span-full">Debes iniciar sesión como vendedor para ver tus productos.</p>');
                return;
            }

            try {
                // Perform the AJAX request to get the items belonging to the seller.
                const products = await $.ajax({
                    url: 'https://riwihub-back.onrender.com/api/items',
                    method: 'GET',
                    headers: { 'Authorization': 'Bearer ' + authToken }
                });

                // If the seller has no products, display a friendly message.
                if (!products || products.length === 0) {
                    $productGrid.html('<p class="text-center text-gray-500 col-span-full">No tienes productos. ¡Añade uno para empezar!</p>');
                    return;
                }

                // Loop through each product and build its HTML card.
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
                                <button class="btn-edit text-sm font-medium text-white bg-yellow-500 py-1 px-3 rounded hover:bg-yellow-600" data-id="${product.item_id}">✏️ Editar</button>
                                <button class="btn-delete text-sm font-medium text-white bg-red-500 py-1 px-3 rounded hover:bg-red-600" data-id="${product.item_id}">🗑️ Eliminar</button>
                            </div>
                        </div>`;
                    $productGrid.append(productCardHTML);
                });
            } catch (error) {
                console.error('Error loading seller products:', error);
                $productGrid.html('<p class="text-center text-red-500 col-span-full">Ocurrió un error al cargar los productos.</p>');
            }
        }

        /**
         * @description Toggles visibility between the product list and the product form.
         * @param {jQuery} $sectionToShow - The jQuery object of the section to display.
         */
        function showSellerContent($sectionToShow) {
            $productListContainer.addClass('hidden');
            $productFormContainer.addClass('hidden');
            $sectionToShow.removeClass('hidden');
        }

        // --- EVENT HANDLERS ---

        // Event handler for the 'Add New Product' button.
        $('#btn-show-add-form').on('click', function () {
            $formTitle.text('Añadir Nuevo Producto');
            $productForm[0].reset(); // Use [0] to access the native DOM element for reset().
            $('#product-id').val(''); // Ensure the hidden ID field is empty for creation.
            showSellerContent($productFormContainer);
        });
        
        // Event handlers for showing the product list (e.g., from 'View Products' or 'Cancel' buttons).
        $('#btn-show-products, #btn-cancel').on('click', function () {
            renderSellerProducts(); // Re-render to ensure the list is up-to-date.
            showSellerContent($productListContainer);
        });

        // Event handler for submitting the product form (create or update).
        $productForm.on('submit', async function (event) {
            event.preventDefault(); // Prevent default form submission.
            const id = $('#product-id').val();
            
            // FormData is used to correctly handle file uploads (images) and other data.
            const formData = new FormData();
            formData.append('name', $('#product-name').val());
            formData.append('description', $('#product-description').val());
            formData.append('price', parseFloat($('#product-price').val()));
            formData.append('price_token', parseFloat($('#product-token-price').val())); // Read new token price field
            formData.append('stock', parseInt($('#product-stock').val()));             // Read new stock field
            formData.append('type', $('#product-type').val());                         // Read new type field
            formData.append('category_id', parseInt($('#product-category').val()));     // Read new category field

            const fileInput = $('#product-image')[0].files[0];
            if (fileInput) {
                formData.append('image', fileInput);
            }

            const isUpdating = !!id; // Boolean check to see if we are updating or creating.
            const url = isUpdating ? `https://riwihub-back.onrender.com/api/items/${id}` : `https://riwihub-back.onrender.com/api/items`;
            const method = isUpdating ? 'PUT' : 'POST';

            try {
                // Perform the AJAX call to create or update the item.
                await $.ajax({
                    url, method, data: formData,
                    processData: false,  // Important for FormData
                    contentType: false,  // Important for FormData
                    headers: { 'Authorization': 'Bearer ' + authToken }
                });
                alert(`Producto ${isUpdating ? 'actualizado' : 'creado'} exitosamente.`);
                renderSellerProducts();
                showSellerContent($productListContainer);
            } catch (error) {
                console.error('Error al guardar producto:', error);
                const errorMsg = error.responseJSON ? JSON.stringify(error.responseJSON) : 'Error desconocido del servidor.';
                alert('Error al guardar el producto: ' + errorMsg);
            }
        });

        // Event delegation for the 'Edit' button on product cards.
        $productGrid.on('click', '.btn-edit', async function () {
            const productId = parseInt($(this).data('id'));
            try {
                // Fetch the specific product's data to pre-fill the form.
                const productToEdit = await $.ajax({
                    url: `https://riwihub-back.onrender.com/api/items/${productId}`,
                    method: 'GET',
                    headers: { 'Authorization': 'Bearer ' + authToken }
                });
                // Populate the form with the fetched data, including the new fields.
                $formTitle.text('Actualizar Producto');
                $('#product-id').val(productToEdit.item_id);
                $('#product-name').val(productToEdit.name);
                $('#product-description').val(productToEdit.description);
                $('#product-price').val(productToEdit.price);
                $('#product-token-price').val(productToEdit.price_token); // Populate token price
                $('#product-stock').val(productToEdit.stock);             // Populate stock
                $('#product-type').val(productToEdit.type);               // Populate type
                $('#product-category').val(productToEdit.category_id);    // Populate category
                
                showSellerContent($productFormContainer);
            } catch (error) {
                console.error('No se pudo cargar el producto para editar:', error);
                alert('No se pudo cargar el producto para editar.');
            }
        });

        // Event delegation for the 'Delete' button on product cards.
        $productGrid.on('click', '.btn-delete', async function () {
            const productId = parseInt($(this).data('id'));
            if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) return;
            try {
                // Send the DELETE request to the API.
                await $.ajax({
                    url: `https://riwihub-back.onrender.com/api/items/${productId}`,
                    method: 'DELETE',
                    headers: { 'Authorization': 'Bearer ' + authToken }
                });
                alert('Producto eliminado.');
                renderSellerProducts(); // Refresh the product list.
            } catch (error) {
                console.error('Error al eliminar producto:', error);
                alert('Error al eliminar producto.');
            }
        });

        // --- INITIALIZATION ---
        // Initial render of seller products if the user is a logged-in seller.
        if (authToken && currentUser && currentUser.role === 'vendedor') {
            renderSellerProducts();
        }
    }
});