import { FaShoppingCart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../GlobalContext/GlobalContext";
import "./Account.css";

const Account = () => {
  let { auth, store, modal } = useGlobalContext();
  const cartTotal = store.state.cartQuantity;
  const navigate = useNavigate();

  const handleCartClick = (e) => {
    navigate("/cart");
  };

  const handleLogout = () => {
    auth.logout();
  };

  console.log("auth.state.user", auth.state.user);

  return (
    <div className="account">
      <div className="cart">
        <Link to={"/cart"} className="contains-link-to-accounts" onClick={handleCartClick}>
          {auth.state.user == null ? (
            <span className="account-user">Guest</span>
          ) : (
            <span className="account-user">
              {auth.state.user["custom:username"]}
            </span>
          )}
          <span className="account-details">
            <FaShoppingCart />
            <span className="items-in-cart">{cartTotal}</span>
          </span>
        </Link>
      </div>
      <div className="login">
        {auth.state.user == null ? (
          <button
            className="btn-rounded small-rounded"
            onClick={() => modal.openModal(false)}
          >
            Login
          </button>
        ) : (
          <Link to={"/"} onClick={handleLogout}>
            <button className="btn-rounded small-rounded" >
              Logout
            </button>
          </Link>

        )}
      </div>
    </div>
  );
};

export default Account;
