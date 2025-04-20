  // Main JavaScript file for common functionality

// Toggle mobile menu
document.addEventListener('DOMContentLoaded', function() {
    // Update cart count on all pages
    updateCartCount();
    
    // Initialize any common functionality
});

// Update cart count in header
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('#cart-count').forEach(el => {
        el.textContent = totalItems;
    });
}

// Add to cart function (used in products.js)
function addToCart(productId, quantity = 1) {
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

// Show notification
function showNotification(message) {
    let notification = document.createElement('div');
    notification.className = 'notification';
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
let style = document.createElement('style');
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

.notification.show {
    opacity: 1;
}
`;
document.head.appendChild(style);
// User Signup and Verification
document.addEventListener('DOMContentLoaded', function() {
    // Initialize modals
    const signupModal = document.getElementById('signup-modal');
    const verificationModal = document.getElementById('verification-modal');
    const closeButtons = document.querySelectorAll('.close-modal');
    
    // Open signup modal when clicking signup links
    document.querySelectorAll('[data-open-signup]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            signupModal.style.display = 'block';
        });
    });
    
    // Close modals
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            signupModal.style.display = 'none';
            verificationModal.style.display = 'none';
        });
    });
    
    // Close when clicking outside modal
    window.addEventListener('click', function(e) {
        if (e.target === signupModal) {
            signupModal.style.display = 'none';
        }
        if (e.target === verificationModal) {
            verificationModal.style.display = 'none';
        }
    });
    
    // Signup form submission
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const user = {
                name: document.getElementById('signup-name').value,
                email: document.getElementById('signup-email').value,
                phone: document.getElementById('signup-phone').value,
                password: document.getElementById('signup-password').value,
                verified: false,
                verificationCode: generateVerificationCode()
            };
            
            // Store user data temporarily
            sessionStorage.setItem('tempUser', JSON.stringify(user));
            
            // In a real app, you would send the verification code via email/SMS
            console.log(`Verification code sent: ${user.verificationCode}`);
            
            // Show verification modal
            signupModal.style.display = 'none';
            verificationModal.style.display = 'block';
        });
    }
    
    // Verification form submission
    const verificationForm = document.getElementById('verification-form');
    if (verificationForm) {
        verificationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const tempUser = JSON.parse(sessionStorage.getItem('tempUser'));
            const enteredCode = document.getElementById('verification-code').value;
            
            if (enteredCode === tempUser.verificationCode) {
                // Verification successful
                tempUser.verified = true;
                delete tempUser.verificationCode;
                
                // Save user to localStorage (in production, this would be a backend call)
                saveUser(tempUser);
                
                // Close modal and show success message
                verificationModal.style.display = 'none';
                showNotification('Account created successfully! You are now logged in.');
                
                // Update UI to show logged in state
                updateUserUI(tempUser.name);
            } else {
                // Verification failed
                showNotification('Invalid verification code. Please try again.', 'error');
            }
        });
    }
});

// Generate a 6-digit verification code
function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Save user to localStorage
function saveUser(user) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(user));
}

// Update UI when user is logged in
function updateUserUI(username) {
    document.querySelectorAll('.user-actions a').forEach(link => {
        if (link.textContent.includes('Login')) {
            link.innerHTML = `<i class="fas fa-user"></i> ${username}`;
        }
    });
}

// Check if user is logged in on page load
function checkLoggedIn() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        updateUserUI(currentUser.name);
    }
}

// Update notification function to handle error messages
function showNotification(message, type = 'success') {
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

// Update notification styles
let style = document.createElement('style');
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

.notification.show {
    opacity: 1;
}
`;
document.head.appendChild(style);

// Initialize check for logged in user
checkLoggedIn();
