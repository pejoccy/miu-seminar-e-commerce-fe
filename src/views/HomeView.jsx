import "../assets/css/main.css";
import Banner from "../components/Home/Banner/Banner";
import Benefits from "../components/Home/Benefits/Benefits";
import Products from "../components/Home/Products/Products";

function HomeView() {
  return (
    <div>
      <main>
        <section className="hero-section">
          <Banner></Banner>
        </section>
        <section className="benefits-section"></section>
        <section>
          <Benefits></Benefits>
        </section>
        <section className="products-section">
          <Products></Products>
        </section>
      </main>
    </div>
  );
}

export default HomeView;
