const WHATSAPP_PHONE_NUMBER = "972546566428"; 

// --- State Management ---
let cart = [];

const products = [
    {
        id: 1,
        name: "עוגיות חמאה",
        desc: "עוגיות חמאה בצורות בעיצוב אישי, טעימות במיוחד ובעלות מרקם עשיר, מומלץ לטבול בחלב, קפה או תה.",
        options: [
            { label: '20 יחידות', value: 20, price: 15 },
            { label: '50 יחידות', value: 50, price: 25 },
        ],
        image: "https://i.ibb.co/MydLs0SH/butter-cookies.jpg", alt: "עוגיות חמאה"
    },
    {
        id: 2,
        name: "עוגיות שוקולד צ'יפס",
        desc: "עוגיות שוקולד צ'יפס קלאסיות, רכות וטעימות במיוחד, עם שוקולד איכותי שממלא את כל העוגיה.",
        options: [
            { label: '4 יחידות', value: 4, price: 15 },
            { label: '6 יחידות', value: 6, price: 20 },
            { label: '8 יחידות', value: 8, price: 25 },
        ],
        image: "https://i.ibb.co/8DkLr0gV/chocolate-chips.jpg", alt: "עוגיות שוקולד צ'יפס"
    },
    {
        id: 3,
        name: "עוגיות ירח שקדים",
        desc: "עוגיות ירח עם מילוי שקדים, פריכות וטעימות במיוחד, מעוצבות בצורת ירח.",
        options: [
            { label: "20 יחידות", value: 20, price: 20 },
            { label: "50 יחידות", value: 50, price: 45 }
        ],
        image: "", alt: "עוגיות ירח שקדים"
    },
    {
        id: 4,
        name: "עוגיות מגולגלות קינדר",
        desc: "עוגיות מגולגלות במילוי קינדר, רכות, עשירות ובעלות טעם אגדי שמושך כל אוהב קינדר.",
        options: [
            { label: "12 יחידות", value: 12, price: 60 },
            { label: "20 יחידות", value: 20, price: 70 }
        ],
        image: "", alt: "עוגיות מגולגלות קינדר"
    },
    {
        id: 5,
        name: "עוגת גבינת לוטוס",
        desc: "עוגת גבינת לוטוס עשירה ומפנקת עם טעם לוטוס עדין ומתקתק שמושך את כל האוהבים.",
        options: [
            { label: "עוגה אחת", value: 1, price: 110 },
        ],
        image: "", alt: "עוגת גבינת לוטוס"
    },
    {
        id: 6,
        name: "קרפ",
        desc: "קרפ טעימות מיוחדות עם טעם לוטוס עדין ומתקתק שמושך את כל האוהבים.",
        options: [
            { label: "יחידה אחת", value: 1, price: 5 }
        ],
        image: "", alt: "קרפ"
    },
    {
        id: 7,
        name: "קראמבל קוקיז",
        desc: "קראמבל קוקיז פריך וטעים במיוחד, עם שוקולד איכותי שממלא את כל העוגיה.",
        options: [
            { label: "", value: null, price: null }
        ],
        image: "https://i.ibb.co/8DjrG6r1/crumble-cookies.jpg", alt: "קראמבל קוקיז"
    }
    
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
const authBtn = document.getElementById('auth-btn');
const authBtnLabel = document.getElementById('auth-btn-label');
const authModal = document.getElementById('auth-modal');
const authOverlay = document.getElementById('auth-overlay');
const closeAuthBtn = document.getElementById('close-auth-btn');
const authLoginBtn = document.getElementById('auth-login-btn');
const authLoginIdentifier = document.getElementById('auth-login-identifier');
const authLoginPassword = document.getElementById('auth-login-password');
const authSendCodeBtn = document.getElementById('auth-send-code-btn');
const authRegisterBtn = document.getElementById('auth-register-btn');
const authRegisterName = document.getElementById('auth-register-name');
const authRegisterIdentifier = document.getElementById('auth-register-identifier');
const authRegisterPassword = document.getElementById('auth-register-password');
const authRegisterCode = document.getElementById('auth-register-code');
const authModeButtons = document.querySelectorAll('.auth-mode-btn');
const authPanels = document.querySelectorAll('.auth-panel');
const userStorageKey = 'arialLoggedInUser';
const usersStorageKey = 'arialUsers';
const pendingVerificationStorageKey = 'arialPendingVerification';

function normalizeIdentifier(value) {
    return String(value || '').trim().toLowerCase();
}

function parseUsers() {
    try {
        const raw = localStorage.getItem(usersStorageKey);
        return raw ? JSON.parse(raw) : [];
    } catch (error) {
        console.warn('Could not parse saved users', error);
        return [];
    }
}

function saveUsers(users) {
    localStorage.setItem(usersStorageKey, JSON.stringify(users));
}

function getLoggedInUser() {
    try {
        const raw = localStorage.getItem(userStorageKey);
        return raw ? JSON.parse(raw) : null;
    } catch (error) {
        console.warn('Could not parse logged in user', error);
        return null;
    }
}

function setLoggedInUser(profile) {
    if (!profile) return;
    localStorage.setItem(userStorageKey, JSON.stringify(profile));
    if (customerNameInput && profile.name) customerNameInput.value = profile.name;
    updateAuthButtonLabel(profile);
}

function clearLoggedInUser() {
    localStorage.removeItem(userStorageKey);
    updateAuthButtonLabel(null);
    if (customerNameInput) customerNameInput.value = '';
}

function updateAuthButtonLabel(profile = getLoggedInUser()) {
    if (!authBtnLabel) return;

    if (profile && (profile.name || profile.phone || profile.email)) {
        const displayName = profile.name || profile.phone || profile.email;
        authBtnLabel.textContent = `שלום, ${displayName}`;
        return;
    }

    authBtnLabel.textContent = 'התחברות';
}

function openAuthModal() {
    if (!authModal) return;
    authModal.classList.remove('hidden');
}

function closeAuthModal() {
    if (!authModal) return;
    authModal.classList.add('hidden');
}

function setAuthMode(mode) {
    authModeButtons.forEach((button) => {
        const isActive = button.dataset.authMode === mode;
        button.classList.toggle('bg-white', isActive);
        button.classList.toggle('shadow-sm', isActive);
        button.classList.toggle('text-bakery-dark', isActive);
        button.classList.toggle('text-gray-500', !isActive);
    });

    authPanels.forEach((panel) => {
        const show = panel.id === (mode === 'login' ? 'auth-login-panel' : 'auth-register-panel');
        panel.classList.toggle('hidden', !show);
    });
}

function generateCode() {
    return String(Math.floor(1000 + Math.random() * 9000));
}

function buildUserFromIdentifier(identifier, name, password) {
    const cleaned = String(identifier || '').trim();
    const looksLikePhone = /^[0-9+\-\s]+$/.test(cleaned);

    return {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
        name: String(name || '').trim(),
        email: looksLikePhone ? '' : cleaned.toLowerCase(),
        phone: looksLikePhone ? cleaned : '',
        password: String(password || '').trim()
    };
}

function findUserByIdentifier(identifier) {
    const normalized = normalizeIdentifier(identifier);
    const users = parseUsers();

    return users.find((user) => {
        const phoneMatch = normalizeIdentifier(user.phone) === normalized;
        const emailMatch = normalizeIdentifier(user.email) === normalized;
        return phoneMatch || emailMatch;
    }) || null;
}

function handleLogin() {
    const identifier = authLoginIdentifier ? authLoginIdentifier.value.trim() : '';
    const password = authLoginPassword ? authLoginPassword.value.trim() : '';

    if (!identifier || !password) {
        alert('יש להזין אימייל/מספר טלפון וסיסמה');
        return;
    }

    const user = findUserByIdentifier(identifier);
    if (!user) {
        alert('לא נמצא משתמש עם פרטים אלו');
        return;
    }

    if (user.password !== password) {
        alert('הסיסמה שגויה');
        return;
    }

    setLoggedInUser(user);
    closeAuthModal();
}

function handleSendCode() {
    const name = authRegisterName ? authRegisterName.value.trim() : '';
    const identifier = authRegisterIdentifier ? authRegisterIdentifier.value.trim() : '';
    const password = authRegisterPassword ? authRegisterPassword.value.trim() : '';

    if (!name || !identifier || !password) {
        alert('יש למלא שם, אימייל/מספר טלפון וסיסמה');
        return;
    }

    const existingUser = findUserByIdentifier(identifier);
    if (existingUser) {
        alert('משתמש כבר קיים, אנא בחר התחברות במקום');
        setAuthMode('login');
        return;
    }

    const code = generateCode();
    const pending = {
        name,
        identifier,
        password,
        code,
        createdAt: Date.now()
    };

    localStorage.setItem(pendingVerificationStorageKey, JSON.stringify(pending));
    alert(`קוד אימות נשלח: ${code}`);
}

function handleRegister() {
    const codeInput = authRegisterCode ? authRegisterCode.value.trim() : '';
    const rawPending = localStorage.getItem(pendingVerificationStorageKey);
    if (!rawPending) {
        alert('יש לשלוח קוד אימות לפני יצירת משתמש');
        return;
    }

    try {
        const pending = JSON.parse(rawPending);
        if (String(pending.code) !== String(codeInput)) {
            alert('הקוד שהוזן שגוי');
            return;
        }

        const newUser = buildUserFromIdentifier(pending.identifier, pending.name, pending.password);
        const users = parseUsers();
        users.push(newUser);
        saveUsers(users);
        localStorage.removeItem(pendingVerificationStorageKey);
        setLoggedInUser(newUser);
        closeAuthModal();
        alert('המשתמש נוצר בהצלחה');
    } catch (error) {
        console.warn('Could not register user', error);
        alert('אירעה שגיאה ביצירת המשתמש');
    }
}

// Payment Toggle Selectors
const bitLabel = document.getElementById('option-bit-label');
const cashLabel = document.getElementById('option-cash-label');
const paymentRadios = document.querySelectorAll('input[name="payment-method"]');

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    if (checkoutWindow) checkoutWindow.classList.add('hidden');
    if (cartOverlay) cartOverlay.classList.add('hidden');

    const savedUser = getLoggedInUser();
    updateAuthButtonLabel(savedUser);

    if (authBtn) authBtn.addEventListener('click', openAuthModal);
    if (authOverlay) authOverlay.addEventListener('click', closeAuthModal);
    if (closeAuthBtn) closeAuthBtn.addEventListener('click', closeAuthModal);
    if (authLoginBtn) authLoginBtn.addEventListener('click', handleLogin);
    if (authSendCodeBtn) authSendCodeBtn.addEventListener('click', handleSendCode);
    if (authRegisterBtn) authRegisterBtn.addEventListener('click', handleRegister);
    if (authModeButtons) {
        authModeButtons.forEach((button) => {
            button.addEventListener('click', () => setAuthMode(button.dataset.authMode));
        });
    }
    setAuthMode('login');
    
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
        const hasFixedPriceOnly = typeof product.price === 'number' && !Array.isArray(product.options);
        const opts = Array.isArray(product.options) && product.options.length ? product.options : [{ label: product.label || product.count || 'יחידה', value: product.value || 1, price: product.price || 0 }];
        const initial = opts[0];

        // Build options markup for native select
        const optionsMarkup = opts.map(o => `<option data-price="${o.price}" value="${o.value}">${o.label}</option>`).join('');

        const quantityControlMarkup = hasFixedPriceOnly
            ? `<span class="inline-flex min-w-[117px] items-center justify-end rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600">${initial.label}</span>`
            : `<select class="count-select" data-product-id="${product.id}" onchange="onCountChange(${product.id}, this)">${optionsMarkup}</select>`;

        card.innerHTML = `
            <div class="h-64 overflow-hidden bg-gray-100">
                <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover img-hover-zoom">
            </div>
            <div class="p-6 grid grid-rows-[auto_1fr_auto_auto] text-right">
                <h3 class="text-xl font-bold text-bakery-dark mb-2">${product.name}</h3>
                <p class="text-sm text-gray-500 mb-4 leading-relaxed">${product.desc}</p>

                <div class="grid grid-cols-[1fr_auto] items-center mb-4 gap-3">
                    ${quantityControlMarkup}
                    <span id="price-${product.id}" class="font-bold text-xl text-bakery-accent">${Math.round(initial.price)}₪</span>
                </div>

                <button onclick="addToCart(${product.id})" class="w-full text-sm font-bold border border-bakery-accent text-bakery-accent hover:bg-bakery-accent hover:text-white py-2.5 rounded-lg transition-colors duration-300">
                    הוסף לסל
                </button>
            </div>
        `;

        productGrid.appendChild(card);

        // Ensure the select shows the desired default
        const selectEl = card.querySelector('select.count-select');
        if (selectEl) selectEl.selectedIndex = 0;
    });
}

// Called when user changes the pack size — update the visible price
window.onCountChange = (productId, selectEl) => {
    const selected = selectEl.options[selectEl.selectedIndex];
    const price = parseFloat(selected.dataset.price || '0');
    const priceEl = document.getElementById(`price-${productId}`);
    if (priceEl) priceEl.textContent = `${Math.round(price)}₪`;
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