import "./PlaceOrder.css";
import { HomeTwoTone } from "@ant-design/icons";
import { useUser } from "../../UserContext";
import React, { useEffect, useState } from "react";
import { Modal, Button, Input } from "antd";
import { useOutletContext } from "react-router-dom";
import { getAsync, postAsync, putAsync, deleteAsync } from "../../Apis/axios";
import { Navigate, useNavigate } from "react-router-dom";
const PlaceOrder = () => {
  const navigate = useNavigate();
  const [searchText,fetchCartData] = useOutletContext();
  const { user } = useUser();
  const [modalDetailVisible, setModalDetailVisible] = useState(false);
  const [modalUpdateVisible, setModalUpdateVisible] = useState(false);
  const [displayUser, setDisplayUser] = useState({ ...user });
  const [tempUser, setTempUser] = useState();
  const [orderItemList, setOrderItemList] = useState([]);
  const [total, setTotal] = useState(0);
  const [orderId, setOrderId] = useState();
  const [status, setStatus] = useState(0);

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
      setTotal(count);
    } catch (error) {}
  };

  const order = async () => {
    try {
      var data = {
        OrderId : orderId,
        Status: status,
        phoneNumber : displayUser.phoneNumber,
        Address: displayUser.address,
        Name: displayUser.name
      }
      var res = await postAsync("/api/Order/PlaceOrder",data);
      fetchCartData();
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {}
  }

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

  useEffect(() => {
    fetchOrderData();
  }, []);
  return (
    <div className="place-order-container">
      <div className="place-order-navbar">
        <div style={{ color: "#33B2FF" }} className="place-order-title">
          Bách Sh<span style={{ color: "#FFCE33" }}>o</span>p
        </div>
        <div
          style={{ borderLeft: "1px solid rgb(238 77 45)", height: "40px" }}
        ></div>
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
                      className="cart-item-img"
                    />
                    <div className="cart-item-title">{orderItem.title}</div>
                  </div>
                  <div className="cartitem-price">${orderItem.price}</div>
                  <div>{orderItem.count}</div>
                  <div className="cart-item-total">
                    ${orderItem.count * orderItem.price}
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="total-container">
          <div style={{fontSize:"24px"}}>
            Total: <span style={{ color: "orange" }}>${total}</span>
          </div>
          <div>
            <Button onClick={() => order()} style={{width:"100px",height:"40px"}} type="primary" danger>
              Order
            </Button>
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
