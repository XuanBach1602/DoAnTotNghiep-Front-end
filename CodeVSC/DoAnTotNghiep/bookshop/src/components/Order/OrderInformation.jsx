import "./OrderInformation.css";
import { useEffect, useState } from "react";
import useApi from "../../Apis/useApi";
import { useParams } from "react-router-dom";
import { LeftOutlined, HomeTwoTone } from "@ant-design/icons";
import { toast } from "react-toastify";
import { useUser } from "../../UserContext";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "antd";
import { loadStripe } from '@stripe/stripe-js';
const OrderInformation = () => {
  const { user } = useUser();
  let { id } = useParams();
  const { deleteAsync, getAsync, postAsync, putAsync } = useApi();
  const stripePublicKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY;
  const stripePromise = loadStripe(stripePublicKey);
  const [orderItemList, setOrderItemList] = useState([]);
  const [order, setOrder] = useState();
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  const { confirm } = Modal;
  const showCancelConfirm = () => {
    confirm({
      title: 'Are you sure you want to cancel this order?',
      onOk() {
        Cancel(id);
      },
      onCancel() {        
      },
    });
  };

  const Cancel = async (orderId) => {
    try {
      var res = await postAsync(`/api/Order/Cancel?orderId=${orderId}`)
      toast.success("Cancel order successfully", {
        autoClose: 1000,
      });
      fetchOrderData();
    } catch (error) {
      toast.error("Cancel order fail, try again", {
        autoClose: 1000,
      });
    }
  }

  const PlaceOrder = async (orderId) => {
    try {
      var res = await getAsync(`/api/Order/CreatePayment?orderId=${orderId}`);    
      const sessionId = res.sessionId;
      console.log(sessionId)
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
          console.error('Error redirecting to checkout:', error);
      }
    } catch (error) {
      
    }
  }

  const fetchOrderData = async () => {
    try {
      var response = await getAsync(`/api/Order/GetOrderById?orderId=${id}`);
      setOrder(response);
      setOrderItemList(response.orderDetails);
    } catch (error) {}
  };
  const goBack = () => {
    window.history.back();
  };
  useEffect(() => {
    fetchOrderData();
  }, []);
  useEffect(() => {
    getStatus();
  }, [order]);
  const getStatus = () => {
    if (order?.status == -1) {
      setStatus("Canceled");
    } else if (order?.status == 1) {
      setStatus("Wait for pay");
    } else if (order?.status == 2 && order?.shipStatus == 0) {
      setStatus("Not shipped yet");
    } else if (order?.status == 2 && order?.shipStatus == 1) {
      setStatus("Shipping");
    } else if (order?.status == 2 && order?.shipStatus == 2) {
      setStatus("Shipped");
    } else {
      setStatus("Unknown status");
    }
  };

  return (
    <div className="order-information">
      <div className="order-information-navbar">
        <div style={{cursor:"pointer"}} onClick={() => navigate("/User/Orders")}>
          <LeftOutlined style={{ font: "24px" }} /> Back
        </div>
        <div>
           {order?.status === 1 
                      && (
                        <Button type="primary" style={{marginRight:"20px"}} danger onClick={() => PlaceOrder(id)}>
                          Place Order
                        </Button>
                      )}
          {(order?.status === 1|| (order?.status === 2 && order?.shipStatus ===0)) && <Button type="primary" danger style={{marginRight:"20px"}} onClick={() => showCancelConfirm()}>Cancel Order</Button> }
          Order Code {order?.code} |{" "}
          <span style={{ color: "#EB6526" }}>{status}</span>
        </div>
      </div>
      <div className="placeorder-header">
        <div>
          <HomeTwoTone twoToneColor={"red"} /> Delivery Address
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          <span>
            {user?.name} {user?.phoneNumber}
            <br />
            {user?.address}
          </span>
        </div>
        <div>
          Ordered Date: {order?.createdDate}
        </div>
        {order?.status == 2 && order?.shipStatus === 2 && <div>Shipped Date: {order?.shippedDate}</div>}
      </div>
      <div className="product-list">
        <div className="cart-left">
          <div className="cart-info">
            <div></div>
            <div>Price</div>
            <div>Quantity</div>
            <div>Into money</div>
          </div>
          {orderItemList.length > 0 &&
            orderItemList.map((orderItem, index) => (
              <div className="cartitem" key={orderItem.id}>
                <div className="cartitem-info">
                  <img
                    src={orderItem.avatarUrl}
                    alt=""
                    className="cart-item-img"
                    style={{cursor:"pointer"}}
                    onClick={(() => navigate(`/Book/${orderItem.bookId}`))}
                  />
                  <div className="cart-item-title">{orderItem.title}</div>
                </div>
                <div className="cartitem-price">${orderItem.price}</div>
                <div>{orderItem.count}</div>
                <div className="cart-item-total">
                  ${(orderItem.count * orderItem.price)?.toFixed(2)}
                </div>
              </div>
            ))}
        </div>
      </div>
      <div style={{backgroundColor:"white",padding:"0 20px 20px 0"}}>
        <div className="total-container">
          <div
            style={{
              fontSize: "24px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <div style={{ width: "180px", textAlign: "left" }}>
              Temporary Total:{" "}
            </div>
            <div style={{ color: "orange", minWidth: "100px" }}>
              ${(order?.tempTotal)?.toFixed(2)}
            </div>
          </div>
        </div>
        <div className="total-container">
          <div
            style={{
              fontSize: "24px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <div style={{ width: "180px", textAlign: "left" }}>Reduce:</div>{" "}
            <div
              style={{
                color: "orange",
                display: "inline-block",
                minWidth: "100px",
              }}
            >
              ${order?.reduce}
            </div>
          </div>
        </div>
        <div className="total-container">
          <div
            style={{
              fontSize: "24px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <div style={{ width: "180px", textAlign: "left" }}> Total:</div>{" "}
            <div
              style={{
                color: "orange",
                display: "inline-block",
                minWidth: "100px",
              }}
            >
              ${order?.total}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderInformation;
