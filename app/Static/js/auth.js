// API base URL
const AUTH_API_BASE_URL = '/auth';

// Функция для подписки на рассылку
function subscribeNewsletter() {
    const email = document.getElementById('newsletter-email').value;
    
    if (!email) {
        showNotification('Пожалуйста, введите email');
        return;
    }
    
    showNotification('Спасибо за подписку на нашу рассылку!');
    document.getElementById('newsletter-email').value = '';
}

// Функция для входа пользователя
async function loginUser() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        showNotification('Пожалуйста, заполните все поля');
        return;
    }
    
    try {
        const response = await fetch(`${AUTH_API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            // Сохраняем токен в localStorage для дальнейшего использования
            localStorage.setItem('access_token', data.access_token);
            showNotification('Вход выполнен успешно!');
            updateAuthUI(); // Обновляем UI после входа
            showPage('home');
        } else {
            const errorData = await response.json();
            showNotification(`Ошибка входа: ${errorData.detail || 'Неверный email или пароль'}`);
        }
    } catch (error) {
        console.error('Ошибка при входе:', error);
        showNotification('Ошибка при входе в систему');
    }
}

// Функция для регистрации пользователя
async function registerUser() {
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirm = document.getElementById('register-confirm').value;
    
    if (!name || !email || !password) {
        showNotification('Пожалуйста, заполните все поля');
        return;
    }
    
    if (password !== confirm) {
        showNotification('Пароли не совпадают');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Пароль должен содержать не менее 6 символов');
        return;
    }
    
    try {
        const response = await fetch(`${AUTH_API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        });
        
        if (response.ok) {
            showNotification('Регистрация завершена успешно!');
            showPage('login');
        } else {
            const errorData = await response.json();
            showNotification(`Ошибка регистрации: ${errorData.detail || 'Пользователь с таким email уже существует'}`);
        }
    } catch (error) {
        console.error('Ошибка при регистрации:', error);
        showNotification('Ошибка при регистрации');
    }
}

// Функция для выхода из системы
async function logoutUser() {
    try {
        const response = await fetch(`${AUTH_API_BASE_URL}/logout`, {
            method: 'POST',
        });
        
        if (response.ok) {
            // Удаляем токен из localStorage
            localStorage.removeItem('access_token');
            showNotification('Выход из системы выполнен успешно!');
            updateAuthUI(); // Обновляем UI после выхода
            showPage('home');
        } else {
            showNotification('Ошибка при выходе из системы');
        }
    } catch (error) {
        console.error('Ошибка при выходе:', error);
        showNotification('Ошибка при выходе из системы');
    }
}

// Функция для получения информации о текущем пользователе
async function getCurrentUser() {
    const token = localStorage.getItem('access_token');
    if (!token) {
        return null;
    }
    
    try {
        const response = await fetch(`${AUTH_API_BASE_URL}/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`  // или как токен передается в вашем приложении
            }
        });
        
        if (response.ok) {
            const user = await response.json();
            return user;
        } else {
            // Токен может быть просрочен, удаляем его
            localStorage.removeItem('access_token');
            return null;
        }
    } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error);
        return null;
    }
}

// Функция для обновления UI в зависимости от состояния авторизации
async function updateAuthUI() {
    const token = localStorage.getItem('access_token');
    const authButtons = document.querySelector('.auth-buttons');
    const cartIcon = document.querySelector('.cart-icon');
    
    if (!authButtons) return;
    
    if (token) {
        // Пользователь авторизован
        const user = await getCurrentUser();
        if (user) {
            // Заменяем кнопки входа/регистрации на профиль пользователя
            authButtons.innerHTML = `
                <a href="#" class="btn btn-outline" onclick="showProfile()">Профиль</a>
                <a href="#" class="btn btn-primary" onclick="logoutUser()">Выйти</a>
                ${cartIcon ? `<div class="cart-icon" onclick="showPage('cart')">
                    <i class="fas fa-shopping-cart"></i>
                    <span class="cart-count">0</span>
                </div>` : ''}
            `;
        } else {
            // Токен недействителен, очищаем его
            localStorage.removeItem('access_token');
            // Восстанавливаем кнопки входа/регистрации
            authButtons.innerHTML = `
                <a href="#" class="btn btn-outline" onclick="showPage('login')">Войти</a>
                <a href="#" class="btn btn-primary" onclick="showPage('register')">Регистрация</a>
                ${cartIcon ? `<div class="cart-icon" onclick="showPage('cart')">
                    <i class="fas fa-shopping-cart"></i>
                    <span class="cart-count">0</span>
                </div>` : ''}
            `;
        }
    } else {
        // Пользователь не авторизован
        authButtons.innerHTML = `
            <a href="#" class="btn btn-outline" onclick="showPage('login')">Войти</a>
            <a href="#" class="btn btn-primary" onclick="showPage('register')">Регистрация</a>
            ${cartIcon ? `<div class="cart-icon" onclick="showPage('cart')">
                <i class="fas fa-shopping-cart"></i>
                <span class="cart-count">0</span>
            </div>` : ''}
        `;
    }
}

// Функция для показа профиля пользователя (заглушка)
function showProfile() {
    showNotification('Страница профиля в разработке');
    // Здесь можно реализовать отображение страницы профиля
}

// Проверяем авторизацию при загрузке страницы
document.addEventListener('DOMContentLoaded', async function() {
    await updateAuthUI();
});