import { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import { useGlobalContext } from "../GlobalContext/GlobalContext";
import "./Modal.css";

const CancelOrder = () => {
  const { modal, orders, auth } = useGlobalContext();
  let [loading, setLoading] = useState(false);
  const handleClose = () => {
    modal.closeCancelModal();
  };
  const submitForm = (e) => {
    console.log("attempting to cancel order");
    e.preventDefault();
    setLoading(true);
    const order_to_be_cancelled = orders.state.order_to_be_canceled;
    orders
      .cancelOrder(order_to_be_cancelled)
      .then(() => {
        toast.success(
          `Order #${order_to_be_cancelled} has been canceled`
        );
        // get new orders
        orders.getOrders(auth.state.user.id);
        handleClose();
      })
      .catch(() => {
        toast.error("There was an issue cancelling your order");
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <div className="modal-container">
      <div className="modal">
        <div className="modal-cancel">
          <button
            href="/"
            className="modal-cancel-button"
            onClick={handleClose}
          >
            X
          </button>
        </div>
        <div className="modal-header">
          <h3>Are you sure you want to cancel your order?</h3>
        </div>
        <div className="modal-body">
          <form onSubmit={submitForm}>
            <div className="form-group cancel-modal-group">
              <button
                type="submit"
                className="btn-rounded btn-submit btn-submit-small btn-cancel"
              >
                Cancel my order
                <span>
                  <ClipLoader
                    loading={loading}
                    size={10}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                </span>
              </button>
              <button
                type="button"
                className="btn-rounded btn-submit btn-submit-small"
                onClick={() => {
                  modal.closeCancelModal();
                }}
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CancelOrder;
