// PLACEHOLDER: Insert your business WhatsApp phone number here in international format (e.g., '972501234567')
const WHATSAPP_PHONE_NUMBER = "972546566428"; 

// --- State Management ---
let cart = [];

const products = [
    {
        id: 1,
        name: "עוגיות חמאה",
        desc: "עוגיות חמאה בצורות בעיצוב אישי, טעימות במיוחד ובעלות מרקם עשיר, מומלץ לטבול בחלב, קפה או תה.",
        // options: array of pack sizes (label shown in dropdown) and their prices
        options: [
            { label: '20 יחידות', value: 20, price: 15.00 },
            { label: '50 יחידות', value: 50, price: 25.00 },
        ],
        // fallback image
        image: "https://i.ibb.co/MydLs0SH/butter-cookies.jpg"
    },
    {
        id: 2,
        name: "עוגיות שוקולד צ'יפס",
        desc: "עוגיות שוקולד צ'יפס קלאסיות, רכות וטעימות במיוחד, עם שוקולד איכותי שממלא את כל העוגיה.",
        options: [
            { label: '4 יחידות', value: 4, price: 15.00 },
            { label: '6 יחידות', value: 6, price: 20.00 },
            { label: '8 יחידות', value: 8, price: 25.00 },
        ],
        image: "https://i.ibb.co/MydLs0SH/butter-cookies.jpg"
    },
];

// --- DOM Elements ---
const productGrid = document.getElementById('product-grid');
const cartBtn = document.getElementById('cart-btn');
const closeCartBtn = document.getElementById('close-cart');
const cartOverlay = document.getElementById('cart-overlay');
const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const cartCountEl = document.getElementById('cart-count');

// Checkout Elements
const checkoutBtn = document.getElementById('checkout-btn');
const checkoutWindow = document.getElementById('checkout-window');
const checkoutOverlay = document.getElementById('checkout-overlay');
const checkoutCard = document.getElementById('checkout-card');
const backToCartBtn = document.getElementById('back-to-cart');
const checkoutItemsContainer = document.getElementById('checkout-items');
const checkoutSubtotalEl = document.getElementById('checkout-subtotal');
const checkoutTotalEl = document.getElementById('checkout-total');
const sendWhatsappBtn = document.getElementById('send-whatsapp-btn');
const customerNameInput = document.getElementById('customer-name');

// Payment Toggle Selectors
const bitLabel = document.getElementById('option-bit-label');
const cashLabel = document.getElementById('option-cash-label');
const paymentRadios = document.querySelectorAll('input[name="payment-method"]');

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    if (checkoutWindow) checkoutWindow.classList.add('hidden');
    if (cartOverlay) cartOverlay.classList.add('hidden');
    
    renderProducts();
    updateCheckoutButtonState();
    setupPaymentToggles();
    setupWhatsAppOrderHandler();
});

// --- Render Products ---
function renderProducts() {
    if (!productGrid) return;
    productGrid.innerHTML = '';

    products.forEach((product, index) => {
        const delay = index * 100;
        const card = document.createElement('div');
        card.className = `product-card bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden fade-in grid grid-rows-[auto_1fr] border border-gray-100`;
        card.style.animationDelay = `${delay}ms`;

        // Determine initial price and options
        const opts = Array.isArray(product.options) && product.options.length ? product.options : [{ label: product.count || 'יחידה', value: 1, price: product.price || 0 }];
        const initial = opts[0]; // default selection (user requested default 4 for applicable products — ensure options are ordered accordingly)

        // Build options markup (only show count text in option)
        const optionsMarkup = opts.map(o => `<option data-price="${o.price}" value="${o.value}">${o.label}</option>`).join('');

        card.innerHTML = `
            <div class="h-64 overflow-hidden bg-gray-100">
                <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover img-hover-zoom">
            </div>
            <div class="p-6 grid grid-rows-[auto_1fr_auto_auto] text-right">
                <h3 class="text-xl font-bold text-bakery-dark mb-2">${product.name}</h3>
                <p class="text-sm text-gray-500 mb-4 leading-relaxed">${product.desc}</p>

                <div class="grid grid-cols-[1fr_auto] items-center mb-4 gap-3">
                    <div class="select-wrapper ml-auto">
                        <select class="count-select" data-product-id="${product.id}" onchange="onCountChange(${product.id}, this)">
                            ${optionsMarkup}
                        </select>
                    </div>
                    <span id="price-${product.id}" class="font-bold text-xl text-bakery-accent">₪${initial.price.toFixed(2)}</span>
                </div>

                <button onclick="addToCart(${product.id})" class="w-full text-sm font-bold border border-bakery-accent text-bakery-accent hover:bg-bakery-accent hover:text-white py-2.5 rounded-lg transition-colors duration-300">
                    הוסף לסל
                </button>
            </div>
        `;

        productGrid.appendChild(card);

        // Ensure the select shows the desired default (e.g., 4 for products that include it as first option)
        const selectEl = card.querySelector('select.count-select');
        if (selectEl) selectEl.selectedIndex = 0;
    });
}

// Called when user changes the pack size — update the visible price
window.onCountChange = (productId, selectEl) => {
    const selected = selectEl.options[selectEl.selectedIndex];
    const price = parseFloat(selected.dataset.price || '0');
    const priceEl = document.getElementById(`price-${productId}`);
    if (priceEl) priceEl.textContent = `₪${price.toFixed(2)}`;
};

// --- Cart Operations ---
function renderCart() {
    if (!cartItemsContainer) return;
    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-gray-500 text-center italic mt-10">הסל שלך ריק כרגע.</p>';
        if (cartCountEl) cartCountEl.classList.add('opacity-0');
    } else {
        if (cartCountEl) {
            cartCountEl.textContent = cart.length;
            cartCountEl.classList.remove('opacity-0');
        }
        
        cart.forEach((item, index) => {
            total += item.price;
            const cartItem = document.createElement('div');
            cartItem.className = 'grid grid-cols-[auto_1fr_auto] gap-4 items-center border-b pb-4';
            cartItem.innerHTML = `
                <img src="${item.image}" class="w-16 h-16 object-cover rounded-lg shadow-sm">
                <div class="text-right">
                    <h4 class="font-bold text-sm text-bakery-dark">${item.name}</h4>
                            ${item.countLabel ? `<div class="text-xs text-gray-500">${item.countLabel}</div>` : ''}
                            <span class="text-bakery-accent font-bold text-sm">₪${item.price.toFixed(2)}</span>
                        </div>
                        <button onclick="removeFromCart(${index})" class="text-gray-400 hover:text-red-500 transition-colors p-2">
                            <i class="fa-solid fa-trash text-sm"></i>
                        </button>
                    `;
                    cartItemsContainer.appendChild(cartItem);
                });
    }
    
    if (cartTotalEl) cartTotalEl.textContent = `₪${total.toFixed(2)}`;
    updateCheckoutButtonState();
}

function updateCheckoutButtonState() {
    if (checkoutBtn) {
        checkoutBtn.disabled = cart.length === 0;
    }
}

window.addToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Find the select for this product to determine selected pack & price
    const selectEl = document.querySelector(`select.count-select[data-product-id="${productId}"]`);
    let selectedLabel = '';
    let selectedPrice = 0;

    if (selectEl) {
        const sel = selectEl.options[selectEl.selectedIndex];
        selectedLabel = sel ? sel.textContent : '';
        selectedPrice = sel && sel.dataset && sel.dataset.price ? parseFloat(sel.dataset.price) : 0;
    } else if (product.options && product.options.length) {
        selectedLabel = product.options[0].label;
        selectedPrice = product.options[0].price;
    } else {
        selectedLabel = product.count || '';
        selectedPrice = product.price || 0;
    }

    const item = {
        id: product.id,
        name: product.name,
        image: product.image,
        price: Number(selectedPrice),
        countLabel: selectedLabel
    };

    cart.push(item);
    renderCart();
    if (cartBtn) {
        cartBtn.classList.add('scale-110');
        setTimeout(() => cartBtn.classList.remove('scale-110'), 200);
    }
};

window.removeFromCart = (index) => {
    cart.splice(index, 1);
    renderCart();
};

// --- Drawer Navigation ---
const toggleCartModal = () => {
    if (!cartModal || !cartOverlay) return;
    const isClosed = cartModal.classList.contains('-translate-x-full');
    if (isClosed) {
        cartOverlay.classList.remove('hidden');
        setTimeout(() => cartOverlay.classList.remove('opacity-0'), 10);
        cartModal.classList.remove('-translate-x-full');
        document.body.style.overflow = 'hidden'; 
    } else {
        cartOverlay.classList.add('opacity-0');
        cartModal.classList.add('-translate-x-full');
        document.body.style.overflow = 'auto';
        setTimeout(() => cartOverlay.classList.add('hidden'), 300);
    }
};

if (cartBtn) cartBtn.addEventListener('click', toggleCartModal);
if (closeCartBtn) closeCartBtn.addEventListener('click', toggleCartModal);
if (cartOverlay) cartOverlay.addEventListener('click', toggleCartModal);

// --- Checkout Window Logic ---
const openCheckout = () => {
    toggleCartModal();
    if (checkoutWindow) checkoutWindow.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    if (!checkoutItemsContainer) return;
    checkoutItemsContainer.innerHTML = '';
    let total = 0;
    
    cart.forEach((item) => {
        total += item.price;
        const div = document.createElement('div');
        div.className = 'grid grid-cols-[1fr_auto] items-center bg-white p-3 rounded-lg shadow-sm border border-gray-100';
        div.innerHTML = `
            <div class="grid grid-cols-[auto_1fr] items-center gap-3">
                <img src="${item.image}" class="w-12 h-12 object-cover rounded-md">
                    <div>
                        <span class="text-sm font-bold text-bakery-dark">${item.name}</span>
                        ${item.countLabel ? `<div class="text-xs text-gray-500">${item.countLabel}</div>` : ''}
                    </div>
                </div>
                <span class="text-sm font-bold text-bakery-accent">₪${item.price.toFixed(2)}</span>
            `;
            checkoutItemsContainer.appendChild(div);
        });

    if (checkoutSubtotalEl) checkoutSubtotalEl.textContent = `₪${total.toFixed(2)}`;
    if (checkoutTotalEl) checkoutTotalEl.textContent = `₪${total.toFixed(2)}`;
};

const closeCheckout = () => {
    if (checkoutWindow) checkoutWindow.classList.add('hidden');
    document.body.style.overflow = 'auto';
};

if (checkoutCard) {
    checkoutCard.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

if (checkoutBtn) checkoutBtn.addEventListener('click', openCheckout);
if (backToCartBtn) backToCartBtn.addEventListener('click', () => {
    closeCheckout();
    toggleCartModal();
});
if (checkoutOverlay) checkoutOverlay.addEventListener('click', closeCheckout);

// --- Toggle Radio Styling ---
function setupPaymentToggles() {
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'bit') {
                bitLabel.classList.add('border-bakery-accent', 'bg-amber-50/30');
                bitLabel.classList.remove('border-gray-200');
                cashLabel.classList.remove('border-bakery-accent', 'bg-amber-50/30');
                cashLabel.classList.add('border-gray-200');
            } else {
                cashLabel.classList.add('border-bakery-accent', 'bg-amber-50/30');
                cashLabel.classList.remove('border-gray-200');
                bitLabel.classList.remove('border-bakery-accent', 'bg-amber-50/30');
                bitLabel.classList.add('border-gray-200');
            }
        });
    });
}

// --- WhatsApp Auto Message Generation ---
function setupWhatsAppOrderHandler() {
    if (!sendWhatsappBtn) return;

    sendWhatsappBtn.addEventListener('click', () => {
        if (cart.length === 0) return;

        const customerName = customerNameInput ? customerNameInput.value.trim() : "";
        const selectedPaymentRadio = document.querySelector('input[name="payment-method"]:checked');
        const paymentMethod = selectedPaymentRadio && selectedPaymentRadio.value === 'bit' ? 'bit' : 'מזומן (איסוף עצמי)';

        let totalPrice = 0;
        let itemsListText = "";

        cart.forEach((item, index) => {
            totalPrice += item.price;
                    const label = item.countLabel ? ` (${item.countLabel})` : '';
                    itemsListText += `${index + 1}. ${item.name}${label} - ₪${item.price.toFixed(2)}\n`;
                });

        // PLACEHOLDER: Text message template sent to business WhatsApp
        let message = `שלום AriAl Bakery!\n`;
        message += `אשמח לבצע הזמנה חדשה לאיסוף עצמי:\n\n`;
        if (customerName) {
            message += `*שם הלקוח:* ${customerName}\n`;
        }
        message += `*פריטים בהזמנה:*\n${itemsListText}\n`;
        message += `*סה"כ לתשלום:* ₪${totalPrice.toFixed(2)}\n`;
        message += `*סוג איסוף:* איסוף עצמי\n`;
        message += `*אופן תשלום מועדף:* ${paymentMethod}\n\n`;
        message += `נשמח לאישור מהיר! תודה.`;

        // Encode full Hebrew string for URL
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodedMessage}`;

        // Open WhatsApp in a new tab
        window.open(whatsappUrl, '_blank');

        // Reset cart state after sending
        cart = [];
        renderCart();
        closeCheckout();
    });
}