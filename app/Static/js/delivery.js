// Функция для обновления страницы доставки
function updateDeliveryPage() {
    const container = document.getElementById('delivery-order-items');
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
    
    document.getElementById('delivery-subtotal').textContent = `${subtotal} ₽`;
    document.getElementById('delivery-commission').textContent = `${commission} ₽`;
    document.getElementById('delivery-total').textContent = `${total} ₽`;
}

// Функция для выбора способа доставки
function selectShipping(type) {
    document.querySelectorAll('.shipping-option').forEach(option => {
        option.classList.remove('active');
        option.querySelector('input').checked = false;
    });
    
    event.currentTarget.classList.add('active');
    event.currentTarget.querySelector('input').checked = true;
    
    // Обновляем стоимость доставки
    const shippingCost = document.getElementById('delivery-shipping');
    const totalElement = document.getElementById('delivery-total');
    
    if (type === 'express') {
        shippingCost.textContent = '1 500 ₽';
        // Пересчитываем итого с учетом доставки
        const subtotal = parseInt(document.getElementById('delivery-subtotal').textContent);
        const commission = parseInt(document.getElementById('delivery-commission').textContent);
        const total = subtotal + commission + 1500;
        totalElement.textContent = `${total} ₽`;
    } else if (type === 'digital') {
        shippingCost.textContent = 'БЕСПЛАТНО';
        // Пересчитываем итого без доставки
        const subtotal = parseInt(document.getElementById('delivery-subtotal').textContent);
        const commission = parseInt(document.getElementById('delivery-commission').textContent);
        const total = subtotal + commission;
        totalElement.textContent = `${total} ₽`;
    } else {
        shippingCost.textContent = 'БЕСПЛАТНО';
        // Пересчитываем итого без доставки
        const subtotal = parseInt(document.getElementById('delivery-subtotal').textContent);
        const commission = parseInt(document.getElementById('delivery-commission').textContent);
        const total = subtotal + commission;
        totalElement.textContent = `${total} ₽`;
    }
}

// Функция для применения ваучера
function applyVoucher() {
    const code = document.getElementById('voucher-code').value;
    if (code.toUpperCase() === 'WELCOME100') {
        showNotification('Ваучер применен! Скидка 100 ₽');
    } else {
        showNotification('Неверный код ваучера');
    }
}

// Функция для валидации формы доставки
function validateDeliveryForm() {
    const email = document.getElementById('email').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    
    if (!email || !firstName || !lastName) {
        showNotification('Пожалуйста, заполните все обязательные поля');
        return;
    }
    
    showPage('payment');
}