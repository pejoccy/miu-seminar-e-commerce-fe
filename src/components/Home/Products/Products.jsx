import { memo } from "react";
import { useGlobalContext } from "../../GlobalContext/GlobalContext";
import Product from "./Product/Product";
import "./Products.css"; // Ensure you have the correct path to your CSS file

const Products = () => {
  const { store } = useGlobalContext();

  return (
    <div className="sub-container" id="products">
      {store.state.categories.map((category) => (
        <div key={category.category} className="category">
          <h2>{category.category || "Unknown Category"}</h2>
          <div className="contains-product">
            {category.items.map((product) => (
              <Product key={product.productId} product={product} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default memo(Products);
