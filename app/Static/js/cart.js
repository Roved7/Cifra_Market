// Корзина
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// API base URL
const API_BASE_URL = '/orders'; // или другой маршрут для заказов

// Функция для добавления товара в корзину
function addToCart(product) {
    if (!product) return;
    
    // Проверяем, есть ли уже такой товар в корзине
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.title || product.name,
            price: product.price,
            imageColor: product.imageColor || '#4A90E2',
            type: product.type || 'Цифровой продукт',
            quantity: 1
        });
    }
    
    // Сохраняем корзину в localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Обновляем счетчик корзины
    updateCartCount();
    
    // Показываем уведомление
    showNotification('Товар добавлен в корзину!');
}

// Функция для обновления счетчика корзины
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelector('.cart-count').textContent = count;
}

// Функция для обновления страницы корзины
function updateCartPage() {
    const container = document.getElementById('cart-items-container');
    const emptyMessage = document.getElementById('empty-cart-message');
    
    if (cart.length === 0) {
        container.style.display = 'none';
        emptyMessage.style.display = 'block';
        return;
    }
    
    container.style.display = 'block';
    emptyMessage.style.display = 'none';
    container.innerHTML = '';
    
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div class="item-image" style="background-color: ${item.imageColor};">
                ${item.type}
            </div>
            <div class="item-details">
                <div class="item-title">${item.name}</div>
                <div class="item-description">${item.type}</div>
                <div class="item-price">${item.price} ₽</div>
            </div>
            <div class="item-actions">
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="changeQuantity(${item.id}, -1)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Удалить</button>
            </div>
        `;
        container.appendChild(itemElement);
        
        subtotal += item.price * item.quantity;
    });
    
    const commission = Math.round(subtotal * 0.02); // 2% комиссия
    const total = subtotal + commission;
    
    document.getElementById('subtotal').textContent = `${subtotal} ₽`;
    document.getElementById('commission').textContent = `${commission} ₽`;
    document.getElementById('total').textContent = `${total} ₽`;
}

// Функция для изменения количества товара
function changeQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartPage();
}

// Функция для удаления товара из корзины
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartPage();
}

// Функция для применения купона
function applyCoupon() {
    const code = document.getElementById('coupon-code').value;
    if (code.toUpperCase() === 'SALE10') {
        showNotification('Купон применен! Скидка 10%');
    } else {
        showNotification('Неверный код купона');
    }
}