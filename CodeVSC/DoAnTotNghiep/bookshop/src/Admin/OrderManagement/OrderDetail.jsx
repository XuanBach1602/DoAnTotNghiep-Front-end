import { useEffect, useState } from "react";
import useApi from "../../Apis/useApi";
import { useParams } from "react-router-dom";
import { HomeTwoTone, RollbackOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { Button, Input, Row, Col, Form, Popconfirm } from "antd";
const OrderDetail = () => {
  const { deleteAsync, getAsync, postAsync, putAsync } = useApi();
  const [orderItemList, setOrderItemList] = useState([]);
  const [order, setOrder] = useState();
  const [total, setTotal] = useState(0);
  let { id } = useParams();
  const FormItem = Form.Item;
  const fetchOrderData = async () => {
    try {
      var response = await getAsync(`/api/Order/GetOrderById?orderId=${id}`);
      setOrder(response);
      setOrderItemList(response.orderDetails);
      var orderDetails = response.orderDetails;
      var count = 0;
      for (let i = 0; i < orderDetails.length; i++) {
        count += orderDetails[i].price * orderDetails[i].count;
      }
      setTotal(count);
    } catch (error) {}
  };

  const updateStatus = async (status, shipStatus) => {
    try {
      var response = await putAsync(
        `/api/Order/UpdateStatus?id=${order?.id}&status=${status}&shipStatus=${shipStatus}`
      );
      toast.success("Update the order successfully", {
        autoClose: 1000,
      });
      fetchOrderData();
    } catch (error) {}
  };

  const goBack = () => {
    window.history.back();
  };

  useEffect(() => {
    fetchOrderData();
  }, []);
  return (
    <div className="place-order-container">
      <div
        style={{
          margin: "20px 0px 0px 20px",
          width: "20px",
          height: "20px",
          cursor: "pointer",
        }}
      >
        <RollbackOutlined onClick={goBack} />
      </div>
      <div className="placeorder-main">
        <h2 style={{ marginTop: 0 }}>Order information</h2>
        {order?.status == -1 && <h3>Canceled</h3>}
        {order?.status == 1 && <h3>Wait for pay</h3>}
        {order?.status == 2 && order?.shipStatus == 0 && (
          <h3>Not shipped yet</h3>
        )}
        {order?.status == 2 && order?.shipStatus == 1 && <h3>Shiping</h3>}
        {order?.status == 2 && order?.shipStatus == 2 && <h3>Shipped</h3>}
        <Form layout="vertical">
          <Row className="form-data" gutter={[16, 1]}>
            {" "}
            {/* Thay đổi giá trị gutter ở đây */}
            <Col span={12}>
              <FormItem label="Name" style={{ marginBottom: 0 }}>
                {" "}
                {/* Giảm margin dưới */}
                <Input value={order?.name} placeholder="Name" readOnly />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Email" style={{ marginBottom: 0 }}>
                <Input value={order?.email} placeholder="Email" readOnly />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Phone Number" style={{ marginBottom: 0 }}>
                <Input
                  value={order?.phoneNumber}
                  placeholder="Phone Number"
                  readOnly
                />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Code" style={{ marginBottom: 0 }}>
                <Input value={order?.code} placeholder="Code" readOnly />
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem label="Address" style={{ marginBottom: 8 }}>
                <Input value={order?.address} placeholder="Address" readOnly />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Created Date" style={{ marginBottom: 8 }}>
                <Input
                  value={order?.createdDate}
                  placeholder="Created Date"
                  readOnly
                />
              </FormItem>
            </Col>
            {order?.status === 2 && order?.shipStatus === 2 && (
              <Col span={12}>
                <FormItem label="Shipped Date" style={{ marginBottom: 8 }}>
                  <Input
                    readOnly
                    value={order?.shippedDate}
                    placeholder="Shipped Date"
                  />
                </FormItem>
              </Col>
            )}
          </Row>
        </Form>
        <div
          style={{
            display: "flex",
            gap: "20px",
            marginTop: "20px",
            marginBottom: "15px",
          }}
        >
          {(order?.status === 1 ||
            (order?.status === 2 && order?.shipStatus === 0)) && (
            <div style={{ display: "flex", gap: "20px" }}>
              <Popconfirm
                title="Are you sure you want to cancel your order?"
                okText="Yes"
                cancelText="No"
                onConfirm={() => updateStatus(-1, 0)}
              >
                <Button danger>Cancel Order</Button>
              </Popconfirm>
            </div>
          )}
          {order?.status === 2 && order?.shipStatus === 0 && (
            <div style={{ display: "flex", gap: "20px" }}>
              <Popconfirm
                title="
Are you sure you want to send the books?"
                okText="Yes"
                cancelText="No"
                onConfirm={() => updateStatus(2, 1)}
              >
                <Button>Ship</Button>
              </Popconfirm>
            </div>
          )}
          {order?.status === 2 && order?.shipStatus === 1 && (
            <div style={{ display: "flex", gap: "20px" }}>
              <Popconfirm
                title="
Are you sure you want to complete your order?"
                okText="Yes"
                cancelText="No"
                onConfirm={() => updateStatus(2, 2)}
              >
                <Button>Complete</Button>
              </Popconfirm>
            </div>
          )}
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
                    ${(orderItem.count * orderItem.price)?.toFixed(2)}
                  </div>
                </div>
              ))}
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
            <div style={{ width: "180px", textAlign: "left" }}>
              Temporary Total:{" "}
            </div>
            <div style={{ color: "orange", minWidth: "100px" }}>
              ${(order?.tempTotal)?.toFixed(2)}
            </div>
          </div>
        </div>
        <hr />
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
        <hr />
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

export default OrderDetail;
