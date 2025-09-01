$(document).ready(function () {
    // This script runs only after the DOM is fully loaded.

    // -------------------------------------------------------------------------
    // ------------------------- SELLER PROFILE LOGIC --------------------------
    // -------------------------------------------------------------------------

    if ($('#seller-profile-view').length > 0) {
        
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
            // SOLUCIÓN: Obtenemos el token y el usuario justo antes de la llamada a la API.
            const authToken = localStorage.getItem('userToken');
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));

            $productGrid.empty(); // Clear previous content

            // Security check: ensure the user is a logged-in seller.
            if (!authToken || !currentUser || currentUser.role !== 'vendedor') {
                $productGrid.html('<p class="text-center text-red-500 col-span-full">Debes iniciar sesión como vendedor para ver tus productos.</p>');
                return;
            }

            try {
                const products = await $.ajax({
                    url: 'https://riwihub-back.onrender.com/api/items',
                    method: 'GET',
                    headers: { 'Authorization': 'Bearer ' + authToken }
                });

                if (!products || products.length === 0) {
                    $productGrid.html('<p class="text-center text-gray-500 col-span-full">No tienes productos. ¡Añade uno para empezar!</p>');
                    return;
                }

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

        function showSellerContent($sectionToShow) {
            $productListContainer.addClass('hidden');
            $productFormContainer.addClass('hidden');
            $sectionToShow.removeClass('hidden');
        }

        // --- EVENT HANDLERS ---
        $('#btn-show-add-form').on('click', function () {
            $formTitle.text('Añadir Nuevo Producto');
            $productForm[0].reset();
            $('#product-id').val('');
            showSellerContent($productFormContainer);
        });
        
        $('#btn-show-products, #btn-cancel').on('click', function () {
            renderSellerProducts();
            showSellerContent($productListContainer);
        });

        $productForm.on('submit', async function (event) {
            event.preventDefault();
            // SOLUCIÓN: Obtenemos el token y el usuario justo antes de la llamada a la API.
            const authToken = localStorage.getItem('userToken');
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));

            if (!authToken || !currentUser || !currentUser.user_id) {
                alert("Error: No se pudo identificar al vendedor. Por favor, inicia sesión de nuevo.");
                return;
            }

            const id = $('#product-id').val();
            const formData = new FormData();
            formData.append('name', $('#product-name').val());
            formData.append('description', $('#product-description').val());
            formData.append('price', parseFloat($('#product-price').val()));
            formData.append('stock', parseInt($('#product-stock').val()));
            formData.append('type', $('#product-type').val());
            formData.append('category_id', parseInt($('#product-category').val()));
            formData.append('price_token', parseFloat($('#product-token-price').val()));
            formData.append('seller_id', currentUser.user_id);
            const fileInput = $('#product-image')[0].files[0];
            if (fileInput) formData.append('image', fileInput);

            const isUpdating = !!id;
            const url = isUpdating ? `https://riwihub-back.onrender.com/api/items/${id}` : `https://riwihub-back.onrender.com/api/items`;
            const method = isUpdating ? 'PUT' : 'POST';

            try {
                await $.ajax({
                    url, method, data: formData,
                    processData: false, contentType: false,
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

        $productGrid.on('click', '.btn-edit', async function () {
            // SOLUCIÓN: Obtenemos el token justo antes de la llamada a la API.
            const authToken = localStorage.getItem('userToken');
            const productId = parseInt($(this).data('id'));
            try {
                const productToEdit = await $.ajax({
                    url: `https://riwihub-back.onrender.com/api/items/${productId}`,
                    method: 'GET',
                    headers: { 'Authorization': 'Bearer ' + authToken }
                });
                $formTitle.text('Actualizar Producto');
                $('#product-id').val(productToEdit.item_id);
                $('#product-name').val(productToEdit.name);
                $('#product-description').val(productToEdit.description);
                $('#product-price').val(productToEdit.price);
                $('#product-token-price').val(productToEdit.price_token);
                $('#product-stock').val(productToEdit.stock);
                $('#product-type').val(productToEdit.type);
                $('#product-category').val(productToEdit.category_id);    
                showSellerContent($productFormContainer);
            } catch (error) {
                console.error('No se pudo cargar el producto para editar:', error);
                alert('No se pudo cargar el producto para editar.');
            }
        });
        
        $productGrid.on('click', '.btn-delete', async function () {
            // SOLUCIÓN: Obtenemos el token justo antes de la llamada a la API.
            const authToken = localStorage.getItem('userToken');
            const productId = parseInt($(this).data('id'));
            if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) return;
            try {
                await $.ajax({
                    url: `https://riwihub-back.onrender.com/api/items/${productId}`,
                    method: 'DELETE',
                    headers: { 'Authorization': 'Bearer ' + authToken }
                });
                alert('Producto eliminado.');
                renderSellerProducts();
            } catch (error) {
                console.error('Error al eliminar producto:', error);
                alert('Error al eliminar producto.');
            }
        });
        
        // --- INITIALIZATION ---
        // We call renderSellerProducts when the view is shown, not on initial page load.
        // A listener in app.js can trigger this. For now, let's call it when a seller logs in.
        // The best practice is to call renderSellerProducts() right after showSection('seller-profile-view') is called in app.js.
        if (localStorage.getItem('userToken') && JSON.parse(localStorage.getItem('currentUser')).role === 'vendedor') {
            renderSellerProducts();
        }
    }
});