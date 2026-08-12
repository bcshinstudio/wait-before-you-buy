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
    const searchText =
        query.trim().toLowerCase();

    if (!searchText) {
        return getProducts();
    }

    // Search the built-in browse catalog.
    const localResults =
        getProducts().filter(product => {
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

    const endpoint =
        "https://wait-before-you-buy-api.bcshin-studio.workers.dev/products" +
        "?q=" +
        encodeURIComponent(searchText);

    try {
        const response =
            await fetch(endpoint);

        if (!response.ok) {
            throw new Error(
                `Product search failed with status ${response.status}`
            );
        }

        const data =
            await response.json();

        const externalResults =
            Array.isArray(data.products)
                ? data.products
                : [];

        // Combine local and external results while removing
        // obvious duplicates.
        const combinedResults = [
            ...localResults,
            ...externalResults
        ];

        const uniqueProducts =
            combinedResults.filter(
                (product, index, array) => {
                    const productKey =
                        `${product.name || ""}|${Number(product.price) || 0}`
                            .toLowerCase();

                    return (
                        array.findIndex(item => {
                            const itemKey =
                                `${item.name || ""}|${Number(item.price) || 0}`
                                    .toLowerCase();

                            return itemKey === productKey;
                        }) === index
                    );
                }
            );

        return uniqueProducts;

    } catch (error) {
        console.error(
            "Product search error:",
            error
        );

        // If the external search fails but the local catalog
        // contains matches, still let the user see them.
        if (localResults.length > 0) {
            return localResults;
        }

        throw error;
    }
}
