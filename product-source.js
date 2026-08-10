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
// BEST BUY PRODUCT ADAPTER
// ============================================================
// Converts a Best Buy Products API result into the standard
// product format used by the rest of the application.
//
// Keeping retailer-specific field names here prevents app.js
// from depending directly on Best Buy's API structure.
// ============================================================

function normalizeBestBuyProduct(item) {
    return {
        id: item.sku,

        name:
            item.name ||
            "Unnamed Product",

        description:
            item.shortDescription ||
            item.longDescription ||
            "",

        price:
            item.salePrice ??
            item.regularPrice ??
            0,

        category:
            item.categoryPath?.length
                ? item.categoryPath[item.categoryPath.length - 1].name
                : "Other",

        image:
            item.image || null,

        source: "bestbuy",
        sourceName: "Best Buy",
        sourceProductId: String(item.sku),
        sourceUrl: item.url || ""
    };
}

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
    const searchText = query.trim();

    // An empty search restores the normal demo catalog.
    if (!searchText) {
        return getProducts();
    }

    const endpoint =
        "https://wait-before-you-buy-api.bcshin-studio.workers.dev/products" +
        "?q=" +
        encodeURIComponent(searchText);

    try {
        const response = await fetch(endpoint);

        if (!response.ok) {
            throw new Error(
                `Product search failed with status ${response.status}`
            );
        }

        const data = await response.json();

        return Array.isArray(data.products)
            ? data.products
            : [];

    } catch (error) {
        console.error("Product search error:", error);

        return [];
    }
}
