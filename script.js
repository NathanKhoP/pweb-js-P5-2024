let selectedCategory = 'all'; // Default category is 'all'

fetchProductsByCategory('all', 10);

function fetchProductsByCategory(category, limit) {
    let url = `https://dummyjson.com/products?limit=${limit}`;
    
    if (category !== 'all') {
        // fetch by category
        url = `https://dummyjson.com/products/category/${category}?limit=${limit}`;
    }

    fetch(url)
        .then(res => res.json())
        .then(data => {
            const products = data.products;
            displayProducts(products);
        })
        .catch(error => console.error('Error fetching products:', error));
}

function displayProducts(products) {
    const menuItemsContainer = document.getElementById('menu-items');
    menuItemsContainer.innerHTML = '';  // clear container

    products.forEach(product => {
        const menuItem = document.createElement('div');
        menuItem.classList.add('menu-item', product.category);

        const img = document.createElement('img');
        img.src = product.thumbnail;
        img.alt = product.title;

        const itemInfo = document.createElement('div');
        itemInfo.classList.add('item-info');

        const itemTitle = document.createElement('h3');
        itemTitle.textContent = product.title;

        const itemDescription = document.createElement('p');
        itemDescription.textContent = product.description;

        const itemPrice = document.createElement('span');
        itemPrice.classList.add('price');
        itemPrice.textContent = `$${product.price}`;

        // add to cart
        const addToCartButton = document.createElement('button');
        addToCartButton.textContent = 'Add to Cart';
        addToCartButton.classList.add('cart-btn');
        addToCartButton.addEventListener('click', () => addToCart(product));

        // remove
        const removeFromCartButton = document.createElement('button');
        removeFromCartButton.textContent = 'Remove from Cart';
        removeFromCartButton.classList.add('cart-btn');
        removeFromCartButton.addEventListener('click', () => removeFromCart(product.id));

        // appends: itemInfo -> menuItem -> menuItemsContainer
        itemInfo.appendChild(itemTitle);
        itemInfo.appendChild(itemDescription);
        itemInfo.appendChild(itemPrice);
        itemInfo.appendChild(addToCartButton);
        itemInfo.appendChild(removeFromCartButton);

        menuItem.appendChild(img);
        menuItem.appendChild(itemInfo);

        menuItemsContainer.appendChild(menuItem);
    });
}

// filtering
const categoryButtons = document.querySelectorAll('.category-btn');
categoryButtons.forEach(button => {
    button.addEventListener('click', function() {
        selectedCategory = this.getAttribute('data-category'); 

        categoryButtons.forEach(btn => btn.classList.remove('active')); // remove active class
        this.classList.add('active'); // change active class

        applyCategoryLimit();
    });
});

function applyCategoryLimit() {
    const limit = document.getElementById('item-limit').value || 10;  // 10 as default 
    fetchProductsByCategory(selectedCategory, limit);
}

document.getElementById('apply-limit').addEventListener('click', applyCategoryLimit);

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Add item to cart
function addToCart(product) {
    const cartItem = cart.find(item => item.id === product.id);
    if (cartItem) {
        cartItem.quantity++;
    } else {
        product.quantity = 1;
        cart.push(product);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.title} added to cart.`);
}

// Remove item from cart
function removeFromCart(productId) {
    const cartItemIndex = cart.findIndex(item => item.id === productId);
    if (cartItemIndex !== -1) {
        if (cart[cartItemIndex].quantity > 1) {
            cart[cartItemIndex].quantity--;
        } else {
            cart.splice(cartItemIndex, 1);
        }
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Item removed from cart.');
}

// View Cart and Display Cart Modal
document.getElementById('view-cart-btn').addEventListener('click', () => {
    const cartModal = document.getElementById('cart-modal');
    const cartItemsContainer = document.getElementById('cart-items');
    
    cartItemsContainer.innerHTML = ''; // clear cart
    let totalItems = 0;
    let totalPrice = 0;

    cart.forEach(item => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add('cart-item');

        const itemTitle = document.createElement('span');
        itemTitle.textContent = `${item.title} (x${item.quantity})`;

        const itemPrice = document.createElement('span');
        itemPrice.textContent = `$${item.price * item.quantity}`;

        const addButton = document.createElement('button');
        addButton.textContent = '+';
        addButton.addEventListener('click', () => {
            addToCart(item);
            updateCartDisplay();
        });

        const subtractButton = document.createElement('button');
        subtractButton.textContent = '-';
        subtractButton.addEventListener('click', () => {
            removeFromCart(item.id);
            updateCartDisplay();
        });

        totalItems += item.quantity;
        totalPrice += item.price * item.quantity;

        cartItemDiv.appendChild(itemTitle);
        cartItemDiv.appendChild(itemPrice);
        cartItemDiv.appendChild(addButton);
        cartItemDiv.appendChild(subtractButton);

        cartItemsContainer.appendChild(cartItemDiv);
    });

    const totalDiv = document.createElement('div');
    totalDiv.classList.add('cart-total');
    totalDiv.innerHTML = `<p>Total Items: ${totalItems}</p><p>Total Price: $${totalPrice.toFixed(2)}</p>`;
    cartItemsContainer.appendChild(totalDiv);

    cartModal.style.display = 'block'; 
});

// Update cart display after modification
function updateCartDisplay() {
    const cartModal = document.getElementById('cart-modal');
    const cartItemsContainer = document.getElementById('cart-items');
    
    cartItemsContainer.innerHTML = ''; // clear cart display
    let totalItems = 0;
    let totalPrice = 0;

    cart.forEach(item => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add('cart-item');

        const itemTitle = document.createElement('span');
        itemTitle.textContent = `${item.title} (x${item.quantity})`;

        const itemPrice = document.createElement('span');
        itemPrice.textContent = `$${item.price * item.quantity}`;

        const addButton = document.createElement('button');
        addButton.textContent = '+';
        addButton.addEventListener('click', () => {
            addToCart(item);
            updateCartDisplay();
        });

        const subtractButton = document.createElement('button');
        subtractButton.textContent = '-';
        subtractButton.addEventListener('click', () => {
            removeFromCart(item.id);
            updateCartDisplay();
        });

        totalItems += item.quantity;
        totalPrice += item.price * item.quantity;

        cartItemDiv.appendChild(itemTitle);
        cartItemDiv.appendChild(itemPrice);
        cartItemDiv.appendChild(addButton);
        cartItemDiv.appendChild(subtractButton);

        cartItemsContainer.appendChild(cartItemDiv);
    });

    const totalDiv = document.createElement('div');
    totalDiv.classList.add('cart-total');
    totalDiv.innerHTML = `<p>Total Items: ${totalItems}</p><p>Total Price: $${totalPrice.toFixed(2)}</p>`;
    cartItemsContainer.appendChild(totalDiv);
}

// Close Cart Modal
document.getElementById('close-cart-btn').addEventListener('click', () => {
    document.getElementById('cart-modal').style.display = 'none';
});

// Checkout Feature
document.getElementById('checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty.');
    } else {
        alert(`Successfully checked out ${cart.length} item(s)! Total price: $${cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}`);
        cart = []; // Clear the cart
        localStorage.removeItem('cart');
        updateCartDisplay(); // Update cart display after checkout
    }
});