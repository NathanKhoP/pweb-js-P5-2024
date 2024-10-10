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

function addToCart(product) {
    if (!cart.some(item => item.id === product.id)) {
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${product.title} added to cart.`);
    } else {
        alert(`${product.title} is already in the cart.`);
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Item removed from cart.');
}

// view cart
document.getElementById('view-cart-btn').addEventListener('click', () => {
    const cartModal = document.getElementById('cart-modal');
    const cartItemsContainer = document.getElementById('cart-items');
    
    cartItemsContainer.innerHTML = ''; // clear cart
    cart.forEach(item => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add('cart-item');

        const itemTitle = document.createElement('span');
        itemTitle.textContent = item.title;

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', () => {
            removeFromCart(item.id);
            cartItemDiv.remove(); // remove item
        });

        cartItemDiv.appendChild(itemTitle);
        cartItemDiv.appendChild(removeButton);
        cartItemsContainer.appendChild(cartItemDiv);
    });

    cartModal.style.display = 'block'; 
});

document.getElementById('close-cart-btn').addEventListener('click', () => {
    document.getElementById('cart-modal').style.display = 'none';
});
