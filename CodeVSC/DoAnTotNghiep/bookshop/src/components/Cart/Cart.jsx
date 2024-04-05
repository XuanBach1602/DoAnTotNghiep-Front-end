import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";
import { Checkbox, Button, Input, Modal } from "antd";
import { PlusOutlined, MinusOutlined, DeleteTwoTone } from "@ant-design/icons";
import { getAsync, postAsync, putAsync, deleteAsync } from "../../Apis/axios";
import { toast } from "react-toastify";

const Cart = () => {
  const [cartItemList, setCartItemList] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [currentId, setCurrentId] = useState(0);
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [selectedCount,setSelectedCount] = useState(0);

  const navigate = useNavigate();

  const fetchCartItemData = async () => {
    try {
      var res = await getAsync("/api/CartItem/GetAllByUserId");
      setCartItemList(res);
      var result = res.some(x => x.isChecked === false);
      if(result) setIsCheckAll(false);
      else setIsCheckAll(true);
    } catch (error) {}
  };

  const handleIncreaseCount = async (index,id) => {
    var count = cartItemList[index].count + 1;
    try {
        var res = await putAsync(`/api/CartItem/UpdateQuantity?id=${id}&count=${count}`);
        fetchCartItemData();
      } catch (error) {}
  };

  const handleDecreaseCount = async (index,id) => {
    if (cartItemList[index].count-- > 0) {
      try {
        var res = await putAsync(`/api/CartItem/UpdateQuantity?id=${id}&count=${cartItemList[index].count}`);
        fetchCartItemData();
      }
      catch (error) {}
    }    
  };

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    let selectedCount = 0;
    cartItemList.forEach((item) => {
      if (item.isChecked) {
        totalPrice += item.count * item.price;
        selectedCount ++;
      }
      setSelectedCount(selectedCount);
    });
    setTotalPrice(totalPrice);
  };
  

  const showConfirmation = (id) => {
    setModalVisible(true);
    setCurrentId(id);
  }

  const deleteCartItem = async (id) => {
    try {
      const res = await deleteAsync("/api/CartItem/Delete?id="+ id);
      fetchCartItemData();
    } catch (error) {  
    }
  }

  const createOrder = async() => {
    if(selectedCount === 0){
      toast.info("Please select at least one product", {
        autoClose: 1000,
      });
    }
    else{
      var data = cartItemList.filter(x => x.isChecked === true).map(x => ({
        BookId:x.bookId,
        Count:x.count,
        price:x.price,
        CartItemId: x.id
      }));
      try {
        const res = await postAsync("/api/Order/Add",data);
        navigate("/PlaceOrder")
      } catch (error) {  
      }
    }
  }

  const updateCheck = async(id,check) => {
    try {
      const res = await putAsync("/api/CartItem/UpdateCheck?id="+ id + "&check=" + check);
      fetchCartItemData();
      var result = res.some(x => x.isChecked === false);
      if(result) setIsCheckAll(false);
      else setIsCheckAll(true);
    } catch (error) {  
    }
  }

  const checkAll = async() => {
    try {
      const res = await putAsync("/api/CartItem/CheckAll?check=" + !isCheckAll);
      fetchCartItemData();
      setIsCheckAll(!isCheckAll);
    } catch (error) {  
    }
  }

  useEffect(() => {
    calculateTotalPrice();
  },[cartItemList])

  useEffect(() => {
    fetchCartItemData();
  }, []);

  //Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleYes = () => {
    setConfirmLoading(true);
    deleteCartItem(currentId);
    setModalVisible(false)
    setTimeout(() => {
      setConfirmLoading(false);
    }, 2000); 
  };

  const handleNo = () => {
    setModalVisible(false); 
  };
  return (
    <div className="cart-page">
      <div id="cart-title">CART</div>
      <div className="cart-container">
        <div className="cart-left">
          <div className="cart-info">
          <Checkbox
              checked={isCheckAll}
              onChange={() => checkAll()}
            >
              All
            </Checkbox>
            <div>Price</div>
            <div>Quantity</div>
            <div>Into money</div>
          </div>
          {cartItemList.length > 0 &&
            cartItemList.map((cartItem, index) => (
              <div className="cartitem" key={cartItem.id}>
                <div className="cartitem-info">
                <Checkbox
                    checked={cartItem.isChecked}
                    onChange={() => updateCheck(cartItem.id,!cartItem.isChecked)}
                  />
                  <img
                    src={cartItem.avatarUrl}
                    alt=""
                    className="cart-item-img"
                  />
                  <div className="cart-item-title">{cartItem.title}</div>
                </div>
                <div className="cartitem-price">${cartItem.price}</div>
                <div className="book-count">
                  <Button onClick={() => handleIncreaseCount(index,cartItem.id)}>
                    <PlusOutlined />
                  </Button>
                  <Input
                    type="number"
                    min={0}
                    style={{ width: "60px", textAlign: "center" }}
                    value={cartItem.count}
                  />
                  <Button onClick={() => handleDecreaseCount(index,cartItem.id)}>
                    <MinusOutlined />
                  </Button>
                </div>
                <div className="cart-item-total">
                  ${cartItem.count * cartItem.price}
                </div>
                <DeleteTwoTone
                  onClick={() => showConfirmation(cartItem.id)}
                  twoToneColor={"red"}
                  style={{ color: "#ff0000" }}
                  className="delete-icon"
                />
              </div>
            ))}
        </div>
        <div className="cart-right">
            <div className="total-price-title">
                Total Price: ${totalPrice}
            </div>
            <Button style={{marginLeft:"20px",marginTop:"20px",width:"150px"}} type="primary" danger onClick={() => createOrder()}>
               Buy({selectedCount})
               </Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
