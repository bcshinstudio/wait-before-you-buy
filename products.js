// ============================================================
// PRODUCT CATALOG
// ============================================================
// Defines the products currently available in the demo store.
//
// Keep product data separate from application behavior so the
// catalog can later be replaced by a larger catalog, database,
// or external product source without rewriting the cart and
// cooling-off logic.
//
// Product IDs should remain unique and stable because the cart
// uses them to identify products.
// ============================================================

const products = [
    {
        id: 1,
        name: "Wireless Noise-Canceling Headphones",
        price: 349.99,
        category: "Electronics",
        icon: "🎧"
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 299.99,
        category: "Electronics",
        icon: "⌚"
    },
    {
        id: 3,
        name: "Tablet",
        price: 499.99,
        category: "Electronics",
        icon: "▣"
    },
    {
        id: 4,
        name: "Robot Vacuum",
        price: 449.99,
        category: "Home",
        icon: "◉"
    },
    {
        id: 5,
        name: "Espresso Machine",
        price: 599.99,
        category: "Home",
        icon: "☕"
    },
    {
        id: 6,
        name: "Air Fryer",
        price: 129.99,
        category: "Home",
        icon: "♨"
    },
    {
        id: 7,
        name: "Mirrorless Camera",
        price: 1299.99,
        category: "Hobbies",
        icon: "📷"
    },
    {
        id: 8,
        name: "Hiking Backpack",
        price: 179.99,
        category: "Hobbies",
        icon: "🎒"
    },
    {
        id: 9,
        name: "Electric Guitar",
        price: 749.99,
        category: "Hobbies",
        icon: "🎸"
    },
    {
        id: 10,
        name: "Premium Running Shoes",
        price: 189.99,
        category: "Lifestyle",
        icon: "👟"
    },
    {
        id: 11,
        name: "Designer Sunglasses",
        price: 279.99,
        category: "Lifestyle",
        icon: "🕶"
    },
    {
        id: 12,
        name: "Massage Chair",
        price: 1999.99,
        category: "Lifestyle",
        icon: "🪑"
    }
];
