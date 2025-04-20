// Cart functionality
document.addEventListener('DOMContentLoaded', function() {
    // Display cart items on cart page
    displayCartItems();
    
    // Display cart items on checkout page
    displayCheckoutItems();
    
    // Handle quantity changes
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = this.closest('.cart-item').dataset.id;
            const isIncrease = this.classList.contains('increase');
            updateCartItemQuantity(itemId, isIncrease);
        });
    });
    
    // Handle remove item
    document.querySelectorAll('.remove-item').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const itemId = this.closest('.cart-item').dataset.id;
            removeCartItem(itemId);
        });
    });
    
    // Handle checkout form submission
    const checkoutForm = document.getElementById('shipping-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // In a real app, you would process the payment here
            alert('Order placed successfully!');
            localStorage.removeItem('cart');
            window.location.href = 'index.html';
        });
    }
});

// Display cart items on cart page
function displayCartItems() {
    const cartContainer = document.getElementById('cart-items');
    if (!cartContainer) return;
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <a href="products.html" class="btn">Continue Shopping</a>
            </div>
        `;
        updateSummary(0);
        return;
    }
    
    cartContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.title}" class="cart-item-image">
            <div class="cart-item-details">
                <h3 class="cart-item-title">${item.title}</h3>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1">
                    <button class="quantity-btn increase">+</button>
                </div>
                <a href="#" class="remove-item">Remove</a>
            </div>
        </div>
    `).join('');
    
    // Update summary
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    updateSummary(subtotal);
    
    // Add event listeners to new buttons
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = this.closest('.cart-item').dataset.id;
            const isIncrease = this.classList.contains('increase');
            updateCartItemQuantity(itemId, isIncrease);
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const itemId = this.closest('.cart-item').dataset.id;
            removeCartItem(itemId);
        });
    });
}

// Display cart items on checkout page
function displayCheckoutItems() {
    const checkoutContainer = document.getElementById('checkout-items');
    if (!checkoutContainer) return;
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    checkoutContainer.innerHTML = cart.map(item => `
        <div class="summary-item">
            <div class="summary-item-name">${item.title} × ${item.quantity}</div>
            <div class="summary-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
        </div>
    `).join('');
    
    // Update summary
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    document.getElementById('checkout-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('checkout-total').textContent = `$${(subtotal + 5).toFixed(2)}`;
}

// Update cart item quantity
function updateCartItemQuantity(itemId, isIncrease) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => item.id == itemId);
    
    if (itemIndex === -1) return;
    
    if (isIncrease) {
        cart[itemIndex].quantity += 1;
    } else {
        if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity -= 1;
        } else {
            // If quantity would become 0, remove the item
            cart.splice(itemIndex, 1);
        }
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCartItems();
}

// Remove item from cart
function removeCartItem(itemId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id != itemId);
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCartItems();
}

// Update order summary
function updateSummary(subtotal) {
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('total').textContent = `$${(subtotal + 5).toFixed(2)}`;
}
