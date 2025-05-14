import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "../../assets/styles/ProductDetails.module.css";
import Loader from "../../components/common/Loader";
import GoBackButton from "../../components/common/GoBackButton";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`https://dummyjson.com/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        setError("Failed to load product", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return <Loader />;
  }
  if (error || !product) return <p>{error || "Product not found"}</p>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          <GoBackButton />
          <h1>{product.title}</h1>
          <div className={styles.topSection}>
            <img
              src={product.thumbnail}
              alt={product.title}
              className={styles.thumbnail}
            />
            <div className={styles.details}>
              <p>
                <strong>Brand:</strong> {product.brand}
              </p>
              <p>
                <strong>Category:</strong> {product.category}
              </p>
              <p>
                <strong>Price:</strong> ${product.price}
              </p>
              <p>
                <strong>Discount:</strong> {product.discountPercentage}%
              </p>
              <p>
                <strong>Rating:</strong> {product.rating}
              </p>
              <p>
                <strong>Stock:</strong> {product.stock}
              </p>
              <p>
                <strong>SKU:</strong> {product.sku}
              </p>
              <p>
                <strong>Availability:</strong> {product.availabilityStatus}
              </p>
              <p>
                <strong>Minimum Order Quantity:</strong>{" "}
                {product.minimumOrderQuantity}
              </p>
            </div>
          </div>

          <p className={styles.description}>{product.description}</p>

          <div className={styles.details}>
            <h3>Tags:</h3>
            <ul className={styles.tags}>
              {product.tags.map((tag, index) => (
                <li key={index}>{tag}</li>
              ))}
            </ul>

            <h3>Dimensions:</h3>
            <p>Width: {product.dimensions.width} cm</p>
            <p>Height: {product.dimensions.height} cm</p>
            <p>Depth: {product.dimensions.depth} cm</p>

            <h3>Warranty & Shipping</h3>
            <p>
              Warranty: {product.warrantyInformation}
            </p>
            <p>
              Shipping: {product.shippingInformation}
            </p>
            <p>
              Return Policy: {product.returnPolicy}
            </p>

            <h3>Meta Information</h3>
            <p>
              <strong>Barcode:</strong> {product.meta.barcode}
            </p>
            <img src={product.meta.qrCode} alt="QR Code" width="100" />

            <h3>Product Images</h3>
            <div className={styles.imageGallery}>
              {product.images.map((img, index) => (
                <img key={index} src={img} alt={`${product.title} ${index}`} />
              ))}
            </div>

            <h3>Reviews</h3>
            {product.reviews.map((review, index) => (
              <div key={index} className={styles.review}>
                <p>
                  <strong>{review.reviewerName}</strong> ({review.rating}/5)
                </p>
                <p>{review.comment}</p>
                <p className={styles.reviewDate}>
                  {new Date(review.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}