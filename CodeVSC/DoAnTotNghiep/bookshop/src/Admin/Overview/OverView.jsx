import { useEffect, useState } from "react";
import { getAsync } from "../../Apis/axios";
import { RiseOutlined, FallOutlined } from "@ant-design/icons";
import "./OverView.css";
import { Select } from "antd";

const OverView = () => {
  const [evaluateModel, setEvalueAteModel] = useState({
    revenue: 0,
    revenueRate: 0,
    countUser: 0,
    userRate: 0,
    countNewOrder: 0,
    newOrderRate: 0,
    averageOrderValue: 0,
    averageOrderValueRate: 0,
  });
  const [option, setOption] = useState(1);
  const fetchData = async () => {
    try {
      var result = await getAsync(
        "/api/Statisticize/EvaluateData?option=" + option
      );
      setEvalueAteModel(result);
    } catch (error) {}
  };

  const optionArr = [
    { value: 1, text: "Previos week" },
    { value: 2, text: "Previos month" },
    { value: 3, text: "Previos year" },
  ];

  useEffect(() => {
    fetchData();
  }, [option]);
  return (
    <div className="overview-container">
      <div>
        <div style={{fontWeight:"5000", fontSize:"24px"}}>Well come back, Xuan Bach!</div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>Here what happening with your store today</div>
          <div>
            <Select
              defaultValue={optionArr[0]}
              style={{
                width: 200,
              }}
              onChange={(value) => setOption(value)}
              options={optionArr.map((option) => ({
                label: option.text,
                value: option.value,
              }))}
            />
          </div>
        </div>
      </div>
      <div className="overview-board-list">
        <div>
          Ecommerce Revenue
          <div>${evaluateModel.revenue}</div>
          {evaluateModel.revenueRate >= 0 && (
            <div>
              <RiseOutlined style={{ color: "#5BEAF3" }} />
              {evaluateModel.revenueRate}%
            </div>
          )}
          {evaluateModel.revenueRate < 0 && (
            <div>
              <FallOutlined style={{ color: "#F05E3E" }} />
              {evaluateModel.revenueRate}%
            </div>
          )}
        </div>
        <div>
          New Customers
          <div>{evaluateModel.countUser}</div>
          {evaluateModel.userRate >= 0 && (
            <div>
              <RiseOutlined />
              {evaluateModel.userRate}%
            </div>
          )}
          {evaluateModel.userRate < 0 && (
            <div>
              <FallOutlined />
              {evaluateModel.userRate}%
            </div>
          )}
        </div>
        <div>
          New Orders
          <div>{evaluateModel.countNewOrder}</div>
          {evaluateModel.newOrderRate >= 0 && (
            <div>
              <RiseOutlined />
              {evaluateModel.newOrderRate}%
            </div>
          )}
          {evaluateModel.newOrderRate < 0 && (
            <div>
              <FallOutlined />
              {evaluateModel.newOrderRate}%
            </div>
          )}
        </div>
        <div>
          Averate Order Value
          <div>${evaluateModel.averageOrderValue}</div>
          {evaluateModel.averageOrderValueRate >= 0 && (
            <div>
              <RiseOutlined />
              {evaluateModel.averageOrderValueRate}%
            </div>
          )}
          {evaluateModel.averageOrderValueRate < 0 && (
            <div>
              <FallOutlined />
              {evaluateModel.averageOrderValueRate}%
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverView;
