interface ProductResponse {
  title: string;
  value: string;
  id: number;
}

async function products(search: string = "") {
  const response = await fetch(
    `https://dummyjson.com/products${search ? `/search?q=${search}` : ""}`
  );

  const data: { products: ProductResponse[] } = await response.json();

  const products = data.products.map((product) => ({
    name: product.title,
    value: product.title,
    id: product.id,
  }));

  return products;
}

export default products;
