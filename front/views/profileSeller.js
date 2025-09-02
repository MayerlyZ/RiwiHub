$(document).ready(function () {
    // This script runs only after the DOM is fully loaded.

    // -------------------------------------------------------------------------
    // ------------------------- SELLER PROFILE LOGIC --------------------------
    // -------------------------------------------------------------------------

    if ($('#seller-profile-view').length > 0) {
        
        // --- JQUERY SELECTORS ---
        const $productGrid = $('#product-grid');
        const $productListContainer = $('#product-list-container');
        const $productFormContainer = $('#product-form-container');
        const $formTitle = $('#form-title');
        const $productForm = $('#product-form');
        const $categorySelect = $('#product-category');

        async function loadAndPopulateCategories() {
            const authToken = localStorage.getItem('userToken');
            try {
                const categories = await $.ajax({
                    url: 'https://riwihub-back.onrender.com/api/categories',
                    method: 'GET',
                    headers: { 'Authorization': 'Bearer ' + authToken } 
                });
                $categorySelect.empty();
                $categorySelect.append('<option value="" disabled selected>-- Selecciona una categoría --</option>');
                categories.forEach(category => {
                    const optionHTML = `<option value="${category.category_id}">${category.name}</option>`;
                    $categorySelect.append(optionHTML);
                });
            } catch (error) {
                console.error('Error al cargar las categorías:', error);
                $categorySelect.empty();
                $categorySelect.append('<option value="" disabled selected>Error al cargar categorías</option>');
            }
        }

        async function renderSellerProducts() {
            const authToken = localStorage.getItem('userToken');
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            $productGrid.empty();

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
                    // Usamos una imagen genérica ya que no manejaremos imágenes por ahora.
                    const productCardHTML = `
                        <div class="bg-white border rounded-lg shadow-md overflow-hidden" data-item-id="${product.item_id}">
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

        // =========================================================================
        // ======================= CAMBIO MÁS IMPORTANTE AQUÍ ======================
        // =========================================================================
        $productForm.on('submit', async function (event) {
            event.preventDefault();
            const authToken = localStorage.getItem('userToken');
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));

            if (!authToken || !currentUser || !currentUser.user_id) {
                alert("Error: No se pudo identificar al vendedor. Por favor, inicia sesión de nuevo.");
                return;
            }

            // This is the original data structure, which can cause issues with empty optional fields.
            const productData = {
                name: $('#product-name').val(),
                description: $('#product-description').val(),
                price: parseFloat($('#product-price').val()),
                type: $('#product-type').val(),
                category_id: parseInt($('#product-category').val()),
                seller_id: currentUser.user_id,
                stock: parseInt($('#product-stock').val()),
                price_token: parseFloat($('#product-token-price').val())
            };
            
            const id = $('#product-id').val();
            const isUpdating = !!id;
            const url = isUpdating ? `https://riwihub-back.onrender.com/api/items/${id}` : `https://riwihub-back.onrender.com/api/items`;
            const method = isUpdating ? 'PUT' : 'POST';

            try {
                await $.ajax({
                    url: url,
                    method: method,
                    data: JSON.stringify(productData),
                    contentType: 'application/json; charset=utf-8', 
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
        
        // --- INITIALIZATION (NUEVA LÓGICA) ---
        // Este código observa la vista del vendedor. Cuando se hace visible,
        // ejecuta la lógica para cargar las categorías y los productos.
        const sellerViewNode = document.getElementById('seller-profile-view');
        if (sellerViewNode) {
            const observer = new MutationObserver(function(mutationsList) {
                for(const mutation of mutationsList) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        const isVisible = !sellerViewNode.classList.contains('hidden');
                        
                        // Si la vista se acaba de hacer visible, cargamos los datos.
                        if (isVisible) {
                            console.log('Vista del vendedor visible. Cargando datos...');
                            loadAndPopulateCategories();
                            renderSellerProducts();
                        }
                    }
                }
            });

            // Le decimos al observador que vigile los cambios en la clase 'hidden'
            observer.observe(sellerViewNode, { attributes: true });
        }
    }
});
