const BASE_URL = "https://tabby-shop-backend.onrender.com/api/products";

// GET products
export const getProducts = async () => {
  const res = await fetch(BASE_URL);
  return res.json();
};

// ADD product
export const addProduct = async (product) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  return res.json();
};

// DELETE product
export const deleteProduct = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  return res.json();
};