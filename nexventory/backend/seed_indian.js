const items = [
    { name: 'Aashirvaad Whole Wheat Atta 5kg', category: 'Groceries', price: 230, stock: 50 },
    { name: 'Tata Salt 1kg', category: 'Groceries', price: 28, stock: 100 },
    { name: 'Maggi 2-Minute Noodles 70g', category: 'Snacks', price: 14, stock: 200 },
    { name: 'Amul Butter 100g', category: 'Dairy', price: 58, stock: 40 },
    { name: 'Fortune Sunlite Refined Sunflower Oil 1L', category: 'Groceries', price: 145, stock: 60 },
    { name: 'Parle-G Original Glucose Biscuits 800g', category: 'Snacks', price: 80, stock: 75 },
    { name: 'Brooke Bond Red Label Tea 500g', category: 'Beverages', price: 250, stock: 35 },
    { name: 'Nescafe Classic Coffee 50g', category: 'Beverages', price: 175, stock: 30 },
    { name: 'Lifebuoy Total 10 Soap 125g', category: 'Personal Care', price: 36, stock: 120 },
    { name: 'Colgate MaxFresh Toothpaste 150g', category: 'Personal Care', price: 115, stock: 85 },
    { name: 'Surf Excel Easy Wash Detergent Powder 1kg', category: 'Household Needs', price: 135, stock: 90 },
    { name: 'Daawat Rozana Basmati Rice 1kg', category: 'Groceries', price: 95, stock: 55 },
    { name: 'Haldiram\'s Bhujia Sev 200g', category: 'Snacks', price: 55, stock: 150 },
    { name: 'MDH Garam Masala 100g', category: 'Groceries', price: 82, stock: 65 },
    { name: 'Dettol Antiseptic Liquid 250ml', category: 'Health & Hygiene', price: 125, stock: 45 }
];

async function seed() {
    console.log('Starting to seed items...');
    for (const item of items) {
        try {
            const res = await fetch('http://localhost:3000/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item)
            });
            if (res.ok) {
                console.log(`Added: ${item.name}`);
            } else {
                console.error(`Failed to add: ${item.name}`);
            }
        } catch (error) {
            console.error(`Error adding ${item.name}: ${error.message}`);
        }
    }
    console.log('Seeding complete.');
}

seed();
