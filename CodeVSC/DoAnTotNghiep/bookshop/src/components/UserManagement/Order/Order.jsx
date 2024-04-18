import { useState, useEffect } from "react";
import "./Order.css";
import { getAsync, postAsync, putAsync } from "../../../Apis/axios";
import { Input, Space, Button, Modal } from "antd";
import { Navigate, useNavigate } from "react-router-dom";
import { Rate } from "antd";
import { toast } from "react-toastify";
const { Search } = Input;
const Order = () => {
  const [orderItemList, setOrderItemList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState("0");
  const [selectedOrderItem, setSelectedOrderItem] = useState();
  const [comment, setComment] = useState();
  const [isCommentUpdate, setIsCommentUpdate] = useState(false);
  const setContent = (content) => {
    setComment(prevComment => ({
        ...prevComment,
        content: content
    }));
};

const setRate = (rate) => {
    setComment(prevComment => ({
        ...prevComment,
        rate: rate
    }));
};
  const navigate = useNavigate();
  const tabs = [
    { value: "0", name: "All" },
    { value: "1", name: "Wait for pay" },
    { value: "2", name: "Delivering" },
    { value: "3", name: "Complete" },
    { value: "4", name: "Refund" },
  ];
  const { TextArea } = Input;
  const showComment = async (orderItem) => {
    setSelectedOrderItem(orderItem);
    try {
      const res = await getAsync(`/api/Comment/Detail?orderId=${orderItem.id}`);
      setComment(res);
      setIsCommentUpdate(true);
    } catch (error) {
      setComment(null);
      setIsCommentUpdate(false);
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const onChangedContent = (e) => {
      setContent(e.target.value);
  };

  const onRateChanged = (e) => {
    setRate(e);
  }

  const saveComment = async () => {
    try {
      var data = {
        Id: comment.id,
        BookId: selectedOrderItem.bookId,
        Content: comment.content,
        Rate: comment.rate,
        OrderDetailId: selectedOrderItem.id
      };
      if(isCommentUpdate){
        await putAsync("/api/Comment/Update",data);
        toast.success("Update comment successfully", {
          autoClose: 1000,
        });
      }
      else {
        await postAsync("/api/Comment/Add",data);
        toast.success("Add new comment successfully", {
          autoClose: 1000,
        });
      }
      setModalVisible(false);
    } catch (error) {
      
    }
  };

  const fetchOrderData = async () => {
    try {
      var res = await getAsync(
        `/api/OrderDetail/GetByUserId?option=${selectedTab}&searchText=${searchText}`
      );
      setOrderItemList(res);
    } catch (error) {}
  };
  const onSearch = (e) => {
    setSearchText(e);
    console.log(searchText);
  };

  const handleTabClick = (tabValue) => {
    setSelectedTab(tabValue);
  };

  const Repurchase = (id) => {
    navigate(`/Book/${id}`);
  };

  useEffect(() => {
    fetchOrderData();
  }, [selectedTab, searchText]);

  return (
    <div className="order-container">
      <div className="order-navbar">
        {tabs.map((tab) => (
          <div
            key={tab.value}
            className={selectedTab === tab.value ? "selectedTab" : ""}
            onClick={() => handleTabClick(tab.value)}
          >
            {tab.name}
          </div>
        ))}
      </div>
      <div style={{ padding: "15px", backgroundColor: "#f5f5f5" }}>
        <Search
          className="search-input"
          style={{ height: "40px", width: "800px" }}
          size="medium"
          placeholder="Search by title"
          onSearch={onSearch}
          enterButton
        />
      </div>
      <div className="order-main">
        <div className="order-item-list">
          <div className="">
            {orderItemList.length > 0 &&
              orderItemList.map((orderItem, index) => (
                <div
                  style={{
                    backgroundColor: "white",
                    padding: "15px",
                    marginBottom: "15px",
                  }}
                  key={orderItem.id}
                >
                  <div className="order-item">
                    <div className="order-item-info">
                      <img
                        src={orderItem.avatarUrl}
                        alt=""
                        className="cart-item-img"
                      />
                      <div className="">
                        {orderItem.title}
                        <div>x{orderItem.count}</div>
                      </div>
                    </div>
                    <div className="order-item-total">
                      ${orderItem.count * orderItem.price}
                    </div>
                  </div>
                  <div>
                    Delivery address: <br /> {orderItem.name} (
                    {orderItem.phoneNumber}) <br /> {orderItem.address}
                  </div>
                  <div className="operation">
                    {orderItem.orderStatus === 2 &&
                      orderItem.shipStatus === 2 && (
                        <Button
                          type="primary"
                          danger
                          onClick={() => Repurchase(orderItem.bookId)}
                        >
                          Repurchase
                        </Button>
                      )}
                    {orderItem.orderStatus === 2 &&
                      orderItem.shipStatus === 0 && (
                        <Button type="primary" danger>
                          Cancel Order
                        </Button>
                      )}
                    {orderItem.orderStatus === 2 &&
                      orderItem.shipStatus === 1 && (
                        <Button type="primary" danger>
                          Delivering
                        </Button>
                      )}
                    {orderItem.orderStatus === 3 && (
                      <Button type="primary" disabled danger>
                        Canceled
                      </Button>
                    )}
                    {orderItem.orderStatus === 2 &&
                      orderItem.shipStatus === 2 && (
                        <Button type="primary" danger onClick={() => showComment(orderItem)}>
                          Rate
                        </Button>
                      )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <Modal
        width={650}
        closeIcon={false}
        open={modalVisible}
        className="centered-modal"
        footer={[
          <Button key="cancel" onClick={closeModal}>
            Close
          </Button>,
          <Button key="confirm" type="primary" onClick={saveComment}>
            Save
          </Button>,
        ]}
      >
        <h2>Rate product</h2>
        <div>
          Prouct quality:
          <Rate
            style={{ fontSize: "16px", marginLeft: "30px" }}
            value={comment?.rate}
            onChange={onRateChanged}
          />
        </div>
        <div>
          Content:
          <TextArea
            showCount
            maxLength={100}
            onChange={onChangedContent}
            placeholder="Fill comment here"
            value={comment?.content}
            style={{
              height: 120,
              resize: "none",
              marginTop:"10px"
            }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Order;
