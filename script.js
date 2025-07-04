let productsData = [];

async function loadProducts() {
  try {
    const res = await fetch('https://interveiw-mock-api.vercel.app/api/getProducts');
    const data = await res.json();
    console.log(data); // Debugging output
    productsData = data.data;
    renderProducts(productsData, true); // shuffle on first load
    document.getElementById('empty-state').style.display = 'none';
  } catch (err) {
    alert('Failed to fetch products');
    console.error(err);
  }
}

function renderProducts(products, shouldShuffle = true) {
  const productList = document.getElementById('product-list');
  productList.innerHTML = '';

  let finalProducts = [...products];

  // Shuffle only if needed
  if (shouldShuffle) {
    finalProducts.sort(() => Math.random() - 0.5);
  }

  // Limit to 6
  const limitedProducts = finalProducts.slice(0, 6);

  document.getElementById('product-count').innerText = `${limitedProducts.length} Products`;

  limitedProducts.forEach((item, index) => {
    const product = item.product;
    const image = product?.image?.src || 'https://via.placeholder.com/200';
    const price = product?.variants?.[0]?.price || 'N/A';
    const title = product.title || 'No Title';

    const div = document.createElement('div');
    div.className = 'product';
    div.style.animationDelay = `${index * 0.1}s`;

    div.innerHTML = `
      <img src="${image}" alt="${title}" />
      <div class="product-content">
        <h4>${title}</h4>
        <p class="price">Rs. ${price}</p>
        <button class="add-to-cart-btn">Add to Cart</button>
      </div>
    `;

    productList.appendChild(div);
  });
}

document.getElementById('sort-by').addEventListener('change', function () {
  const value = this.value;
  let sorted = [...productsData];

  if (value === 'asc') {
    sorted.sort((a, b) =>
      parseFloat(a.product.variants[0].price) - parseFloat(b.product.variants[0].price)
    );
  } else if (value === 'desc') {
    sorted.sort((a, b) =>
      parseFloat(b.product.variants[0].price) - parseFloat(a.product.variants[0].price)
    );
  }

  renderProducts(sorted, false); // no shuffle while sorting
});
