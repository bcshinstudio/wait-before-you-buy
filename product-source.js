// ============================================================
// PRODUCT SOURCE
// ============================================================
// Provides the application with products through a single,
// consistent interface.
//
// The demo catalog is currently supplied by products.js.
// Future versions can retrieve products from retailer APIs,
// a database, or other external sources without requiring the
// rest of the application to know where the products came from.
// ============================================================


// ============================================================
// SIMULATED EXTERNAL PRODUCT SOURCE
// ============================================================
// Temporary test data that mimics products coming from an
// external retailer API. This lets us verify that app.js can
// consume products from another source before connecting a
// real API.
// ============================================================

const simulatedExternalProducts = [
    {
        id: 1001,
        name: "Portable Bluetooth Speaker",
        description: "A compact wireless speaker for home and travel.",
        price: 89.99,
        category: "Electronics",
        icon: "🔊",

        source: "simulated-api",
        sourceName: "Sample Retailer",
        sourceProductId: "SPK-1001",
        sourceUrl: "https://example.com/products/SPK-1001"
    },
    {
        id: 1002,
        name: "Cordless Stick Vacuum",
        description: "A lightweight cordless vacuum for everyday floor cleaning.",
        price: 249.99,
        category: "Home",
        icon: "🧹",

        source: "simulated-api",
        sourceName: "Sample Retailer",
        sourceProductId: "VAC-1002",
        sourceUrl: "https://example.com/products/VAC-1002"
    }
];


// ============================================================
// ACTIVE PRODUCT SOURCE
// ============================================================
// Returns the product collection currently used by the app.
//
// The demo catalog remains active while external API access is
// being developed. The application should access products
// through this layer rather than depending directly on
// products.js.
// ============================================================

function getProducts() {
    return products;
}

// ============================================================
// PRODUCT SEARCH
// ============================================================
// Provides a common search interface for product sources.
//
// This prototype searches the currently active local catalog.
// The function is intentionally asynchronous so app.js can use
// the same interface later when searches come from a retailer
// API over the network.
// ============================================================

async function searchProducts(query) {
    const searchText = query.trim().toLowerCase();

    if (!searchText) {
        return getProducts();
    }

    return getProducts().filter(product => {
        const searchableText = [
            product.name,
            product.description,
            product.category
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        return searchableText.includes(searchText);
    });
}
