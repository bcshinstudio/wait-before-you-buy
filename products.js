// ============================================================
// PRODUCT CATALOG
// ============================================================
// Defines products currently available in the demo store.
//
// This file contains product data only. Application behavior
// such as cart management, cooling-off periods, and decisions
// belongs in app.js.
//
// Products use a standard internal structure so the demo catalog
// can later be replaced by retailer APIs, a database, or other
// external product sources without rewriting the core application.
//
// The "source" fields identify where a product originated and
// will support future external product integrations.
//
// Product IDs should remain unique and stable because the cart
// uses them to identify products.
// ============================================================

const products = [
    {
        id: 1,
        name: "Wireless Noise-Canceling Headphones",
        description: "Over-ear wireless headphones with active noise cancellation.",
        price: 349.99,
        category: "Electronics",
        icon: "🎧",
        image: "headphones.png",

        source: "demo",
        sourceName: "Demo Store",
        sourceProductId: "1",
        sourceUrl: null
    },
    {
        id: 2,
        name: "Smart Watch",
        description: "A smartwatch for everyday activity tracking and notifications.",
        price: 299.99,
        category: "Electronics",
        icon: "⌚",

        source: "demo",
        sourceName: "Demo Store",
        sourceProductId: "2",
        sourceUrl: null
    },
    {
        id: 3,
        name: "Tablet",
        description: "A portable tablet for browsing, media, and everyday apps.",
        price: 499.99,
        category: "Electronics",
        icon: "▣",

        source: "demo",
        sourceName: "Demo Store",
        sourceProductId: "3",
        sourceUrl: null
    },
    {
        id: 4,
        name: "Robot Vacuum",
        description: "An automatic vacuum designed for routine floor cleaning.",
        price: 449.99,
        category: "Home",
        icon: "◉",

        source: "demo",
        sourceName: "Demo Store",
        sourceProductId: "4",
        sourceUrl: null
    },
    {
        id: 5,
        name: "Espresso Machine",
        description: "A countertop espresso machine for making coffee drinks at home.",
        price: 599.99,
        category: "Home",
        icon: "☕",

        source: "demo",
        sourceName: "Demo Store",
        sourceProductId: "5",
        sourceUrl: null
    },
    {
        id: 6,
        name: "Air Fryer",
        description: "A countertop air fryer for quick everyday cooking.",
        price: 129.99,
        category: "Home",
        icon: "♨",

        source: "demo",
        sourceName: "Demo Store",
        sourceProductId: "6",
        sourceUrl: null
    },
    {
        id: 7,
        name: "Mirrorless Camera",
        description: "A compact interchangeable-lens camera for photography and video.",
        price: 1299.99,
        category: "Hobbies",
        icon: "📷",

        source: "demo",
        sourceName: "Demo Store",
        sourceProductId: "7",
        sourceUrl: null
    },
    {
        id: 8,
        name: "Hiking Backpack",
        description: "A lightweight backpack designed for hiking and outdoor trips.",
        price: 179.99,
        category: "Hobbies",
        icon: "🎒",

        source: "demo",
        sourceName: "Demo Store",
        sourceProductId: "8",
        sourceUrl: null
    },
    {
        id: 9,
        name: "Electric Guitar",
        description: "An electric guitar for practice, recording, and performance.",
        price: 749.99,
        category: "Hobbies",
        icon: "🎸",

        source: "demo",
        sourceName: "Demo Store",
        sourceProductId: "9",
        sourceUrl: null
    },
    {
        id: 10,
        name: "Premium Running Shoes",
        description: "Cushioned running shoes designed for everyday training.",
        price: 189.99,
        category: "Lifestyle",
        icon: "👟",

        source: "demo",
        sourceName: "Demo Store",
        sourceProductId: "10",
        sourceUrl: null
    },
    {
        id: 11,
        name: "Designer Sunglasses",
        description: "Premium sunglasses designed for everyday wear.",
        price: 279.99,
        category: "Lifestyle",
        icon: "🕶",

        source: "demo",
        sourceName: "Demo Store",
        sourceProductId: "11",
        sourceUrl: null
    },
    {
        id: 12,
        name: "Massage Chair",
        description: "A full-size massage chair designed for home relaxation.",
        price: 1999.99,
        category: "Lifestyle",
        icon: "🪑",

        source: "demo",
        sourceName: "Demo Store",
        sourceProductId: "12",
        sourceUrl: null
    }
];
