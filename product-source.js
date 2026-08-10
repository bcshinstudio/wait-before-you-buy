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
// For this temporary test, return the simulated external
// products instead of the demo catalog.
// ============================================================

function getProducts() {
    return products;
}
