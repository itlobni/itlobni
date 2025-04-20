// Main JavaScript file for FreshMart E-commerce

// ======================
//  CART FUNCTIONALITY
// ======================

// Update cart count in header
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('#cart-count').forEach(el => {
        el.textContent = totalItems;
    });
}

// Add to cart function
function addToCart(productId, quantity = 1) {
    // Check if user is logged in
    if (!localStorage.getItem('currentUser')) {
        showNotification('Please login to add items to cart', 'error');
        document.querySelector('.auth-toggle')?.click(); // Open auth dropdown
        return;
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let product = products.find(p => p.id == productId);
    
    if (!product) return;
    
    let existingItem = cart.find(item => item.id == productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Show added to cart notification
    showNotification(`${product.title} added to cart`);
}

// ======================
//  AUTHENTICATION SYSTEM
// ======================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize auth dropdown
    setupAuthDropdown();
    
    // Check if user is logged in on page load
    checkLoggedIn();
    
    // Update cart count
    updateCartCount();
});

function setupAuthDropdown() {
    // Toggle between login and signup forms
    document.getElementById('show-signup')?.addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('signup-form').style.display = 'block';
    });

    document.getElementById('show-login')?.addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('signup-form').style.display = 'none';
        document.getElementById('login-form').style.display = 'block';
    });

    // Login form submission
    document.getElementById('login-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            updateAuthUI(user.name);
            showNotification('Logged in successfully!');
            closeAuthDropdown();
        } else {
            showNotification('Invalid email or password', 'error');
        }
    });

    // Signup form submission
    document.getElementById('signup-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const user = {
            id: Date.now().toString(),
            name: document.getElementById('signup-name').value,
            email: document.getElementById('signup-email').value,
            phone: document.getElementById('signup-phone').value,
            password: document.getElementById('signup-password').value,
            verified: true, // Skip verification for demo
            createdAt: new Date().toISOString()
        };
        
        // Validate email format
        if (!validateEmail(user.email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Validate phone number
        if (!validatePhone(user.phone)) {
            showNotification('Please enter a valid phone number', 'error');
            return;
        }
        
        // Check if email already exists
        const users = JSON.parse(localStorage.getItem('users')) || [];
        if (users.some(u => u.email === user.email)) {
            showNotification('Email already registered', 'error');
            return;
        }
        
        // Save user
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Update UI
        updateAuthUI(user.name);
        showNotification('Account created successfully!');
        document.getElementById('signup-form').reset();
        closeAuthDropdown();
    });
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    // Simple validation - at least 8 digits
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 8;
}

function closeAuthDropdown() {
    document.querySelector('.dropdown-content').style.display = 'none';
}

// Update authentication UI
function updateAuthUI(username) {
    const authStatus = document.getElementById('auth-status');
    if (authStatus) {
        authStatus.textContent = username;
    }
    
    // Add logout option
    const dropdown = document.querySelector('.dropdown-content');
    if (dropdown) {
        // Remove existing logout button if any
        const existingLogout = dropdown.querySelector('.logout-btn');
        if (existingLogout) existingLogout.remove();
        
        // Create new logout button
        const logoutBtn = document.createElement('button');
        logoutBtn.className = 'btn btn-small logout-btn';
        logoutBtn.textContent = 'Logout';
        logoutBtn.style.marginTop = '10px';
        logoutBtn.style.width = '100%';
        logoutBtn.onclick = function(e) {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            updateAuthUI('Login/Signup');
            showNotification('Logged out successfully');
            closeAuthDropdown();
            
            // Clear cart if you want to reset cart on logout
            // localStorage.removeItem('cart');
            // updateCartCount();
            
            return false;
        };
        
        dropdown.appendChild(logoutBtn);
    }
    
    // Update welcome message on products page
    personalizeContent();
}

// Check if user is logged in
function checkLoggedIn() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        updateAuthUI(currentUser.name);
    }
}

// Personalize content for logged in users
function personalizeContent() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const welcomeElement = document.querySelector('.welcome-message');
    
    if (currentUser) {
        if (!welcomeElement) {
            const welcomeMsg = document.createElement('div');
            welcomeMsg.className = 'welcome-message';
            welcomeMsg.innerHTML = `Welcome back, <strong>${currentUser.name}</strong>!`;
            document.querySelector('.page-header')?.prepend(welcomeMsg);
            document.querySelector('.hero-content')?.prepend(welcomeMsg.cloneNode(true));
        }
    } else if (welcomeElement) {
        welcomeElement.remove();
    }
}

// ======================
//  NOTIFICATION SYSTEM
// ======================

function showNotification(message, type = 'success') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    let notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add notification styles dynamically
if (!document.querySelector('style.notification-styles')) {
    let style = document.createElement('style');
    style.className = 'notification-styles';
    style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--primary-color);
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 1000;
    }
    
    .notification.error {
        background: var(--danger-color);
    }
    
    .notification.success {
        background: var(--primary-color);
    }
    
    .notification.show {
        opacity: 1;
    }
    `;
    document.head.appendChild(style);
}

// ======================
//  MODAL SYSTEM
// ======================

// Initialize any modals (if needed)
function initModals() {
    // Close modals when clicking X
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    // Close when clicking outside modal
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

// Initialize modals on DOM load
document.addEventListener('DOMContentLoaded', initModals);

// ======================
//  HELPER FUNCTIONS
// ======================

// Format price (if needed)
function formatPrice(price) {
    return '$' + price.toFixed(2);
}

// Initialize dropdown close when clicking outside
document.addEventListener('click', function(e) {
    const authDropdown = document.querySelector('.auth-dropdown');
    if (authDropdown && !authDropdown.contains(e.target)) {
        document.querySelector('.dropdown-content').style.display = 'none';
    }
});
