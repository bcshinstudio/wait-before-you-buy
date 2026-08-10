// ============================================================
// WAIT BEFORE YOU BUY — APPLICATION LOGIC
// ============================================================
// Handles:
// - Store rendering and category filtering
// - Cart and local browser storage
// - Cooling-off period recommendations
// - Waiting-period selection
// - Purchase decisions
// - Decision history and statistics
// - Navigation between application sections
//
// Product data is defined separately in products.js.
// Page styling is defined separately in style.css.
// ============================================================


// ============================================================
// APPLICATION STATE
// ============================================================
// Cart and decision history are stored in localStorage so they
// remain available when the user closes or refreshes the page.
//
// Keep these storage names unchanged unless we intentionally
// create a data migration. Existing users may already have data
// stored under these keys.
// ============================================================

let cart =
    JSON.parse(localStorage.getItem("waitCart")) || [];

let history =
    JSON.parse(localStorage.getItem("waitHistory")) || [];

let pendingProduct = null;
let selectedWaitDays = null;


// ============================================================
// FORMATTING UTILITIES
// ============================================================

function money(value) {
    return value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD"
    });
}


function formatDate(date) {
    return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
    });
}


// ============================================================
// COOLING-OFF PERIOD
// ============================================================
// Suggests a waiting period based on price.
//
// This is only a recommendation. The user can select a different
// waiting period before adding the product to the cart.
// ============================================================

function recommendedWait(price) {
    if (price < 25) return 1;
    if (price < 100) return 3;
    if (price < 500) return 7;
    if (price < 1000) return 14;

    return 30;
}


function daysWaiting(date) {
    const start = new Date(date);
    const now = new Date();

    return Math.floor(
        (now - start) /
        (1000 * 60 * 60 * 24)
    );
}


function decisionDate(item) {
    const date = new Date(item.added);

    date.setDate(
        date.getDate() + item.waitDays
    );

    return date;
}


// ============================================================
// PRODUCT DISPLAY
// ============================================================

function renderProducts(category = "All") {
    const container =
        document.getElementById("products");

    container.innerHTML = "";

    const filtered =
        category === "All"
            ? products
            : products.filter(
                product => product.category === category
            );

    filtered.forEach(product => {
        const card =
            document.createElement("div");

        card.className = "product";

        card.innerHTML = `
            <div class="product-image">
                ${
                    product.image
                        ? `<img src="${product.image}" alt="${product.name}">`
                        : product.icon
                }
            </div>

            <div class="product-info">

                <div class="category">
                    ${product.category}
                </div>

                <h3>${product.name}</h3>

                <div class="price">
                    ${money(product.price)}
                </div>

                <button
                    class="add-button"
                    onclick="openWaitModal(${product.id})">
                    Add to Cart
                </button>

            </div>
        `;

        container.appendChild(card);
    });
}


function filterProducts(category) {
    renderProducts(category);
}


// ============================================================
// WAITING-PERIOD SELECTION
// ============================================================
// When a user chooses a product, the app recommends a waiting
// period but allows the user to override that recommendation.
// ============================================================

function openWaitModal(id) {
    const product =
        products.find(product => product.id === id);

    if (!product) return;

    if (cart.some(item => item.id === id)) {
        alert("This item is already in your cart.");
        return;
    }

    pendingProduct = product;

    const recommended =
        recommendedWait(product.price);

    selectedWaitDays = recommended;

    document.getElementById("modalProductName").textContent =
        product.name;

    document.getElementById("modalProductPrice").textContent =
        money(product.price);

    document.getElementById("recommendedDays").textContent =
        recommended + " days";

    document.getElementById("customDays").value = "";

    document
        .querySelectorAll(".wait-option")
        .forEach(button => {
            button.classList.toggle(
                "selected",
                Number(button.dataset.days) === recommended
            );
        });

    document
        .getElementById("waitModal")
        .classList.add("active");
}


function closeWaitModal() {
    document
        .getElementById("waitModal")
        .classList.remove("active");

    pendingProduct = null;
    selectedWaitDays = null;
}


function selectWait(days) {
    selectedWaitDays = days;

    document.getElementById("customDays").value = "";

    document
        .querySelectorAll(".wait-option")
        .forEach(button => {
            button.classList.toggle(
                "selected",
                Number(button.dataset.days) === days
            );
        });
}


function selectCustomWait() {
    const value =
        Number(document.getElementById("customDays").value);

    document
        .querySelectorAll(".wait-option")
        .forEach(button =>
            button.classList.remove("selected")
        );

    selectedWaitDays =
        value >= 1 ? value : null;
}


function confirmAddToCart() {
    if (!pendingProduct) return;

    if (!selectedWaitDays || selectedWaitDays < 1) {
        alert("Please choose a waiting period.");
        return;
    }

    cart.push({
        ...pendingProduct,
        added: new Date().toISOString(),
        waitDays: selectedWaitDays
    });

    save();
    renderCart();
    closeWaitModal();
}


// ============================================================
// CART
// ============================================================

function renderCart() {
    const container =
        document.getElementById("cartList");

    document.getElementById("cartCount").textContent =
        cart.length;

    document.getElementById("cartItems").textContent =
        cart.length;

    const total =
        cart.reduce(
            (sum, item) => sum + item.price,
            0
        );

    document.getElementById("cartValue").textContent =
        money(total);

    if (cart.length === 0) {
        container.innerHTML =
            '<div class="empty">Your cart is empty. Browse the store and add something you are thinking about buying.</div>';

        return;
    }

    container.innerHTML = "";

    cart.forEach(item => {
        const days =
            daysWaiting(item.added);

        const remaining =
            Math.max(item.waitDays - days, 0);

        const ready =
            remaining === 0;

        const box =
            document.createElement("div");

        box.className = "cart-item";

        let decisionArea;

        if (!ready) {
            decisionArea = `
                <div class="wait-box">

                    <div class="waiting-title">
                        Cooling-off period: ${item.waitDays} days
                    </div>

                    ${remaining} day${remaining === 1 ? "" : "s"} remaining

                    <br>

                    Decision available:
                    ${formatDate(decisionDate(item))}

                </div>
            `;
        } else {
            decisionArea = `
                <div class="wait-box ready">

                    <div class="waiting-title">
                        Your cooling-off period is complete.
                    </div>

                    You've had time to think about this purchase.

                </div>

                <div class="decision-buttons">

                    <button onclick="decide(${item.id}, 'wanted')">
                        Yes, I Still Want It
                    </button>

                    <button onclick="waitLonger(${item.id})">
                        I'm Not Sure — Wait Longer
                    </button>

                    <button onclick="decide(${item.id}, 'avoided')">
                        No, I Don't Need It
                    </button>

                </div>
            `;
        }

        box.innerHTML = `
            <h3>${item.name}</h3>

            <strong>${money(item.price)}</strong>

            <p>
                Added ${
                    days === 0
                        ? "today"
                        : days +
                          " day" +
                          (days === 1 ? "" : "s") +
                          " ago"
                }
            </p>

            ${decisionArea}
        `;

        container.appendChild(box);
    });
}


// ============================================================
// USER DECISIONS
// ============================================================

function waitLonger(id) {
    const item =
        cart.find(item => item.id === id);

    if (!item) return;

    // A user who is still unsure receives another seven days.
    item.waitDays += 7;

    save();
    renderCart();
}


function decide(id, decision) {
    const item =
        cart.find(item => item.id === id);

    if (!item) return;

    history.unshift({
        ...item,
        decision: decision,
        decisionDate: new Date().toISOString()
    });

    cart =
        cart.filter(item => item.id !== id);

    save();
    renderCart();
    renderHistory();
}


// ============================================================
// DECISION HISTORY AND STATISTICS
// ============================================================

function renderHistory() {
    const container =
        document.getElementById("historyList");

    const avoided =
        history.filter(
            item => item.decision === "avoided"
        );

    const wanted =
        history.filter(
            item => item.decision === "wanted"
        );

    const avoidedTotal =
        avoided.reduce(
            (sum, item) => sum + item.price,
            0
        );

    document.getElementById("avoidedCount").textContent =
        avoided.length;

    document.getElementById("wantedCount").textContent =
        wanted.length;

    document.getElementById("almostSpent").textContent =
        money(avoidedTotal);

    if (history.length === 0) {
        container.innerHTML =
            '<div class="empty">You have not made any decisions yet.</div>';

        return;
    }

    container.innerHTML = "";

    history.forEach(item => {
        const div =
            document.createElement("div");

        div.className = "history-item";

        div.innerHTML = `
            <strong>${item.name}</strong>
            — ${money(item.price)}

            <br>

            ${
                item.decision === "avoided"
                    ? "Decided not to buy"
                    : "Still wanted after the cooling-off period"
            }
        `;

        container.appendChild(div);
    });
}


// ============================================================
// DATA STORAGE
// ============================================================
// Keep persistence logic centralized here. This will make it
// easier to replace localStorage with a database/account system
// later without changing every part of the application.
// ============================================================

function save() {
    localStorage.setItem(
        "waitCart",
        JSON.stringify(cart)
    );

    localStorage.setItem(
        "waitHistory",
        JSON.stringify(history)
    );
}


// ============================================================
// NAVIGATION
// ============================================================

function showPanel(panelName) {
    document
        .querySelectorAll(".panel")
        .forEach(panel =>
            panel.classList.remove("active")
        );

    document
        .getElementById(panelName)
        .classList.add("active");

    document.getElementById("hero").style.display =
        panelName === "store"
            ? "block"
            : "none";

    if (panelName === "cart") {
        renderCart();
    }

    if (panelName === "history") {
        renderHistory();
    }

    window.scrollTo(0, 0);
}


// ============================================================
// MODAL BEHAVIOR
// ============================================================
// Clicking the shaded area outside the modal closes it.
// ============================================================

document
    .getElementById("waitModal")
    .addEventListener("click", function(event) {
        if (event.target === this) {
            closeWaitModal();
        }
    });

// ======================================================
// DEVELOPMENT / TESTING
// ======================================================
// Temporarily expires the first item in the cart so the
// post-wait decision workflow can be tested immediately.
// Remove this helper after end-to-end testing is complete.
// ======================================================

function expireFirstCartItemForTesting() {
    if (cart.length === 0) {
        console.log("TEST: Cart is empty.");
        return;
    }

    const item = cart[0];

    const expiredDate = new Date();
    expiredDate.setDate(
        expiredDate.getDate() - item.waitDays - 1
    );

    item.added = expiredDate.toISOString();

    saveCart();
    renderCart();

    console.log(
        `TEST: "${item.name}" cooling-off period has been completed.`
    );
}

// ============================================================
// APPLICATION STARTUP
// ============================================================
// Build the initial screen and restore any cart/history data
// already saved in the user's browser.
// ============================================================

renderProducts();
renderCart();
renderHistory();
