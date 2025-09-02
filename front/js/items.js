export var products = [];

var categoriesData = [{
    id: 2,
    containerId: '#container-snacks-products',
    parentId: 2,
    categoryName: 'Snacks'
},
{
    id: 1,
    containerId: '#container-tech-products',
    parentId: 2,
    categoryName: 'Tecnología'
},
{
    id:4,
    containerId:'#container-varios-view',
    parentId:2,
    categoryName: 'Varios'
},
{
    id:7,
    containerId:'#container-services',
    parentId:1,
    categoryName: 'Servicios de Conducción'
}]

$(document).ready(function () {
    async function loadProducts() {
        try {
            const items = await $.ajax({
                url: 'https://riwihub-back.onrender.com/api/items',
                method: 'GET',
            });

            products = items;

            filterByType();

        } catch (error) {
            console.error('Error al cargar las categorías:', error);
            $categorySelect.empty();
            $categorySelect.append('<option value="" disabled selected>Error al cargar categorías</option>');
        }
    }

    function filterByType() {
        categoriesData.forEach(category => {
            if (category.parentId === 2) {
                filterByProductsType(category);
            } else {
                filterByServiceType(category);
            }
        });
    }

    function filterByServiceType(categoryObject) {
        const filteredProducts = products.filter(product => 
            product.category_id === categoryObject.id ||
            product.category_id === 5 ||
            product.category_id === 6
        );
        setProductsView(filteredProducts, categoryObject);
    }

    function filterByProductsType(categoryObject) {
        const filteredProducts = products.filter(product => product.category_id === categoryObject.id);
        setProductsView(filteredProducts, categoryObject);
    }

    function setProductsView(filteredProducts, categoryObject) {
        const $productGrid = $(categoryObject.containerId);
        $productGrid.empty();
        filteredProducts.forEach(product => {
            const productElement = $(`
                <div class="product-box flex flex-col items-center border border-gray-100 rounded-lg mx-5 my-5 flex-grow-[0.5] transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:border-teal-500 group" data-item-id="${product.item_id}">
                    <div class="product-img w-52 h-52 m-5 relative cursor-pointer">
                        <img src="front/images/snacks/galletas.png" class="w-full h-full object-contain object-center rounded-4xl">
                        <div class="view-product-btn-container absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center hidden group-hover:flex transition-opacity duration-300">
                            <a href="#" class="view-product-btn text-white text-sm bg-teal-500 px-4 py-2 rounded-full font-bold hover:bg-teal-600 transition-colors">
                                Ver Producto
                            </a>
                        </div>
                    </div>
                    <div class="product-details flex flex-col items-center w-full p-5 border-t border-gray-100">
                        <a href="#" class="text-gray-700">${product.name}</a>
                        <span class="text-xl text-gray-800 font-normal">$${product.price}</span>
                    </div>
                </div>
            `);
            $productGrid.append(productElement);
        });
    }

    loadProducts();
})