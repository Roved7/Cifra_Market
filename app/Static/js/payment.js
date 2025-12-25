// Функция для обновления страницы оплаты
function updatePaymentPage() {
    const container = document.getElementById('payment-order-items');
    container.innerHTML = '';
    
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'order-item';
        itemElement.innerHTML = `
            <div class="item-name">${item.name}</div>
            <div class="item-price">${item.price * item.quantity} ₽</div>
        `;
        container.appendChild(itemElement);
        
        subtotal += item.price * item.quantity;
    });
    
    const commission = Math.round(subtotal * 0.02);
    const total = subtotal + commission;
    
    document.getElementById('payment-subtotal').textContent = `${subtotal} ₽`;
    document.getElementById('payment-commission').textContent = `${commission} ₽`;
    document.getElementById('payment-total').textContent = `${total} ₽`;
}

// Функция для применения ваучера на странице оплаты
function applyPaymentVoucher() {
    const code = document.getElementById('payment-voucher').value;
    if (code.toUpperCase() === 'WELCOME100') {
        showNotification('Ваучер применен! Скидка 100 ₽');
    } else {
        showNotification('Неверный код ваучера');
    }
}

// Функция для оплаты через PayPal
function payWithPayPal() {
    showNotification('Перенаправление на страницу PayPal...');
    // В реальном приложении здесь было бы перенаправление на PayPal
}

// Функция для обработки платежа
function processPayment() {
    const cardNumber = document.getElementById('card-number').value;
    const cardExpiry = document.getElementById('card-expiry').value;
    const cardCvv = document.getElementById('card-cvv').value;
    const cardName = document.getElementById('card-name').value;
    
    if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
        showNotification('Пожалуйста, заполните все поля банковской карты');
        return;
    }
    
    // Симуляция обработки платежа
    showNotification('Обработка платежа...');
    
    setTimeout(() => {
        showNotification('Платеж успешно завершен! Спасибо за покупку!');
        
        // Очищаем корзину
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        
        // Показываем сообщение о доставке цифрового товара
        setTimeout(() => {
            showNotification('Ссылки на скачивание отправлены на ваш email!');
        }, 1000);
        
        // Возвращаем на главную страницу
        setTimeout(() => {
            showPage('home');
        }, 3000);
    }, 2000);
}