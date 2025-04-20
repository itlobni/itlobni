// Sample product data
const products = [
    {
        id: 1,
        title: 'Fresh Apples',
        price: 2.99,
        oldPrice: 3.49,
        image: 'images/product-1.jpg',
        category: 'Fruits & Vegetables',
        rating: 4,
        badge: 'Sale'
    },
    {
        id: 2,
        title: 'Organic Bananas',
        price: 1.49,
        image: 'images/product-2.jpg',
        category: 'Fruits & Vegetables',
        rating: 5
    },
    {
        id: 3,
        title: 'Whole Milk',
        price: 3.29,
        image: 'images/product-3.jpg',
        category: 'Dairy & Eggs',
        rating: 4
    },
    {
        id: 4,
        title: 'Free Range Eggs',
        price: 4.99,
        image: 'images/product-4.jpg',
        category: 'Dairy & Eggs',
        rating: 5,
        badge: 'Popular'
    },
    {
        id: 5,
        title: 'Orange Juice',
        price: 2.99,
        oldPrice: 3.49,
        image: 'images/product-5.jpg',
        category: 'Beverages',
        rating: 4
    },
    {
        id: 6,
        title: 'Potato Chips',
        price: 1.99,
        image: 'images/product-6.jpg',
        category: 'Snacks',
        rating: 3
    },
    {
        id: 7,
        title: 'Whole Wheat Bread',
        price: 2.49,
        image: 'images/product-7.jpg',
        category: 'Bakery',
        rating: 4
    },
    {
        id: 8,
        title: 'Fresh Strawberries',
        price: 3.99,
        oldPrice: 4.49,
        image: 'images/product-8.jpg',
        category: 'Fruits & Vegetables',
        rating: 5,
        badge: 'Sale'
    }
];

// Display featured products on homepage
function displayFeaturedProducts() {
    const featuredContainer = document.getElementById('featured-products');
    if (!featuredContainer) return;
    
    // Get first 6 products as featured
    const featuredProducts = products.slice(0, 6);
    
    featuredContainer.innerHTML = featuredProducts.map(product => `
        <div class="product-card">
            ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            <img src="${product.image}" alt="${product.title}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <div class="product-price">
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                    ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                </div>
                <div class="product-rating">
                    ${'★'.repeat(product.rating)}${'☆'.repeat(5 - product.rating)}
                </div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

// Display all products on products page
function displayAllProducts() {
    const productsContainer = document.getElementById('all-products');
    if (!productsContainer) return;
    
    productsContainer.innerHTML = products.map(product => `
        <div class="product-card">
            ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            <img src="${product.image}" alt="${product.title}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <div class="product-price">
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                    ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                </div>
                <div class="product-rating">
                    ${'★'.repeat(product.rating)}${'☆'.repeat(5 - product.rating)}
                </div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

// Initialize product displays
document.addEventListener('DOMContentLoaded', function() {
    displayFeaturedProducts();
    displayAllProducts();
    
    // Sort functionality
    const sortSelect = document.getElementById('sort-by');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const value = this.value;
            let sortedProducts = [...products];
            
            switch(value) {
                case 'price-low':
                    sortedProducts.sort((a, b) => a.price - b.price);
                    break;
                case 'price-high':
                    sortedProducts.sort((a, b) => b.price - a.price);
                    break;
                case 'name-asc':
                    sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
                    break;
                case 'name-desc':
                    sortedProducts.sort((a, b) => b.title.localeCompare(a.title));
                    break;
                default:
                    // Default sorting (original order)
                    break;
            }
            
            // Re-render products
            const productsContainer = document.getElementById('all-products');
            if (productsContainer) {
                productsContainer.innerHTML = sortedProducts.map(product => `
                    <div class="product-card">
                        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                        <img src="${product.image}" alt="${product.title}" class="product-image">
                        <div class="product-info">
                            <h3 class="product-title">${product.title}</h3>
                            <div class="product-price">
                                <span class="current-price">$${product.price.toFixed(2)}</span>
                                ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                            </div>
                            <div class="product-rating">
                                ${'★'.repeat(product.rating)}${'☆'.repeat(5 - product.rating)}
                            </div>
                            <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
                        </div>
                    </div>
                `).join('');
            }
        });
    }
});
