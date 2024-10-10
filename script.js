let allProducts = [];

// dummyjson fetch
fetch('https://dummyjson.com/products?limit=0')
    .then(res => res.json())
    .then(data => {
        allProducts = data.products;
        displayProducts(allProducts); 
    })
    .catch(error => console.error('Error fetching products:', error));

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

        // appends: itemInfo -> menuItem -> menuItemsContainer
        itemInfo.appendChild(itemTitle);
        itemInfo.appendChild(itemDescription);
        itemInfo.appendChild(itemPrice);

        menuItem.appendChild(img);
        menuItem.appendChild(itemInfo);

        menuItemsContainer.appendChild(menuItem);
    });
}

// filtering
const categoryButtons = document.querySelectorAll('.category-btn');
categoryButtons.forEach(button => {
    button.addEventListener('click', function() {
        const selectedCategory = this.getAttribute('data-category');

        categoryButtons.forEach(btn => btn.classList.remove('active')); // remove active category
        this.classList.add('active'); // change active category

        if (selectedCategory === 'all') {
            displayProducts(allProducts);
        } 
        else {
            const filteredProducts = allProducts.filter(product => product.category === selectedCategory);
            displayProducts(filteredProducts);
        }
    });
});
