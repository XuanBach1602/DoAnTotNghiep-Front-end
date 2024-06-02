import "./PlaceOrder.css";
import { HomeTwoTone, UnorderedListOutlined } from "@ant-design/icons";
import { useUser } from "../../UserContext";
import React, { useEffect, useState } from "react";
import { Modal, Button, Input, Dropdown, Checkbox, Space, Menu } from "antd";
import { useOutletContext } from "react-router-dom";
import { getAsync, postAsync, putAsync, deleteAsync } from "../../Apis/axios";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
const PlaceOrder = () => {
  const stripePublicKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY;
  const stripePromise = loadStripe(stripePublicKey);
  const navigate = useNavigate();
  const [searchText, fetchCartData] = useOutletContext();
  const { user } = useUser();
  const [modalDetailVisible, setModalDetailVisible] = useState(false);
  const [modalUpdateVisible, setModalUpdateVisible] = useState(false);
  const [displayUser, setDisplayUser] = useState({ ...user });
  const [tempUser, setTempUser] = useState();
  const [orderItemList, setOrderItemList] = useState([]);
  const [tempTotal, setTempTotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [orderId, setOrderId] = useState();
  const [status, setStatus] = useState(0);
  const [reduce, setReduce] = useState(0);
  const [voucherList, setVoucherList] = useState([]);
  const [discountId, setDiscountId] = useState();
  const [voucherName, setVoucherName] = useState("");
  const [menuList, setMenuList] = useState([
    {
      key: 1,
      label: <div>2</div>,
    },
  ]);
  const fetchOrderData = async () => {
    try {
      var res = await getAsync("/api/Order/GetCurrentOrder");
      var orderDetails = res.orderDetails;
      setOrderItemList(orderDetails);
      var count = 0;
      for (let i = 0; i < orderDetails.length; i++) {
        count += orderDetails[i].price * orderDetails[i].count;
      }
      setOrderId(res.id);
      setTempTotal(count);
      setTotal(count);
    } catch (error) {}
  };

  const order = async () => {
    try {
      var data = {
        OrderId: orderId,
        Status: status,
        PhoneNumber: displayUser.phoneNumber,
        Address: displayUser.address,
        Name: displayUser.name,
        Total: total,
        TempTotal: tempTotal,
        DiscountId: discountId? discountId:"",
        Reduce: reduce
      };
      console.log(stripePublicKey);
      var res = await postAsync("/api/Order/PlaceOrder", data);
      fetchCartData();
      const sessionId = res.sessionId;
      console.log(sessionId);
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error("Error redirecting to checkout:", error);
      }
      // setTimeout(() => {
      //   navigate("/");
      // }, 1000);
    } catch (error) {}
  };

  const handleNameChange = (e) => {
    setTempUser({
      ...tempUser,
      name: e.target.value,
    });
  };

  const handlePhoneNumberChange = (e) => {
    console.log(e.target.value);
    setTempUser({
      ...tempUser,
      phoneNumber: e.target.value,
    });
  };

  const handleAddressChange = (e) => {
    setTempUser({
      ...tempUser,
      address: e.target.value,
    });
  };
  const cancelDetailView = () => {
    setModalDetailVisible(false);
  };

  const updateAddress = () => {
    setModalDetailVisible(false);
    setDisplayUser(tempUser);
  };

  const showUpdateModal = () => {
    setModalDetailVisible(false);
    setModalUpdateVisible(true);
    setTempUser({ ...user });
  };

  const cancelUpdateModal = () => {
    setModalDetailVisible(true);
    setModalUpdateVisible(false);
    setTempUser({ ...user });
  };

  const saveTempUser = () => {
    setModalDetailVisible(true);
    setModalUpdateVisible(false);
  };
  const showDetailModal = () => {
    setModalDetailVisible(true);
    setTempUser({ ...user });
  };

  const fetchDiscountList = async () => {
    try {
      var res = await getAsync("/api/Discount/GetAll");
      setVoucherList(res);
    } catch (error) {}
  };

  const getVoucherTag = (voucher) => {
    if (voucher.type === 1) {
      return (
        <div>
          <Checkbox
            checked={discountId === voucher.id}
            onChange={(e) => {
              if (e.target.checked) {
                setVoucherName(voucher.name);
                setDiscountId(voucher.id);
                var discount = 0;
                if (voucher.discount > tempTotal) discount = tempTotal;
                else discount = voucher.discount;
                discount = parseFloat(discount.toFixed(2)); // Làm tròn đến 2 chữ số sau dấu thập phân
                setReduce(discount);
                setTotal(parseFloat((tempTotal - discount).toFixed(2))); // Làm tròn đến 2 chữ số sau dấu thập phân
              } else {
                setDiscountId(null);
                setReduce(0);
                setTotal(tempTotal);
              }
            }}
          />
          <strong>{voucher.name}</strong> (Reduce {voucher.discount}$)
        </div>
      );
    }
    if (voucher.type === 2) {
      return (
        <div>
          <Checkbox
            checked={discountId === voucher.id}
            onChange={(e) => {
              if (e.target.checked) {
                setVoucherName(voucher.name);
                setDiscountId(voucher.id);
                var discount = (voucher.rate * tempTotal) / 100;
                if (discount > voucher.maxDiscount) discount = voucher.maxDiscount;
                discount = parseFloat(discount.toFixed(2));
                setReduce(discount);
                setTotal(parseFloat((tempTotal - discount).toFixed(2)));
              } else {
                setDiscountId(null);
                setReduce(0);
                setTotal(tempTotal);
              }
            }}
          />
          <strong>{voucher.name}</strong> (Reduce {voucher.rate}% up to{" "}
          {voucher.maxDiscount}$)
        </div>
      );
    }
    
  };

  const updateMenuItems = () => {
    var menuItems = voucherList.map((item) => ({
      key: item.id,
      label: getVoucherTag(item),
    }));
    setMenuList(menuItems);
  };

  useEffect(() => {
    fetchOrderData();
    fetchDiscountList();
  }, []);

  useEffect(() => {
    updateMenuItems(menuList);
  }, [discountId, voucherList]);

  useEffect(() => {
    setTotal(parseFloat((tempTotal - reduce).toFixed(2)));
  },[reduce])
  return (
    <div className="place-order-container">
      <div className="place-order-navbar">
        <div style={{ color: "rgb(51, 178, 255)" }}>Place Order</div>
      </div>
      <div className="placeorder-main">
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
              {displayUser?.name} {displayUser?.phoneNumber}
            </span>{" "}
            &nbsp; {displayUser?.address}
            <span className="change-address-btn" onClick={showDetailModal}>
              Change
            </span>
          </div>
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
                      className="order-item-img"
                    />
                    <div className="cart-item-title">{orderItem.title}</div>
                  </div>
                  <div className="cartitem-price">${orderItem.price}</div>
                  <div>{orderItem.count}</div>
                  <div className="cart-item-tempTotal">
                    ${orderItem.count * orderItem.price}
                  </div>
                </div>
              ))}
          </div>
          <div style={{backgroundColor:"white", marginTop:"15px", padding:"15px"}}>
            <div className="tempTotal-container">
              <div style={{ fontSize: "24px" }}>
                Temporary Total: <span style={{ color: "orange" }}>${tempTotal}</span>
              </div>
            </div>
            <hr style={{ border: "none", height: "1px", backgroundColor: "#D3CBC9" }} />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "99%",
                backgroundColor: "white",
                marginTop: "15px",
                padding: "10px 0 10px 10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexBasis: "33%",
                }}
              >
                <UnorderedListOutlined
                  style={{ color: "orange", marginRight: "8px" }}
                />
                My voucher
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexBasis: "33%",
                }}
              >
                <Dropdown
                  menu={{
                    items: menuList,
                  }}
                >
                  <div style={{ cursor: "pointer" }}>Select Voucher <strong>{voucherName}</strong></div>
                </Dropdown>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  flexBasis: "33%",
                }}
              >
                <div style={{ cursor: "pointer" }}>Reduce {reduce}$</div>
              </div>
            </div>
            <hr style={{ border: "none", height: "1px", backgroundColor: "#D3CBC9" }} />
            <div className="tempTotal-container">
            <div style={{ fontSize: "24px" }}>
              Total: <span style={{ color: "orange" }}>${total}</span>
            </div>
            <div>
              <Button
                onClick={() => order()}
                style={{ width: "100px", height: "40px" }}
                type="primary"
                danger
              >
                Order
              </Button>
            </div>
          </div>
          </div>
          
        </div>
      </div>

      <Modal
        open={modalDetailVisible}
        //   onCancel={onDetailViewCancel}
        className="centered-modal"
        footer={[
          <Button key="cancel" onClick={cancelDetailView}>
            Close
          </Button>,
          <Button key="confirm" type="primary" onClick={updateAddress}>
            Save
          </Button>,
        ]}
      >
        <div>My Address</div>
        <hr />
        <div>
          <div>
            <span>{tempUser?.name}</span>
            <span
              style={{
                borderLeft: "1px solid black",
                height: "40px",
                margin: "0 10px",
              }}
            />
            <span>{tempUser?.phoneNumber}</span>
            <span
              style={{
                marginLeft: "200px",
                color: "#00A2DA",
                cursor: "pointer",
              }}
              onClick={showUpdateModal}
            >
              Update
            </span>
            <div>{tempUser?.address}</div>
          </div>
        </div>
      </Modal>

      <Modal
        width={650}
        closeIcon={false}
        open={modalUpdateVisible}
        className="centered-modal"
        footer={[
          <Button key="cancel" onClick={cancelUpdateModal}>
            Close
          </Button>,
          <Button key="confirm" type="primary" onClick={saveTempUser}>
            Save
          </Button>,
        ]}
      >
        <div>
          <div style={{ display: "flex", gap: "15px" }}>
            <div style={{ flex: "1" }}>
              <label>Full Name</label>
              <Input
                placeholder="Basic usage"
                value={tempUser?.name}
                onChange={handleNameChange}
              />
            </div>
            <div style={{ flex: "1" }}>
              <label>Phone Number</label>
              <Input
                placeholder="Basic usage"
                value={tempUser?.phoneNumber}
                onChange={handlePhoneNumberChange}
              />
            </div>
          </div>
          <div>
            <label>Province/City, District/District, Ward/Commune</label>
            <Input
              placeholder="Basic usage"
              value={tempUser?.address}
              onChange={handleAddressChange}
            />
          </div>
          {/* <div>
        <label>Specific Address</label>
            <Input placeholder="Basic usage" value={tempUser?.name}/>
        </div> */}
        </div>
      </Modal>
    </div>
  );
};

export default PlaceOrder;
