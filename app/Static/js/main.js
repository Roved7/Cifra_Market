// Функция для отображения страницы
function showPage(pageId) {
    // Скрыть все страницы
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Показать выбранную страницу
    document.getElementById(pageId).classList.add('active');
    
    // Обновить активную ссылку в навигации
    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
    });
    
    // Установить активную ссылку для соответствующих страниц
    if (pageId === 'home') {
        document.querySelector('nav a[onclick="showPage(\'home\')"]').classList.add('active');
    } else if (pageId === 'catalog' || pageId === 'product' || pageId === 'cart' ||
               pageId === 'delivery' || pageId === 'payment') {
        document.querySelector('nav a[onclick="showPage(\'catalog\')"]').classList.add('active');
    } else if (pageId === 'about') {
        document.querySelector('nav a[onclick="showPage(\'about\')"]').classList.add('active');
    } else if (pageId === 'help') {
        document.querySelector('nav a[onclick="showPage(\'help\')"]').classList.add('active');
    }

    // Обновить данные на страницах
    if (pageId === 'cart') {
        updateCartPage();
    } else if (pageId === 'delivery') {
        updateDeliveryPage();
    } else if (pageId === 'payment') {
        updatePaymentPage();
    }
    
    // Прокрутить к верху страницы
    window.scrollTo(0, 0);
}

// Функция для показа уведомления
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Функция для переключения FAQ
function toggleFAQ(element) {
    const item = element.parentElement;
    item.classList.toggle('active');
}

// Функция для обновления страницы корзины
function updateCartPage() {
    // Загрузка содержимого корзины с API
    loadCartItems();
}

// Функция для обновления страницы доставки
function updateDeliveryPage() {
    // Загрузка данных для доставки
    updateDeliveryOrderSummary();
}

// Функция для обновления страницы оплаты
function updatePaymentPage() {
    // Загрузка данных для оплаты
    updatePaymentOrderSummary();
}

// Функция для обновления количества товаров в корзине
function updateCartCount() {
    // Получить количество товаров в корзине из localStorage или API
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

// Функция для добавления товара в корзину
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification('Товар добавлен в корзину!');
}

// Функция для загрузки содержимого корзины
function loadCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    
    if (cart.length === 0) {
        cartItemsContainer.style.display = 'none';
        emptyCartMessage.style.display = 'block';
        return;
    } else {
        cartItemsContainer.style.display = 'block';
        emptyCartMessage.style.display = 'none';
    }

    cartItemsContainer.innerHTML = '';
    let subtotal = 0;

    cart.forEach(item => {
        const itemTotal = (item.price || 0) * item.quantity;
        subtotal += itemTotal;
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="item-image" style="background-color: #4A90E2;">${item.title || item.name}</div>
            <div class="item-details">
                <div class="item-title">${item.title || item.name}</div>
                <div class="item-description">${item.description || 'Цифровой продукт'}</div>
                <div class="item-price">${itemTotal} ₽</div>
                <div class="item-actions">
                    <div class="quantity-control">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">Удалить</button>
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    // Обновить итоги
    subtotalElement.textContent = `${subtotal} ₽`;
    totalElement.textContent = `${subtotal} ₽`;
}

// Функция для обновления количества товара в корзине
function updateQuantity(productId, change) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(item => item.id !== productId);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        loadCartItems(); // Перезагрузить содержимое корзины
    }
}

// Функция для удаления товара из корзины
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    loadCartItems(); // Перезагрузить содержимое корзины
}

// Функция для обновления итогов на странице доставки
function updateDeliveryOrderSummary() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const orderItemsContainer = document.getElementById('delivery-order-items');
    const subtotalElement = document.getElementById('delivery-subtotal');
    const totalElement = document.getElementById('delivery-total');
    
    orderItemsContainer.innerHTML = '';
    let subtotal = 0;

    cart.forEach(item => {
        const itemTotal = (item.price || 0) * item.quantity;
        subtotal += itemTotal;
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <span class="item-name">${item.title || item.name}</span>
            <span>${itemTotal} ₽</span>
        `;
        orderItemsContainer.appendChild(orderItem);
    });

    // Обновить итоги
    subtotalElement.textContent = `${subtotal} ₽`;
    totalElement.textContent = `${subtotal} ₽`;
}

// Функция для обновления итогов на странице оплаты
function updatePaymentOrderSummary() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const orderItemsContainer = document.getElementById('payment-order-items');
    const subtotalElement = document.getElementById('payment-subtotal');
    const totalElement = document.getElementById('payment-total');
    
    orderItemsContainer.innerHTML = '';
    let subtotal = 0;

    cart.forEach(item => {
        const itemTotal = (item.price || 0) * item.quantity;
        subtotal += itemTotal;
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <span class="item-name">${item.title || item.name}</span>
            <span>${itemTotal} ₽</span>
        `;
        orderItemsContainer.appendChild(orderItem);
    });

    // Обновить итоги
    subtotalElement.textContent = `${subtotal} ₽`;
    totalElement.textContent = `${subtotal} ₽`;
}

// Функция для валидации формы доставки
function validateDeliveryForm() {
    const email = document.getElementById('email').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    
    if (!email || !firstName || !lastName) {
        showNotification('Пожалуйста, заполните все обязательные поля');
        return false;
    }
    
    // Перейти к оплате
    showPage('payment');
    return true;
}

// Функция для обработки оплаты
function processPayment() {
    // Здесь можно добавить вызов API для обработки оплаты
    showNotification('Платеж обрабатывается...');
    
    // После успешной оплаты очистить корзину и показать сообщение
    setTimeout(() => {
        localStorage.removeItem('cart');
        updateCartCount();
        showNotification('Платеж успешно обработан!');
        showPage('home');
    }, 2000);
}

// Функция для выбора способа доставки
function selectShipping(method) {
    // Снять выделение со всех способов доставки
    document.querySelectorAll('.shipping-option').forEach(option => {
        option.classList.remove('active');
    });
    
    // Выделить выбранный способ доставки
    event.currentTarget.classList.add('active');
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', async function() {
    updateCartCount();
    if (typeof loadCatalogProducts === 'function') {
        loadCatalogProducts();
    }
    if (typeof loadPersonalizedProducts === 'function') {
        loadPersonalizedProducts();
    }
    
    // Обновляем UI авторизации (если функция существует)
    if (typeof updateAuthUI === 'function') {
        await updateAuthUI();
    }
    
    // Обработчики форм
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Функция loginUser будет определена в auth.js
            if (typeof loginUser === 'function') {
                loginUser();
            } else {
                showNotification('Функция входа не загружена');
            }
        });
    }
    
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Функция registerUser будет определена в auth.js
            if (typeof registerUser === 'function') {
                registerUser();
            } else {
                showNotification('Функция регистрации не загружена');
            }
        });
    }
    
    // Обработчик поиска
    const mainSearch = document.getElementById('main-search');
    if (mainSearch) {
        mainSearch.addEventListener('input', function() {
            if (typeof showSearchSuggestions === 'function') {
                showSearchSuggestions(this.value);
            }
        });
    }
    
    if (mainSearch) {
        mainSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (typeof searchProducts === 'function') {
                    searchProducts();
                }
            }
        });
    }
    
    // Скрываем подсказки при клике вне поля поиска
    document.addEventListener('click', function(e) {
        const searchSuggestions = document.getElementById('search-suggestions');
        if (searchSuggestions && !e.target.closest('.search-bar')) {
            searchSuggestions.style.display = 'none';
        }
    });
});
