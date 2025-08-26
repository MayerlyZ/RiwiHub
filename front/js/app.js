$(document).ready(function() {
    $('#adaptive').lightSlider({
        adaptiveHeight:true,
        auto:true,
        item:1,
        slideMargin:0,
        loop:true
    });
    $('#autoWidth').lightSlider({
        autoWidth:true,
        loop:true,
        onSliderLoad: function(){
            $('#autoWidth').removeClass('cS-hidden');
        }
    });

    // Lógica de los formularios y la barra de búsqueda
    $(document).on('click', '.search-icon', function(){
        $('.search-bar').removeClass('hidden').addClass('flex');
    });

    $(document).on('click', '.search-cancel-icon', function(){
        $('.search-bar').addClass('hidden').removeClass('flex');
    });

    $(document).on('click', '.user-icon, .already-account-btn', function(){
        $('.form-container').removeClass('hidden').addClass('flex');
        $('.login-form').removeClass('hidden').addClass('flex');
        $('.sign-up-form').addClass('hidden').removeClass('flex');
    });

    $(document).on('click', '.sign-up-btn', function(){
        $('.form-container').removeClass('hidden').addClass('flex');
        $('.sign-up-form').removeClass('hidden').addClass('flex');
        $('.login-form').addClass('hidden').removeClass('flex');
    });

    $(document).on('click', '.form-cancel-icon', function(){
        $('.form-container').addClass('hidden').removeClass('flex');
    });
    
    // Lógica del menú responsivo
    $(document).on('click', '.menu-toggle', function() {
        $('.mobile-menu').toggleClass('hidden');
    });
});

    // =============================================================
    // ================ LÓGICA DEL MODAL DE PRODUCTO ===============
    // =============================================================

    $('.product-box').on('click', function() {
        const itemId = $(this).data('item-id');
        if (!itemId) return;

        $.ajax({
            url: `http://localhost:5000/api/items/${itemId}`,
            method: 'GET',
            success: function(productData) {
                // Usamos los nombres correctos de la API (snake_case)
                $('#modal-name').text(productData.name);
                $('#modal-description').text(productData.description || 'No hay descripción disponible.');
                $('#modal-price').text(`$${productData.price}`);
                
                if (productData.token_price) {
                    $('#modal-token-price').text(productData.token_price);
                    $('#redeem-button').show();
                } else {
                    $('#modal-token-price').text('No canjeable');
                    $('#redeem-button').hide();
                }

                // Aquí también usamos la clave correcta: item_id
                $('#redeem-button').data('item-id', productData.item_id);
                
                $('#product-modal').removeClass('hidden').addClass('flex');
                setTimeout(() => {
                    $('#modal-content-wrapper').removeClass('scale-95 opacity-0').addClass('scale-100 opacity-100');
                }, 10);

            }.bind(this),
            error: function(err) {
                console.error("Error al obtener el producto:", err);
                alert("No se pudo cargar la información del producto.");
            }
        });
    });

    function closeModal() {
        $('#modal-content-wrapper').removeClass('scale-100 opacity-100').addClass('scale-95 opacity-0');
        setTimeout(() => {
            $('#product-modal').addClass('hidden').removeClass('flex');
        }, 300);
    }

    $('#modal-close').on('click', closeModal);

    $('#redeem-button').on('click', function() {
        const itemId = $(this).data('item-id');
        alert(`Iniciando proceso de canje para el producto ${itemId}.`);
        closeModal();
    });