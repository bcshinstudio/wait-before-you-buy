// ============================================================
// PRODUCT SOURCE
// ============================================================
// Provides the application with products through a single,
// consistent interface.
//
// The built-in demo catalog is supplied by products.js.
//
// Product searches are sent through the Wait Before You Buy
// API Worker. The Worker is responsible for communicating with
// external retailer APIs and returning products in the standard
// format expected by the application.
//
// Keeping retailer-specific logic outside the browser makes it
// easier to add or replace product sources later and prevents
// private API credentials from being exposed to users.
// ============================================================


// ============================================================
// ACTIVE PRODUCT CATALOG
// ============================================================
// Returns the built-in product collection used for browsing.
//
// This demo catalog remains available while external product
// search is being developed and can later serve as sample or
// suggested products.
// ============================================================

function getProducts() {
    return products;
}


// ============================================================
// PRODUCT SEARCH
// ============================================================
// Searches for products through the Wait Before You Buy API.
//
// The browser sends only the user's search text. The API Worker
// determines which external product source to use and returns
// standardized product objects.
//
// An empty search restores the built-in demo catalog.
// ============================================================

async function searchProducts(query) {
    const searchText = query.trim();

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
        console.error(
            "Product search error:",
            error
        );

        throw error;
    }
}
