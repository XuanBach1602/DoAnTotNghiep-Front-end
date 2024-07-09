import { useEffect, useState } from "react";
import { RiseOutlined, FallOutlined } from "@ant-design/icons";
import "./OverView.css";
import { Select } from "antd";
import useApi from "../../Apis/useApi";
import { Column } from '@ant-design/charts';
import moment from 'moment';

const OverView = () => {
  const { deleteAsync, getAsync, postAsync, putAsync } = useApi();
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
  const [saleData, setSaleData] = useState([]);
  const [option, setOption] = useState(1);

  const fetchData = async () => {
    try {
      var result = await getAsync(
        "/api/Statisticize/EvaluateData?option=" + option
      );
      setEvalueAteModel(result);
    } catch (error) {}
  };

  const fetchSaleData = async () => {
    try {
      var result = await getAsync("/api/Statisticize/GetSaleData");
      setSaleData(result);
    } catch (error) {}
  };

  const optionArr = [
    { value: 1, text: "Previous week" },
    { value: 2, text: "Previous month" },
    { value: 3, text: "Previous year" },
  ];

  useEffect(() => {
    fetchData();
  }, [option]);

  useEffect(() => {
    fetchSaleData();
  }, []);

  const chartData = saleData.map((sale, index) => {
    const date = moment().subtract(7 - index, 'days').format('DD-MM-YYYY');
    return { day: date, sales: sale };
  });

  const config = {
    data: chartData,
    xField: 'day',
    yField: 'sales',
    label: {
      formatter: (text) => `$${text}`,
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    yAxis: {
      label: {
        formatter: (text) => `$${text}`,
      },
    },
    meta: {
      day: { alias: 'Day' },
      sales: { alias: 'Sales' },
    },
  };

  return (
    <div className="overview-container">
      <div>
        <div style={{ fontWeight: "5000", fontSize: "24px" }}>
          Well come back, Xuan Bach!
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>Here what happening with your store today</div>
          <div>
            <Select
              defaultValue={optionArr[0].value}
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
          New Customers
          <div>{evaluateModel.countUser}</div>
          {evaluateModel.userRate >= 0 && (
            <div>
              <RiseOutlined />
              {(evaluateModel.userRate)?.toFixed(2)}%
            </div>
          )}
          {evaluateModel.userRate < 0 && (
            <div>
              <FallOutlined />
              {(evaluateModel.userRate)?.toFixed(2)}%
            </div>
          )}
        </div>
        <div>
          New Orders
          <div>{evaluateModel.countNewOrder}</div>
          {evaluateModel.newOrderRate >= 0 && (
            <div>
              <RiseOutlined />
              {(evaluateModel.newOrderRate)?.toFixed(2)}%
            </div>
          )}
          {evaluateModel.newOrderRate < 0 && (
            <div>
              <FallOutlined />
              {(evaluateModel.newOrderRate)?.toFixed(2)}%
            </div>
          )}
        </div>
        <div>
          Average Order Value
          <div>${(evaluateModel.averageOrderValue).toFixed(2)}</div>
          {evaluateModel.averageOrderValueRate >= 0 && (
            <div>
              <RiseOutlined />
              {(evaluateModel.averageOrderValueRate)?.toFixed(2)}%
            </div>
          )}
          {evaluateModel.averageOrderValueRate < 0 && (
            <div>
              <FallOutlined />
              {(evaluateModel.averageOrderValueRate)?.toFixed(2)}%
            </div>
          )}
        </div>
      </div>
      <div>
        <h3>Sales Data (Last 7 Days)</h3>
        <Column {...config} />
      </div>
    </div>
  );
};

export default OverView;
