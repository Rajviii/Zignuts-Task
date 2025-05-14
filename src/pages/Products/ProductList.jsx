import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../../assets/styles/ProductList.module.css";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/common/Loader";

export default function ProductList() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [skip, setSkip] = useState(0);
  const limit = 8;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `https://dummyjson.com/products?limit=${limit}&skip=${skip}`
        );
        setProducts(res.data.products);
      } catch (err) {
        setError("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [skip]);

  const handlePrev = () => {
    if (skip >= limit) setSkip(skip - limit);
  };

  const handleNext = () => {
    setSkip(skip + limit);
  };

  const handleProductClick = (id) => {
    navigate(`/products/${id}`);
  };

  if (loading) {
    return <Loader />;
  }

  if (error || !products) return <p>{error || "Product not found"}</p>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.pageWrapper}>
        <h2>Product Listing</h2>
        <div className={styles.grid}>
          {products.map((product) => (
            <div
              key={product.id}
              className={styles.card}
              onClick={() => handleProductClick(product.id)}
            >
              <img
                src={product.thumbnail}
                alt={product.title}
                className={styles.thumb}
              />
              <h3>{product.title}</h3>
              <p>
                <strong>Category:</strong> {product.category}
              </p>
              <p>
                <strong>Brand:</strong> {product.brand}
              </p>
              <p>
                <strong>Rating:</strong> {product.rating}
              </p>
              <p>
                <strong>Price:</strong> ${product.price}
              </p>
              <p>
                <strong>Discount:</strong> {product.discountPercentage}%
              </p>
            </div>
          ))}
        </div>

        <div className={styles.pagination}>
          <button onClick={handlePrev} disabled={skip === 0}>
            Previous
          </button>
          <button onClick={handleNext}>Next</button>
        </div>
      </div>
    </div>
  );
}