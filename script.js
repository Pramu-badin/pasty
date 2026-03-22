// Menu Data
const menuItems = [
    {
        id: 1,
        name: "Strawberry Dream Cake",
        price: 35.00,
        rating: 5,
        image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop",
        category: "cake"
    },
    {
        id: 2,
        name: "Vanilla Bean Cupcake",
        price: 4.50,
        rating: 5,
        image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=400&h=300&fit=crop",
        category: "cupcake"
    },
    {
        id: 3,
        name: "Glazed Donut",
        price: 3.50,
        rating: 4,
        image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop",
        category: "donut"
    },
    {
        id: 4,
        name: "Butter Croissant",
        price: 5.00,
        rating: 5,
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop",
        category: "puff"
    },
    {
        id: 5,
        name: "Chocolate Lava Cake",
        price: 42.00,
        rating: 5,
        image: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=400&h=300&fit=crop",
        category: "cake"
    },
    {
        id: 6,
        name: "Red Velvet Cupcake",
        price: 5.00,
        rating: 5,
        image: "https://images.unsplash.com/photo-1614707267537-b85aaf00c31b?w=400&h=300&fit=crop",
        category: "cupcake"
    },
    {
        id: 7,
        name: "Sprinkle Donut",
        price: 4.00,
        rating: 4,
        image: "https://images.unsplash.com/photo-1527904324834-3bda86da6771?w=400&h=300&fit=crop",
        category: "donut"
    },
    {
        id: 8,
        name: "Almond Puff Pastry",
        price: 6.50,
        rating: 5,
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop",
        category: "puff"
    }
];

// Cart State - Load from localStorage or initialize empty
let cart = JSON.parse(localStorage.getItem('hotPastyBunnyCart')) || [];

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Hide loader after 1.5 seconds
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
    }, 1500);
    
    // Render menu items
    renderMenu();
    
    // Update cart UI
    updateCartUI();
    
    // Setup card input formatting
    setupCardFormatting();
    
    // Close modal when clicking outside
    document.getElementById('paymentModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('paymentModal')) {
            closePaymentModal();
        }
    });
});

// ==========================================
// MENU FUNCTIONS
// ==========================================

// Render menu items to the grid
function renderMenu() {
    const menuGrid = document.getElementById('menuGrid');
    menuGrid.innerHTML = menuItems.map(item => `
        <div class="pastry-card">
            <img src="${item.image}" alt="${item.name}" class="pastry-image">
            <div class="pastry-content">
                <div class="pastry-header">
                    <h3 class="pastry-name">${item.name}</h3>
                    <span class="pastry-price">$${item.price.toFixed(2)}</span>
                </div>
                <div class="rating">
                    ${'⭐'.repeat(item.rating)}${'☆'.repeat(5 - item.rating)}
                </div>
                <button class="add-to-cart" onclick="addToCart(${item.id})">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// ==========================================
// CART FUNCTIONS
// ==========================================

// Add item to cart
function addToCart(itemId) {
    const item = menuItems.find(i => i.id === itemId);
    const existingItem = cart.find(i => i.id === itemId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    
    saveCart();
    updateCartUI();
    showToast(`${item.name} added to cart! 🧁`);
}

// Remove item from cart
function removeFromCart(itemId) {
    const item = cart.find(i => i.id === itemId);
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    updateCartUI();
    showToast(`${item.name} removed from cart`);
}

// Update item quantity
function updateQuantity(itemId, change) {
    const item = cart.find(i => i.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(itemId);
        } else {
            saveCart();
            updateCartUI();
        }
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('hotPastyBunnyCart', JSON.stringify(cart));
}

// Update cart UI (sidebar and count)
function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartFooter = document.getElementById('cartFooter');
    const cartTotal = document.getElementById('cartTotal');
    
    // Calculate totals
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Update cart icon count
    cartCount.textContent = totalItems;
    
    // Show empty state or items
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-basket"></i>
                <p>Your cart is empty!</p>
                <p style="font-size: 0.9rem; margin-top: 0.5rem;">Add some sweet treats! 🧁</p>
            </div>
        `;
        cartFooter.style.display = 'none';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="quantity-controls">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span style="font-weight: 700; min-width: 30px; text-align: center;">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
        cartFooter.style.display = 'block';
        cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
    }
}

// Toggle cart sidebar
function toggleCart() {
    document.getElementById('cartSidebar').classList.toggle('open');
}

// ==========================================
// UI FUNCTIONS
// ==========================================

// Show toast notification
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ==========================================
// PAYMENT FUNCTIONS
// ==========================================

// Open payment modal
function openPaymentModal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('payAmount').textContent = `$${total.toFixed(2)}`;
    document.getElementById('paymentModal').classList.add('active');
    toggleCart(); // Close cart sidebar
}

// Close payment modal
function closePaymentModal() {
    document.getElementById('paymentModal').classList.remove('active');
    
    // Reset form
    document.getElementById('paymentForm').style.display = 'block';
    document.getElementById('successMessage').style.display = 'none';
    
    // Clear form inputs
    document.getElementById('cardName').value = '';
    document.getElementById('cardNumber').value = '';
    document.getElementById('expiryDate').value = '';
    document.getElementById('cvv').value = '';
    
    // Clear cart after successful payment
    if (document.getElementById('successMessage').style.display === 'block') {
        cart = [];
        saveCart();
        updateCartUI();
    }
}

// Select payment method
function selectPaymentMethod(element, method) {
    // Remove active class from all methods
    document.querySelectorAll('.payment-method').forEach(el => el.classList.remove('active'));
    element.classList.add('active');
    
    // Show/hide card fields based on method
    const cardFields = document.querySelectorAll('.payment-form .form-group, .card-row');
    if (method === 'cod') {
        cardFields.forEach(field => field.style.display = 'none');
    } else if (method === 'mobile') {
        // Show only name field for mobile
        cardFields.forEach((field, index) => {
            if (index === 0) field.style.display = 'block'; // Name field
            else field.style.display = 'none';
        });
    } else {
        cardFields.forEach(field => field.style.display = 'block');
    }
}

// Process payment
function processPayment(event) {
    event.preventDefault();
    
    // Get button and show loading state
    const payBtn = document.querySelector('.pay-btn');
    const originalText = payBtn.innerHTML;
    payBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    payBtn.disabled = true;
    
    // Simulate processing delay
    setTimeout(() => {
        // Hide form, show success
        document.getElementById('paymentForm').style.display = 'none';
        document.getElementById('successMessage').style.display = 'block';
        
        // Reset button
        payBtn.innerHTML = originalText;
        payBtn.disabled = false;
        
        // Play success sound (optional - browser may block)
        // const audio = new Audio('success.mp3');
        // audio.play().catch(e => console.log('Audio play failed:', e));
    }, 2000);
}

// Setup credit card input formatting
function setupCardFormatting() {
    const cardNumber = document.getElementById('cardNumber');
    const expiryDate = document.getElementById('expiryDate');
    const cvv = document.getElementById('cvv');
    
    // Format card number with spaces every 4 digits
    cardNumber.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        e.target.value = formattedValue;
    });
    
    // Format expiry date as MM/YY
    expiryDate.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
    });
    
    // Only allow numbers for CVV
    cvv.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
    });
}

// ==========================================
// CONTACT FORM
// ==========================================

// Handle contact form submission
function handleContactSubmit(event) {
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(event.target);
    
    // Show success message
    showToast('Message sent successfully! We\'ll get back to you soon! 💌');
    
    // Reset form
    event.target.reset();
}

// ==========================================
// THEME TOGGLE
// ==========================================

// Toggle dark/light mode
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const icon = document.getElementById('themeIcon');
    
    if (document.body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        localStorage.setItem('hotPastyBunnyTheme', 'dark');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        localStorage.setItem('hotPastyBunnyTheme', 'light');
    }
}

// Load saved theme preference
function loadTheme() {
    const savedTheme = localStorage.getItem('hotPastyBunnyTheme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        const icon = document.getElementById('themeIcon');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
}

// ==========================================
// MOBILE MENU
// ==========================================

// Toggle mobile menu
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    
    if (navLinks.style.display === 'flex') {
        navLinks.style.display = 'none';
    } else {
        navLinks.style.display = 'flex';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.background = 'white';
        navLinks.style.flexDirection = 'column';
        navLinks.style.padding = '1rem';
        navLinks.style.boxShadow = '0 10px 20px var(--shadow)';
        navLinks.style.zIndex = '999';
    }
}

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            document.querySelector('.nav-links').style.display = 'none';
        }
    });
});

// ==========================================
// ADDITIONAL FEATURES
// ==========================================

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll effect to navbar
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 30px rgba(93, 64, 55, 0.2)';
    } else {
        navbar.style.boxShadow = '0 2px 20px var(--shadow)';
    }
});

// Initialize theme on load
loadTheme();