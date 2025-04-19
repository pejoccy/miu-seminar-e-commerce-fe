import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Product } from "../../../store/interfaces";
import { useGlobalContext } from "../../GlobalContext/GlobalContext";
import ProdComponent from "../../Home/Products/Product/Product";
import "./SearchPage.css";

const baseUrl = process.env.REACT_APP_BASE_URL;

interface ExtendedProduct extends Product {
    quantity: number;
    addedToCart: boolean;
    rating: number;
    times_bought: number;
    product_image: string;
}

const SearchPage = () => {
    const { store } = useGlobalContext();
    const [products, setProducts] = useState<ExtendedProduct[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const location = useLocation();

    console.log("products", products);

    console.log("store", store);
    console.log("store.state.cart", store.state.cart);

    const query = new URLSearchParams(location.search);
    const keyword = query.get("keyword");

    useEffect(() => {
        const fetchProducts = async () => {
            if (!keyword) return;
            setLoading(true);
            setError("");
            try {
                const res = await fetch(`${baseUrl}/products?keyword=${encodeURIComponent(keyword)}`);
                if (!res.ok) throw new Error("Failed to fetch products");
                const data = await res.json();
                const transformed = data.map((product: Product) => ({
                    ...product,
                    quantity: store.state.cart.find((cartItem: Product) => cartItem.productId === product.productId)?.quantity || 0,
                    rating: 5,
                    times_bought: 0,
                    product_image: product.imageUrl,
                    addedToCart: store.state.cart.some((cartItem: Product) => cartItem.productId === product.productId),
                }));
                setProducts(transformed);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [keyword]);

    useEffect(() => {
        const updatedProducts = products.map((product: ExtendedProduct) => ({
            ...product,
            quantity: store.state.cart.find((cartItem: Product) => cartItem.productId === product.productId)?.quantity || 0,
            addedToCart: store.state.cart.some((cartItem: Product) => cartItem.productId === product.productId),
        }));
        setProducts(updatedProducts);
    }, [store.state.cart]);

    return (
        <div style={{ padding: "1rem" }}>
            <h2>Search Results for: "{keyword}"</h2>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {!loading && !error && products.length === 0 && <p>No products found.</p>}
            <div className="products-grid">
                {products.map((product: Product) => (
                    <ProdComponent key={product.productId} product={product} />
                ))}
            </div>
        </div>
    );
};

export default SearchPage;