// Текущий продукт
let currentProduct = null;
let allProducts = []; // Хранение всех продуктов, загруженных с API

// API base URL
const API_BASE_URL = '/products';
const REVIEWS_API_BASE_URL = '/reviews';

// Функция для отображения страницы продукта
async function showProduct(productId) {
    try {
        // Получить данные о продукте с API
        const response = await fetch(`${API_BASE_URL}/${productId}`);
        if (!response.ok) {
            throw new Error(`Ошибка при получении продукта: ${response.status}`);
        }
        currentProduct = await response.json();
        if (!currentProduct) return;
        
        // Заполнить данные о продукте
        document.getElementById('product-name').textContent = currentProduct.title || 'Название продукта';
        document.getElementById('product-category').textContent = 'Цифровой продукт'; // Временное значение
        document.getElementById('product-title').textContent = currentProduct.title || 'Название продукта';
        document.getElementById('product-rating').textContent = '★★★★☆'; // Временное значение
        document.getElementById('reviews-count').textContent = '0 Reviews'; // Временное значение
        document.getElementById('reviews-count-badge').textContent = '0 Reviews'; // Временное значение
        document.getElementById('product-description').innerHTML = `<p>${currentProduct.description || 'Описание отсутствует'}</p>`;
        document.getElementById('product-price').textContent = `${currentProduct.price || 0} ₽`;
        document.getElementById('product-image').style.backgroundColor = '#4A90E2'; // Временное значение
        document.getElementById('product-image').textContent = 'Продукт'; // Временное значение
        
        // Заполнить модели (временно)
        const modelOptions = document.getElementById('model-options');
        modelOptions.innerHTML = '';
        const defaultModel = document.createElement('div');
        defaultModel.className = 'model-option active';
        defaultModel.textContent = 'Стандартная модель';
        modelOptions.appendChild(defaultModel);
        
        // Заполнить отзывы
        await loadReviewsForProduct(productId);
        
        // Заполнить похожие товары
        await loadSimilarProducts(currentProduct.id, currentProduct.author_id);
        
        showPage('product');
    } catch (error) {
        console.error('Ошибка при загрузке продукта:', error);
        showNotification('Ошибка при загрузке продукта');
    }
}

// Функция для загрузки отзывов к продукту
async function loadReviewsForProduct(productId) {
    try {
        const response = await fetch(`${REVIEWS_API_BASE_URL}/`);
        if (!response.ok) {
            throw new Error(`Ошибка при получении отзывов: ${response.status}`);
        }
        const reviews = await response.json();
        const filteredReviews = reviews.filter(review => review.product_id === productId);
        const reviewsList = document.getElementById('reviews-list');
        reviewsList.innerHTML = '';
        
        if (filteredReviews.length === 0) {
            reviewsList.innerHTML = '<p>Отзывов пока нет. Будьте первым, кто оставит отзыв!</p>';
        } else {
            filteredReviews.forEach(review => {
                const reviewElement = document.createElement('div');
                reviewElement.className = 'review-item';
                reviewElement.innerHTML = `
                    <div class="review-header">
                        <div class="review-author">Пользователь ${review.user_id}</div>
                        <div class="review-date">${new Date().toLocaleDateString('ru-RU')}</div>
                    </div>
                    <div class="review-text">${review.comment || 'Без комментария'}</div>
                `;
                reviewsList.appendChild(reviewElement);
            });
        }
    } catch (error) {
        console.error('Ошибка при загрузке отзывов:', error);
        document.getElementById('reviews-list').innerHTML = '<p>Ошибка загрузки отзывов</p>';
    }
}

// Функция для загрузки похожих товаров
async function loadSimilarProducts(productId, authorId) {
    try {
        const response = await fetch(`${API_BASE_URL}/`);
        if (!response.ok) {
            throw new Error(`Ошибка при получении товаров: ${response.status}`);
        }
        const products = await response.json();
        const similarProducts = document.getElementById('similar-products');
        similarProducts.innerHTML = '';
        
        // Фильтруем продукты от того же автора (или по другим критериям), исключая текущий продукт
        const similar = products.filter(p => p.author_id === authorId && p.id !== productId).slice(0, 5);
        if (similar.length === 0) {
            // Если нет продуктов от того же автора, берем первые 5 других продуктов
            const otherProducts = products.filter(p => p.id !== productId).slice(0, 5);
            otherProducts.forEach(product => {
                const productElement = createProductCardSmall(product);
                similarProducts.appendChild(productElement);
            });
        } else {
            similar.forEach(product => {
                const productElement = createProductCardSmall(product);
                similarProducts.appendChild(productElement);
            });
        }
    } catch (error) {
        console.error('Ошибка при загрузке похожих продуктов:', error);
    }
}

// Вспомогательная функция для создания карточки продукта (маленькая)
function createProductCardSmall(product) {
    const productElement = document.createElement('div');
    productElement.className = 'product-card-small';
    productElement.onclick = () => showProduct(product.id);
    productElement.innerHTML = `
        <div class="product-card-image" style="background-color: #4A90E2;">
            Продукт
        </div>
        <div class="product-card-info">
            <h3>${product.title || product.name}</h3>
            <div class="product-card-price">${product.price || 0} ₽</div>
        </div>
    `;
    return productElement;
}

// Функция для загрузки товаров в каталог
async function loadCatalogProducts(productsToShow = null) {
    try {
        if (!productsToShow) {
            if (allProducts.length === 0) {
                const response = await fetch(`${API_BASE_URL}/`);
                if (!response.ok) {
                    throw new Error(`Ошибка при получении товаров: ${response.status}`);
                }
                allProducts = await response.json();
            }
            productsToShow = allProducts;
        }

        const catalogProducts = document.getElementById('catalog-products');
        catalogProducts.innerHTML = '';
        
        productsToShow.forEach(product => {
            const productElement = document.createElement('div');
            productElement.className = 'product-card';
            productElement.onclick = () => showProduct(product.id);
            productElement.innerHTML = `
                <div class="product-image" style="background-color: #4A90E2;">
                    <div class="product-badge">ЦИФРОВОЙ ПРОДУКТ</div>
                    Продукт
                </div>
                <div class="product-info">
                    <h3>${product.title || product.name}</h3>
                    <div class="product-meta">
                        <span>Цифровой продукт</span>
                        <span class="product-rating">★★★★☆</span>
                    </div>
                    <div class="product-price">
                        ${product.price || 0} ₽
                    </div>
                </div>
            `;
            catalogProducts.appendChild(productElement);
        });
    } catch (error) {
        console.error('Ошибка при загрузке каталога:', error);
        document.getElementById('catalog-products').innerHTML = '<p>Ошибка загрузки товаров</p>';
    }
}

// Функция для загрузки персонализированных товаров
async function loadPersonalizedProducts() {
    try {
        if (allProducts.length === 0) {
            const response = await fetch(`${API_BASE_URL}/`);
            if (!response.ok) {
                throw new Error(`Ошибка при получении товаров: ${response.status}`);
            }
            allProducts = await response.json();
        }

        const personalizedProducts = document.getElementById('personalized-products');
        personalizedProducts.innerHTML = '';
        
        // Берем случайные товары для персонализированной подборки
        const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 4);
        
        selected.forEach(product => {
            const productElement = document.createElement('div');
            productElement.className = 'personal-product';
            productElement.onclick = () => showProduct(product.id);
            productElement.innerHTML = `
                <h3>${product.title || product.name}</h3>
                <div class="personal-price">${product.price || 0} ₽</div>
            `;
            personalizedProducts.appendChild(productElement);
        });
    } catch (error) {
        console.error('Ошибка при загрузке персонализированных товаров:', error);
    }
}

// Функция для фильтрации товаров
async function filterProducts(category) {
    try {
        if (allProducts.length === 0) {
            const response = await fetch(`${API_BASE_URL}/`);
            if (!response.ok) {
                throw new Error(`Ошибка при получении товаров: ${response.status}`);
            }
            allProducts = await response.json();
        }

        // Обновляем активную категорию
        document.querySelectorAll('.category-item').forEach(item => {
            item.classList.remove('active');
        });
        event.currentTarget.classList.add('active');
        
        let filteredProducts = allProducts;
        
        // В реальной реализации можно добавить фильтрацию по категориям
        // Сейчас просто показываем все продукты
        if (category !== 'all') {
            // Здесь можно реализовать фильтрацию по категории, если у продуктов есть поле category
            filteredProducts = allProducts;
        }
        
        loadCatalogProducts(filteredProducts);
        
        // Скрываем другие секции при фильтрации
        const sections = document.querySelectorAll('#catalog .sale-banner, #catalog .inspiration, #catalog .personalized, #catalog .other-offer');
        sections.forEach(section => {
            section.classList.add('hidden-section');
        });
        
        // Показываем кнопку сброса фильтров
        const resetButton = document.createElement('div');
        resetButton.className = 'reset-filters';
        resetButton.innerHTML = `<button class="btn btn-outline" onclick="resetFilters()">Показать все товары</button>`;
        
        const catalogSection = document.querySelector('#catalog .bestsellers');
        if (!document.querySelector('.reset-filters')) {
            catalogSection.appendChild(resetButton);
        }
    } catch (error) {
        console.error('Ошибка при фильтрации товаров:', error);
    }
}

// Функция для сброса фильтров
async function resetFilters() {
    // Сбрасываем активную категорию
    document.querySelectorAll('.category-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector('.category-item').classList.add('active');
    
    await loadCatalogProducts();
    
    // Показываем все секции
    const sections = document.querySelectorAll('#catalog .hidden-section');
    sections.forEach(section => {
        section.classList.remove('hidden-section');
    });
    
    // Удаляем кнопку сброса
    const resetButton = document.querySelector('.reset-filters');
    if (resetButton) {
        resetButton.remove();
    }
}

// Функция для показа товаров со скидкой
async function showSaleProducts() {
    try {
        if (allProducts.length === 0) {
            const response = await fetch(`${API_BASE_URL}/`);
            if (!response.ok) {
                throw new Error(`Ошибка при получении товаров: ${response.status}`);
            }
            allProducts = await response.json();
        }

        // В реальной реализации можно фильтровать продукты со скидкой
        // Сейчас просто показываем все продукты
        const saleProducts = allProducts;
        loadCatalogProducts(saleProducts);
        
        // Скрываем другие секции
        const sections = document.querySelectorAll('#catalog .categories-page, #catalog .sale-banner, #catalog .inspiration, #catalog .personalized, #catalog .other-offer');
        sections.forEach(section => {
            section.classList.add('hidden-section');
        });
        
        // Показываем кнопку сброса фильтров
        const resetButton = document.createElement('div');
        resetButton.className = 'reset-filters';
        resetButton.innerHTML = `<button class="btn btn-outline" onclick="resetFilters()">Показать все товары</button>`;
        
        const catalogSection = document.querySelector('#catalog .bestsellers');
        if (!document.querySelector('.reset-filters')) {
            catalogSection.appendChild(resetButton);
        }
    } catch (error) {
        console.error('Ошибка при показе товаров со скидкой:', error);
    }
}

// Функция для поиска товаров
async function searchProducts() {
    const query = document.getElementById('main-search').value.toLowerCase().trim();
    
    if (!query) {
        showNotification('Введите поисковый запрос');
        return;
    }
    
    try {
        // Переходим на страницу каталога
        showPage('catalog');
        
        if (allProducts.length === 0) {
            const response = await fetch(`${API_BASE_URL}/`);
            if (!response.ok) {
                throw new Error(`Ошибка при получении товаров: ${response.status}`);
            }
            allProducts = await response.json();
        }

        // Ищем товары
        const searchResults = allProducts.filter(product => 
            (product.title && product.title.toLowerCase().includes(query)) || 
            (product.description && product.description.toLowerCase().includes(query))
        );
        
        // Загружаем результаты поиска
        loadCatalogProducts(searchResults);
        
        // Скрываем другие секции
        const sections = document.querySelectorAll('#catalog .categories-page, #catalog .sale-banner, #catalog .inspiration, #catalog .personalized, #catalog .other-offer');
        sections.forEach(section => {
            section.classList.add('hidden-section');
        });
        
        // Добавляем заголовок с результатами поиска
        const catalogSection = document.querySelector('#catalog .bestsellers');
        const existingHeader = document.querySelector('.search-results-header');
        
        if (existingHeader) {
            existingHeader.remove();
        }
        
        const searchHeader = document.createElement('div');
        searchHeader.className = 'search-results-header';
        searchHeader.innerHTML = `
            <h2 class="search-query">Результаты поиска: "${query}"</h2>
            <div class="search-results-count">Найдено товаров: ${searchResults.length}</div>
        `;
        
        catalogSection.insertBefore(searchHeader, catalogSection.firstChild);
        
        // Показываем кнопку сброса
        const resetButton = document.createElement('div');
        resetButton.className = 'reset-filters';
        resetButton.innerHTML = `<button class="btn btn-outline" onclick="resetFilters()">Показать все товары</button>`;
        
        if (!document.querySelector('.reset-filters')) {
            catalogSection.appendChild(resetButton);
        }
        
        // Очищаем поле поиска
        document.getElementById('main-search').value = '';
        document.getElementById('search-suggestions').style.display = 'none';
    } catch (error) {
        console.error('Ошибка при поиске товаров:', error);
        showNotification('Ошибка при поиске товаров');
    }
}

// Функция для показа подсказок при поиске
async function showSearchSuggestions(query) {
    const suggestionsContainer = document.getElementById('search-suggestions');
    
    if (!query) {
        suggestionsContainer.style.display = 'none';
        return;
    }

    try {
        if (allProducts.length === 0) {
            const response = await fetch(`${API_BASE_URL}/`);
            if (!response.ok) {
                throw new Error(`Ошибка при получении товаров: ${response.status}`);
            }
            allProducts = await response.json();
        }

        // Ищем товары, соответствующие запросу
        const suggestions = allProducts.filter(product => 
            (product.title && product.title.toLowerCase().includes(query.toLowerCase())) || 
            (product.description && product.description.toLowerCase().includes(query.toLowerCase()))
        ).slice(0, 5);
        
        if (suggestions.length === 0) {
            suggestionsContainer.style.display = 'none';
            return;
        }
        
        // Формируем список подсказок
        suggestionsContainer.innerHTML = '';
        suggestions.forEach(product => {
            const suggestion = document.createElement('div');
            suggestion.className = 'search-suggestion';
            suggestion.textContent = product.title || product.name;
            suggestion.onclick = function() {
                document.getElementById('main-search').value = product.title || product.name;
                suggestionsContainer.style.display = 'none';
                searchProducts();
            };
            suggestionsContainer.appendChild(suggestion);
        });
        
        suggestionsContainer.style.display = 'block';
    } catch (error) {
        console.error('Ошибка при показе подсказок:', error);
        suggestionsContainer.style.display = 'none';
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Загружаем каталог и персонализированные продукты при инициализации
    loadCatalogProducts();
    loadPersonalizedProducts();
});
