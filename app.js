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
// Product data is defined separately in products.js and accessed
// through the product source layer in product-source.js.
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
let displayedProducts = [];

let historyPeriod =
    localStorage.getItem("waitHistoryPeriod") || "1M";


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
    if (price < 500) return 7;
    if (price < 1000) return 14;

    return 30;
}


function daysWaiting(date, endDate = new Date()) {
    const start = new Date(date);
    const end = new Date(endDate);

    return Math.floor(
        (end - start) /
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

function renderProducts(category = "All", productList = getProducts()) {
    const container =
        document.getElementById("products");

    container.innerHTML = "";

    const availableProducts = productList;
    
    const filtered =
        category === "All"
            ? availableProducts
            : availableProducts.filter(
                product => product.category === category
            );

    displayedProducts = filtered;

    if (filtered.length === 0) {
        container.innerHTML =
            '<div class="empty search-empty">No products found. Try a different search.</div>';
    
        return;
    }    
    filtered.forEach(product => {
        const card =
            document.createElement("div");

        card.className = "product";

        card.innerHTML = `
            <div class="product-image">
                ${
                    product.image
                        ? `<img src="${product.image}" alt="${product.name}">`
                        : product.icon || "📦"
                }
            </div>

            <div class="product-info">

                <div class="category">
                    ${product.category}
                </div>

                <h3>${product.name}</h3>

                ${
                    product.description
                        ? `
                            <div class="product-description">
                                ${product.description}
                            </div>
                        `
                        : ""
                }                
                <div class="price">
                    ${money(product.price)}
                </div>

                <button
                    class="add-button"
                    onclick="openWaitModal('${product.id}')">
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
// PRODUCT SEARCH
// ============================================================
// Searches through the product-source layer, then reuses the
// existing product-card renderer to display matching results.
// ============================================================

async function handleProductSearch() {
    const searchInput =
        document.getElementById("productSearch");

    const container =
        document.getElementById("products");

    const searchText =
        searchInput.value.trim();

    if (!searchText) {
        renderProducts();
        return;
    }

    container.innerHTML =
        '<div class="empty search-empty">Searching...</div>';

    try {
        const results =
            await searchProducts(searchText);

        renderProducts("All", results);

    } catch (error) {
        console.error(
            "Unable to load product search results:",
            error
        );

        container.innerHTML =
            '<div class="empty search-empty">We couldn\'t search products right now. Please try again.</div>';
    }
}
function handleSearchKeydown(event) {
    if (event.key === "Enter") {
        handleProductSearch();
    }
}

function handleSearchClear(event) {
    if (event.target.value === "") {
        renderProducts();
    }
}

// ============================================================
// WAITING-PERIOD SELECTION
// ============================================================
// When a user chooses a product, the app recommends a waiting
// period but allows the user to override that recommendation.
// ============================================================

function openWaitModal(id) {
    const product =
        displayedProducts.find(
            product => String(product.id) === String(id)
        );

    if (!product) return;

    if (
        cart.some(
            item => String(item.id) === String(id)
        )
    ) {
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
// The cart is a simulated shopping cart. Items can remain here
// indefinitely; completing the suggested cooling-off period
// does not force the user to make a decision.
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

        let reflectionArea;

        if (!ready) {
            reflectionArea = `
                <div class="wait-box">
        
                    <div class="waiting-title">
                        Suggested cooling-off period: ${item.waitDays} days
                    </div>
        
                    ${remaining} day${remaining === 1 ? "" : "s"} remaining
        
                    <br>
        
                    Revisit after:
                    ${formatDate(decisionDate(item))}
        
                </div>
        
                <div class="decision-buttons">
        
                    <button onclick="decide('${item.id}', 'not-needed')">
                        I Don't Want It Anymore
                    </button>
        
                </div>
            `;
        } else {
            reflectionArea = `
                <div class="wait-box ready">

                    <div class="waiting-title">
                        You've had this in your cart for ${days} day${days === 1 ? "" : "s"}.
                    </div>

                    Do you still feel the same way about it?

                </div>

                <div class="decision-buttons">

                    <button onclick="decide('${item.id}', 'bought')">
                        I Bought It
                    </button>

                    <button onclick="decide('${item.id}', 'not-needed')">
                        I Don't Want It Anymore
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

            ${reflectionArea}
        `;

        container.appendChild(box);
    });
}


// ============================================================
// USER DECISIONS
// ============================================================
function decide(id, decision) {
    const item =
        cart.find(item => String(item.id) === String(id));

    if (!item) return;

    history.unshift({
        ...item,
        decision: decision,
        decisionDate: new Date().toISOString()
    });

    cart =
        cart.filter(item => String(item.id) !== String(id));

    save();
    renderCart();
    renderHistory();
}

function setPurchaseOutcome(id, outcome) {
    const item =
        history.find(
            item => String(item.id) === String(id)
        );

    if (!item) return;

    item.purchaseOutcome = outcome;
    item.purchaseOutcomeDate =
        new Date().toISOString();

    save();
    renderHistory();
}

// ============================================================
// DECISION HISTORY AND STATISTICS
// ============================================================
function setHistoryPeriod(period) {
    historyPeriod = period;

    localStorage.setItem(
        "waitHistoryPeriod",
        historyPeriod
    );
    
    renderHistory();
}

function historyPeriodStart(period) {
    const now = new Date();

    if (period === "All") {
        return null;
    }

    if (period === "YTD") {
        return new Date(
            now.getFullYear(),
            0,
            1
        );
    }

    const start = new Date(now);

    if (period === "1M") {
        start.setMonth(start.getMonth() - 1);
    }

    if (period === "3M") {
        start.setMonth(start.getMonth() - 3);
    }

    if (period === "6M") {
        start.setMonth(start.getMonth() - 6);
    }

    if (period === "1Y") {
        start.setFullYear(start.getFullYear() - 1);
    }

    return start;
}

function renderHistory() {
    const container =
        document.getElementById("historyList");

    document
        .querySelectorAll(".history-period")
        .forEach(button => {
            button.classList.toggle(
                "active",
                button.dataset.period === historyPeriod
            );
        });    

    const periodStart =
        historyPeriodStart(historyPeriod);
    
    const filteredHistory =
        history.filter(item => {
            if (!periodStart) {
                return true;
            }
    
            if (!item.decisionDate) {
                return false;
            }
    
            return new Date(item.decisionDate) >= periodStart;
        });

    const notNeeded =
        filteredHistory.filter(
            item =>
                item.decision === "not-needed" ||
                item.decision === "avoided"
        );

    const bought =
        filteredHistory.filter(
            item =>
                item.decision === "bought" ||
                item.decision === "wanted"
        );

    const worthIt =
        bought.filter(
            item => item.purchaseOutcome === "worth-it"
        );
    
    const regretted =
        bought.filter(
            item => item.purchaseOutcome === "regret"
        );
    
    const regretTotal =
        regretted.reduce(
            (sum, item) => sum + item.price,
            0
        );    

    const notNeededTotal =
        notNeeded.reduce(
            (sum, item) => sum + item.price,
            0
        );

    document.getElementById("avoidedCount").textContent =
        notNeeded.length;

    document.getElementById("wantedCount").textContent =
        bought.length;

    document.getElementById("almostSpent").textContent =
        money(notNeededTotal);

    document.getElementById("worthItCount").textContent =
        worthIt.length;
    
    document.getElementById("regretCount").textContent =
        regretted.length;
    
    document.getElementById("regretTotal").textContent =
        money(regretTotal);    

    if (filteredHistory.length === 0) {
        container.innerHTML =
            '<div class="empty">No decisions found for this time period.</div>';

        return;
    }

    container.innerHTML = "";

    filteredHistory.forEach(item => {
        const div =
            document.createElement("div");

        div.className = "history-item";

        const decisionDateText =
            item.decisionDate
                ? formatDate(new Date(item.decisionDate))
                : "";
        
        const consideredDays =
            item.added && item.decisionDate
                ? daysWaiting(item.added, item.decisionDate)
                : null;        

        div.innerHTML = `
            <strong>${item.name}</strong>
            — ${money(item.price)}
        
            <br>
        
            ${
                item.decision === "not-needed" ||
                item.decision === "avoided"
                    ? `Decided not to buy${
                        decisionDateText
                            ? ` · ${decisionDateText}`
                            : ""
                    }`
                    : item.purchaseOutcome === "worth-it"
                        ? `Bought independently${
                            decisionDateText
                                ? ` · ${decisionDateText}`
                                : ""
                        } — Worth It`
                        : item.purchaseOutcome === "regret"
                            ? `Bought independently${
                                decisionDateText
                                    ? ` · ${decisionDateText}`
                                    : ""
                            } — Regret Buying It`
                            : `
                                Bought independently${
                                    decisionDateText
                                        ? ` · ${decisionDateText}`
                                        : ""
                                }
        
                                <div class="purchase-outcome-buttons">
                                    <button
                                        onclick="setPurchaseOutcome('${item.id}', 'worth-it')">
                                        Worth It
                                    </button>
        
                                    <button
                                        onclick="setPurchaseOutcome('${item.id}', 'regret')">
                                        Regret Buying It
                                    </button>
                                </div>
                            `
            }
            
            ${
                consideredDays !== null
                    ? `
                        <div class="considered-time">
                            Considered for ${consideredDays} day${consideredDays === 1 ? "" : "s"}
                        </div>
                    `
                    : ""
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
    localStorage.setItem("waitActivePanel", panelName);
    
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

// ============================================================
// APPLICATION STARTUP
// ============================================================
// Build the initial screen and restore any cart/history data
// already saved in the user's browser.
// ============================================================

renderProducts();
renderCart();
renderHistory();

const savedPanel =
    localStorage.getItem("waitActivePanel") || "store";

showPanel(savedPanel);
