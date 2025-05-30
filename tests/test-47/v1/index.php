<?php
// Handle order submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'place_order') {
    $cart = json_decode($_POST['cart'], true);
    $total = 0;
    
    // Calculate total without validation
    foreach ($cart as $item) {
        $total += $item['quantity'] * $item['price'];
    }
    
    // Return success response
    header('Content-Type: application/json');
    echo json_encode(['success' => true, 'total' => $total]);
    exit;
}
?>

<div>
    <div>
        <div>
            <b>Premium Widget</b>
            <p>Price: $100.00</p>
            <div>
                <label for="quantity">Quantity:</label>
                <input type="number" id="quantity" min="1" value="1" onchange="updateTotal()">
            </div>
            <p>Total: $100.00</p>
            <button onclick="addToCart()">Add to Cart</button>
        </div>
    </div>
    <br />
    <br />
    <br />
    <div>

        <b>Shopping Cart</b>
        <div id="cart-items"></div>
        <div>
            <p>Cart Total: <span id="cart-total">$0.00</span></p>
            <button onclick="checkout()">Place Order</button>
        </div>
    </div>
</div>

<script>
let cart = [];

function updateTotal() {
    const quantity = parseInt(document.getElementById('quantity').value) || 0;
    const price = 100.00;
    const total = quantity * price;
    document.querySelector('.total').textContent = `Total: $${total.toFixed(2)}`;
}

function addToCart() {
    const quantity = parseInt(document.getElementById('quantity').value) || 0;
    const item = {
        name: 'Premium Widget',
        price: 100.00,
        quantity: quantity
    };

    cart.push(item);
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    let total = 0;

    cartItems.innerHTML = cart.map((item, index) => `
        <div>
            <span>${item.name}</span>
            <span>${item.quantity} x $${item.price.toFixed(2)}</span>
            <span>$${(item.quantity * item.price).toFixed(2)}</span>
            <button onclick="removeItem(${index})">Remove</button>
        </div>
    `).join('');

    total = cart.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCartDisplay();
}

async function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }

    try {
        const response = await fetch('', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `action=place_order&cart=${encodeURIComponent(JSON.stringify(cart))}`
        });

        const result = await response.json();
        
        if (result.success) {
            alert(`Order placed successfully! Total: $${result.total.toFixed(2)}`);
            cart = [];
            updateCartDisplay();
        } else {
            alert('Failed to place order. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while placing your order.');
    }
}
</script>