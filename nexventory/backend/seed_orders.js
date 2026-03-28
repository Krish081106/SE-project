const customers = [
    'Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Rohan Gupta', 'Neha Singh', 
    'Vikram Malhotra', 'Anjali Desai', 'Suresh Menon', 'Kavita Iyer', 'Manish Reddy',
    'Arjun Nair', 'Sneha Kapoor', 'Manoj Tiwari', 'Pooja Bhatia', 'Aditya Verma'
];

async function seedOrders() {
    console.log('Fetching products...');
    const productsRes = await fetch('http://localhost:5000/api/products');
    let products = await productsRes.json();
    
    if (products.length === 0) {
        console.log('No products found to create orders from.');
        return;
    }

    // Sort to randomize dates too
    const pastDates = Array.from({length: 15}, () => {
        const d = new Date();
        d.setDate(d.getDate() - Math.floor(Math.random() * 30));
        return d.toISOString().split('T')[0];
    }).sort((a,b) => new Date(a) - new Date(b));

    console.log('Creating orders...');
    let successfulCount = 0;
    
    for (let i = 0; i < 15; i++) {
        const customer = customers[Math.floor(Math.random() * customers.length)];
        const numItems = Math.floor(Math.random() * 3) + 1; // 1 to 3 items
        
        const shuffledProducts = [...products].sort(() => 0.5 - Math.random());
        const selectedProducts = shuffledProducts.slice(0, numItems);
        
        const orderItems = [];
        let totalAmount = 0;
        
        for (const p of selectedProducts) {
            const quantity = Math.floor(Math.random() * 3) + 1; // 1 to 3
            if (p.stock >= quantity) {
                const price = Number(p.price);
                const itemTotal = price * quantity;
                orderItems.push({ 
                    productId: p.id,
                    name: p.name,
                    price: price,
                    quantity: quantity,
                    total: itemTotal
                });
                totalAmount += itemTotal;
                p.stock -= quantity; // update local stock for subsequent orders
            }
        }
        
        if (orderItems.length === 0) continue;
        
        const orderPayload = {
            customer,
            items: orderItems,
            totalAmount: Number(totalAmount.toFixed(2)),
            date: pastDates[i]
        };
        
        try {
            const res = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderPayload)
            });
            if (res.ok) {
                console.log(`Order created for ${customer} on ${pastDates[i]} - Total: ₹${totalAmount.toFixed(2)}`);
                successfulCount++;
            } else {
                const err = await res.json();
                console.error(`Failed to create order for ${customer}:`, err);
            }
        } catch (error) {
            console.error(`Error creating order for ${customer}: ${error.message}`);
        }
    }
    console.log(`Order seeding complete. Successfully added ${successfulCount} orders.`);
}

seedOrders();
